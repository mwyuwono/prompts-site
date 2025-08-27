#!/bin/bash

# CSS Migration Safety Script
# Provides automated backup, rollback, and validation mechanisms

set -e  # Exit on any error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." &> /dev/null && pwd)"
CSS_DIR="$PROJECT_ROOT/prompts-site-webflow-export/css"
BACKUP_BASE="$PROJECT_ROOT/css-migration-backups"
RESULTS_DIR="$PROJECT_ROOT/tests/results"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create timestamped backup
create_backup() {
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_dir="$BACKUP_BASE/backup_$timestamp"
    
    log_info "Creating backup: $backup_dir"
    
    mkdir -p "$backup_dir"
    cp -r "$CSS_DIR" "$backup_dir/"
    
    # Also create git checkpoint
    cd "$PROJECT_ROOT"
    git add -A
    git commit -m "CSS Migration checkpoint: $timestamp" || log_warning "Git commit failed (may be no changes)"
    git tag "css-migration-$timestamp"
    
    echo "$backup_dir" > "$BACKUP_BASE/latest_backup"
    
    log_success "Backup created: $backup_dir"
    echo "$backup_dir"
}

# Rollback to specific backup
rollback() {
    local backup_dir="$1"
    
    if [[ -z "$backup_dir" ]]; then
        if [[ -f "$BACKUP_BASE/latest_backup" ]]; then
            backup_dir=$(cat "$BACKUP_BASE/latest_backup")
            log_info "Using latest backup: $backup_dir"
        else
            log_error "No backup specified and no latest backup found"
            exit 1
        fi
    fi
    
    if [[ ! -d "$backup_dir" ]]; then
        log_error "Backup directory not found: $backup_dir"
        exit 1
    fi
    
    log_warning "Rolling back CSS to: $backup_dir"
    read -p "Are you sure? This will overwrite current CSS files. (y/N): " confirm
    
    if [[ $confirm =~ ^[Yy]$ ]]; then
        rm -rf "$CSS_DIR"
        cp -r "$backup_dir/css" "$CSS_DIR"
        log_success "Rollback completed"
        
        # Also rollback git if tag exists
        local tag_name=$(basename "$backup_dir")
        if git tag | grep -q "$tag_name"; then
            log_info "Git tag $tag_name found, would you like to reset to that point?"
            read -p "Reset git to $tag_name? (y/N): " git_confirm
            if [[ $git_confirm =~ ^[Yy]$ ]]; then
                git reset --hard "$tag_name"
                log_success "Git reset to $tag_name"
            fi
        fi
    else
        log_info "Rollback cancelled"
    fi
}

# List available backups
list_backups() {
    log_info "Available backups:"
    if [[ -d "$BACKUP_BASE" ]]; then
        find "$BACKUP_BASE" -name "backup_*" -type d | sort -r | while read -r backup; do
            local timestamp=$(basename "$backup" | sed 's/backup_//')
            local size=$(du -sh "$backup" | cut -f1)
            local date=$(date -r "$backup" "+%Y-%m-%d %H:%M:%S")
            echo "  $timestamp - $size - $date"
        done
    else
        log_warning "No backups directory found"
    fi
}

# Run pre-migration tests
run_pre_tests() {
    log_info "Running pre-migration tests..."
    mkdir -p "$RESULTS_DIR"
    
    cd "$PROJECT_ROOT"
    node tests/css-migration-test.js before
    
    log_success "Pre-migration tests completed"
}

# Run post-migration tests
run_post_tests() {
    log_info "Running post-migration tests..."
    
    cd "$PROJECT_ROOT"
    node tests/css-migration-test.js after
    
    log_success "Post-migration tests completed"
}

# Compare test results and validate
validate_migration() {
    log_info "Validating migration results..."
    
    local before_file=$(find "$RESULTS_DIR" -name "css-migration-before-*.json" | sort -r | head -1)
    local after_file=$(find "$RESULTS_DIR" -name "css-migration-after-*.json" | sort -r | head -1)
    
    if [[ -z "$before_file" ]] || [[ -z "$after_file" ]]; then
        log_error "Could not find before/after test results"
        return 1
    fi
    
    log_info "Comparing: $(basename "$before_file") vs $(basename "$after_file")"
    
    cd "$PROJECT_ROOT"
    node tests/css-migration-test.js compare "$before_file" "$after_file"
    
    local comparison_file=$(find "$RESULTS_DIR" -name "css-migration-comparison-*.json" | sort -r | head -1)
    
    if [[ -f "$comparison_file" ]]; then
        local passed=$(grep '"passed"' "$comparison_file" | grep -o 'true\|false')
        if [[ "$passed" == "true" ]]; then
            log_success "✅ Migration validation PASSED"
            return 0
        else
            log_error "❌ Migration validation FAILED"
            log_warning "Check $comparison_file for details"
            return 1
        fi
    else
        log_error "Could not find comparison results"
        return 1
    fi
}

# Perform complete component migration with safety checks
migrate_component() {
    local component="$1"
    
    if [[ -z "$component" ]]; then
        log_error "Component name required"
        echo "Available components:"
        cd "$PROJECT_ROOT"
        node scripts/extract-component.js list
        return 1
    fi
    
    log_info "🚀 Starting safe migration of component: $component"
    
    # Step 1: Create backup
    log_info "Step 1: Creating backup..."
    local backup_dir=$(create_backup)
    
    # Step 2: Run pre-migration tests
    log_info "Step 2: Running pre-migration tests..."
    if ! run_pre_tests; then
        log_error "Pre-migration tests failed"
        return 1
    fi
    
    # Step 3: Perform migration
    log_info "Step 3: Performing migration..."
    cd "$PROJECT_ROOT"
    if ! node scripts/extract-component.js migrate "$component"; then
        log_error "Migration failed"
        log_warning "Rolling back..."
        rollback "$backup_dir"
        return 1
    fi
    
    # Step 4: Run post-migration tests
    log_info "Step 4: Running post-migration tests..."
    if ! run_post_tests; then
        log_error "Post-migration tests failed"
        log_warning "Rolling back..."
        rollback "$backup_dir"
        return 1
    fi
    
    # Step 5: Validate results
    log_info "Step 5: Validating results..."
    if validate_migration; then
        log_success "🎉 Component migration successful: $component"
        
        # Create success checkpoint
        cd "$PROJECT_ROOT"
        git add -A
        git commit -m "Successfully migrated $component component to modular CSS"
        
        return 0
    else
        log_error "Migration validation failed"
        log_warning "Rolling back..."
        rollback "$backup_dir"
        return 1
    fi
}

# Emergency stop - kill any running processes and rollback
emergency_stop() {
    log_error "🚨 EMERGENCY STOP triggered"
    
    # Kill any running Node processes
    pkill -f "css-migration" || true
    pkill -f "extract-component" || true
    
    # Rollback to latest backup
    if [[ -f "$BACKUP_BASE/latest_backup" ]]; then
        local latest_backup=$(cat "$BACKUP_BASE/latest_backup")
        log_warning "Rolling back to latest backup: $latest_backup"
        rollback "$latest_backup"
    else
        log_error "No backup available for emergency rollback"
    fi
}

# Status check - show current migration state
status() {
    log_info "CSS Migration Status"
    echo "==================="
    
    # Check if gptp.css exists and its size
    if [[ -f "$CSS_DIR/gptp.css" ]]; then
        local size=$(wc -l < "$CSS_DIR/gptp.css")
        echo "📄 gptp.css: $size lines"
        
        if [[ $size -lt 100 ]]; then
            log_success "gptp.css is nearly empty - migration almost complete!"
        elif [[ $size -lt 1000 ]]; then
            log_info "gptp.css is significantly reduced - migration in progress"
        else
            log_warning "gptp.css still contains $size lines - migration needed"
        fi
    else
        log_success "gptp.css has been removed - migration complete!"
    fi
    
    # Check component files
    echo ""
    log_info "Component files:"
    if [[ -d "$CSS_DIR/components" ]]; then
        find "$CSS_DIR/components" -name "_*.css" | while read -r file; do
            local lines=$(wc -l < "$file" 2>/dev/null || echo "0")
            echo "  $(basename "$file"): $lines lines"
        done
    else
        log_warning "No components directory found"
    fi
    
    # Check recent test results
    echo ""
    log_info "Recent test results:"
    if [[ -d "$RESULTS_DIR" ]]; then
        find "$RESULTS_DIR" -name "*.json" -mtime -1 | sort -r | head -3 | while read -r file; do
            echo "  $(basename "$file")"
        done
    else
        log_warning "No test results found"
    fi
}

# Show help
show_help() {
    cat << EOF
CSS Migration Safety Script

Usage: $0 <command> [args]

Commands:
  backup                    Create timestamped backup
  rollback [backup_dir]     Rollback to backup (uses latest if not specified)
  list-backups             List available backups
  pre-test                 Run pre-migration tests
  post-test                Run post-migration tests
  validate                 Validate migration results
  migrate <component>      Perform safe component migration
  emergency                Emergency stop and rollback
  status                   Show current migration status
  help                     Show this help

Examples:
  $0 backup                           # Create backup before changes
  $0 migrate utilities                # Safely migrate utilities component
  $0 rollback                         # Rollback to latest backup
  $0 validate                         # Check if last migration was successful
  $0 status                          # See current state

Migration Workflow:
  1. $0 backup                        # Always backup first
  2. $0 migrate <component>           # Migrates with automatic testing
  3. Check results and repeat for next component
  4. Use $0 rollback if anything goes wrong

EOF
}

# Main command dispatcher
case "${1:-help}" in
    backup)
        create_backup
        ;;
    rollback)
        rollback "$2"
        ;;
    list-backups)
        list_backups
        ;;
    pre-test)
        run_pre_tests
        ;;
    post-test)
        run_post_tests
        ;;
    validate)
        validate_migration
        ;;
    migrate)
        migrate_component "$2"
        ;;
    emergency)
        emergency_stop
        ;;
    status)
        status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac