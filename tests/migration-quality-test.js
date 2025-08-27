#!/usr/bin/env node

/**
 * CSS Migration Quality Testing Framework
 * Comprehensive testing to validate migration fidelity
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class MigrationQualityTester {
  constructor() {
    this.testPages = [
      { name: 'index', path: 'prompts-site-webflow-export/index.html', type: 'homepage' },
      { name: 'antiques', path: 'prompts-site-webflow-export/personal/antiques.html', type: 'personal' },
      { name: 'data-viz', path: 'prompts-site-webflow-export/work/data-viz.html', type: 'work' },
      { name: 'prompt-builder', path: 'prompts-site-webflow-export/personal/prompt-builder.html', type: 'interactive' }
    ];

    this.criticalElements = [
      // Layout elements
      { selector: '.page-wrap', description: 'Main page container' },
      { selector: '.left-panel', description: 'Sidebar panel' },
      { selector: '.right-panel', description: 'Main content area' },
      
      // Navigation elements  
      { selector: '.sidebar', description: 'Navigation sidebar' },
      { selector: '.sidebar-section-head', description: 'Sidebar section headers' },
      { selector: '.tab', description: 'Navigation tabs' },
      { selector: '.hamburger-menu', description: 'Mobile hamburger menu' },
      
      // Typography elements
      { selector: 'h1', description: 'Main headings' },
      { selector: 'h2', description: 'Secondary headings' },
      { selector: 'h3', description: 'Tertiary headings' },
      { selector: 'body', description: 'Base body styles' },
      
      // Form elements
      { selector: '.field', description: 'Form input fields' },
      { selector: '.copy-btn', description: 'Copy buttons' },
      { selector: '.prompt-form', description: 'Prompt form containers' },
      
      // Interactive elements
      { selector: '.block-link', description: 'Service links' },
      { selector: '.service-button', description: 'AI service buttons' },
      { selector: '.sidebar-link', description: 'Sidebar navigation links' }
    ];

    this.cssProperties = [
      'color', 'background-color', 'font-family', 'font-size', 'font-weight',
      'margin', 'padding', 'border', 'border-radius', 'width', 'height',
      'display', 'flex-direction', 'justify-content', 'align-items',
      'position', 'z-index', 'opacity', 'transform', 'transition'
    ];

    this.viewports = [
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 812 }
    ];
  }

  /**
   * Main quality test runner
   */
  async runQualityTests() {
    console.log('🔬 Running CSS Migration Quality Tests...\n');
    
    const results = {
      timestamp: new Date().toISOString(),
      testSuite: 'migration-quality',
      tests: {},
      summary: { passed: 0, failed: 0, total: 0 }
    };

    // 1. CSS Structure Analysis
    console.log('📊 Test 1: CSS Structure Analysis');
    results.tests.cssStructure = await this.testCSSStructure();
    this.updateSummary(results, results.tests.cssStructure);

    // 2. File Size & Performance Analysis
    console.log('\n📏 Test 2: File Size & Performance Analysis');
    results.tests.performance = await this.testPerformance();
    this.updateSummary(results, results.tests.performance);

    // 3. CSS Rule Count Validation
    console.log('\n🔢 Test 3: CSS Rule Count Validation');
    results.tests.ruleCounts = await this.testRuleCounts();
    this.updateSummary(results, results.tests.ruleCounts);

    // 4. Selectors Coverage Analysis
    console.log('\n🎯 Test 4: Selectors Coverage Analysis');
    results.tests.selectorsCoverage = await this.testSelectorsCoverage();
    this.updateSummary(results, results.tests.selectorsCoverage);

    // 5. Component Integration Test
    console.log('\n🧩 Test 5: Component Integration Test');
    results.tests.componentIntegration = await this.testComponentIntegration();
    this.updateSummary(results, results.tests.componentIntegration);

    // 6. Duplicate Detection
    console.log('\n🔍 Test 6: Duplicate CSS Detection');
    results.tests.duplicateDetection = await this.testDuplicates();
    this.updateSummary(results, results.tests.duplicateDetection);

    // 7. Media Query Validation
    console.log('\n📱 Test 7: Media Query Validation');
    results.tests.mediaQueries = await this.testMediaQueries();
    this.updateSummary(results, results.tests.mediaQueries);

    // Save results
    const resultsPath = `tests/results/quality-test-${Date.now()}.json`;
    this.ensureDirectoryExists(path.dirname(resultsPath));
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

    // Print summary
    this.printSummary(results);
    
    return results;
  }

  /**
   * Test 1: CSS Structure Analysis
   */
  async testCSSStructure() {
    const test = { name: 'CSS Structure Analysis', passed: true, issues: [], details: {} };
    
    try {
      // Check if component files exist and have content
      const componentFiles = [
        'css/components/_typography.css',
        'css/components/_sidebar.css', 
        'css/components/_forms.css',
        'css/base/_variables.css'
      ];

      test.details.componentFiles = {};
      
      componentFiles.forEach(file => {
        const fullPath = `prompts-site-webflow-export/${file}`;
        if (fs.existsSync(fullPath)) {
          const stats = fs.statSync(fullPath);
          const content = fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n').length;
          
          test.details.componentFiles[file] = {
            exists: true,
            size: stats.size,
            lines: lines,
            hasContent: lines > 10
          };
          
          if (lines < 10) {
            test.passed = false;
            test.issues.push(`${file} appears empty or too small (${lines} lines)`);
          }
        } else {
          test.details.componentFiles[file] = { exists: false };
          test.passed = false;
          test.issues.push(`Missing component file: ${file}`);
        }
      });

      // Check gptp.css reduction
      const gptpPath = 'prompts-site-webflow-export/css/gptp.css';
      if (fs.existsSync(gptpPath)) {
        const content = fs.readFileSync(gptpPath, 'utf8');
        const lines = content.split('\n').length;
        test.details.gptpRemaining = {
          lines: lines,
          size: fs.statSync(gptpPath).size
        };
        
        if (lines > 5000) {
          test.issues.push(`gptp.css still very large (${lines} lines) - migration may be incomplete`);
        }
      }

    } catch (error) {
      test.passed = false;
      test.issues.push(`Error analyzing CSS structure: ${error.message}`);
    }
    
    console.log(test.passed ? '✅' : '❌', test.name);
    if (test.issues.length > 0) {
      test.issues.forEach(issue => console.log('  ⚠️', issue));
    }
    
    return test;
  }

  /**
   * Test 2: File Size & Performance Analysis  
   */
  async testPerformance() {
    const test = { name: 'Performance Analysis', passed: true, issues: [], details: {} };
    
    try {
      let totalSize = 0;
      let componentCount = 0;
      
      // Calculate total CSS size
      const cssDir = 'prompts-site-webflow-export/css';
      if (fs.existsSync(cssDir)) {
        const files = this.getAllCSSFiles();
        test.details.files = {};
        
        files.forEach(file => {
          const stats = fs.statSync(file);
          const relativePath = file.replace('prompts-site-webflow-export/', '');
          
          test.details.files[relativePath] = {
            size: stats.size,
            sizeKB: (stats.size / 1024).toFixed(1)
          };
          
          totalSize += stats.size;
          if (file.includes('/components/')) componentCount++;
        });
      }
      
      test.details.summary = {
        totalSize: totalSize,
        totalSizeKB: (totalSize / 1024).toFixed(1),
        componentFiles: componentCount,
        averageComponentSize: componentCount > 0 ? ((totalSize / componentCount) / 1024).toFixed(1) : 0
      };
      
      // Performance thresholds
      if (totalSize > 200 * 1024) { // 200KB
        test.issues.push(`Total CSS size is large (${(totalSize/1024).toFixed(1)}KB) - consider further optimization`);
      }
      
      console.log(`  📦 Total CSS: ${(totalSize/1024).toFixed(1)}KB across ${componentCount} component files`);
      
    } catch (error) {
      test.passed = false;
      test.issues.push(`Error analyzing performance: ${error.message}`);
    }
    
    console.log(test.passed ? '✅' : '❌', test.name);
    return test;
  }

  /**
   * Test 3: CSS Rule Count Validation
   */
  async testRuleCounts() {
    const test = { name: 'CSS Rule Count Validation', passed: true, issues: [], details: {} };
    
    try {
      const files = this.getAllCSSFiles();
      let totalRules = 0;
      
      test.details.rulesByFile = {};
      
      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const rules = this.countCSSRules(content);
        const relativePath = file.replace('prompts-site-webflow-export/', '');
        
        test.details.rulesByFile[relativePath] = rules;
        totalRules += rules;
      });
      
      test.details.totalRules = totalRules;
      
      // Validate rule distribution makes sense
      const gptpRules = test.details.rulesByFile['css/gptp.css'] || 0;
      const componentRules = totalRules - gptpRules;
      
      test.details.distribution = {
        gptpRules: gptpRules,
        componentRules: componentRules,
        migrationPercentage: totalRules > 0 ? ((componentRules / totalRules) * 100).toFixed(1) : 0
      };
      
      console.log(`  📊 Total CSS rules: ${totalRules}`);
      console.log(`  📊 gptp.css: ${gptpRules} rules, Components: ${componentRules} rules`);
      console.log(`  📊 Migration: ${test.details.distribution.migrationPercentage}% moved to components`);
      
    } catch (error) {
      test.passed = false;
      test.issues.push(`Error counting CSS rules: ${error.message}`);
    }
    
    console.log(test.passed ? '✅' : '❌', test.name);
    return test;
  }

  /**
   * Test 4: Selectors Coverage Analysis
   */
  async testSelectorsCoverage() {
    const test = { name: 'Selectors Coverage Analysis', passed: true, issues: [], details: {} };
    
    try {
      const files = this.getAllCSSFiles();
      const allSelectors = new Set();
      const duplicateSelectors = new Set();
      
      test.details.selectorsByFile = {};
      
      // Collect all selectors
      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const selectors = this.extractSelectors(content);
        const relativePath = file.replace('prompts-site-webflow-export/', '');
        
        test.details.selectorsByFile[relativePath] = selectors.length;
        
        selectors.forEach(selector => {
          if (allSelectors.has(selector)) {
            duplicateSelectors.add(selector);
          }
          allSelectors.add(selector);
        });
      });
      
      test.details.summary = {
        totalUniqueSelectors: allSelectors.size,
        duplicateSelectors: duplicateSelectors.size,
        duplicationRate: allSelectors.size > 0 ? ((duplicateSelectors.size / allSelectors.size) * 100).toFixed(1) : 0
      };
      
      // Check for problematic duplication rate
      if (duplicateSelectors.size > 50) {
        test.issues.push(`High number of duplicate selectors (${duplicateSelectors.size}) - may indicate incomplete migration`);
      }
      
      console.log(`  🎯 Unique selectors: ${allSelectors.size}, Duplicates: ${duplicateSelectors.size}`);
      
    } catch (error) {
      test.passed = false;
      test.issues.push(`Error analyzing selectors: ${error.message}`);
    }
    
    console.log(test.passed ? '✅' : '❌', test.name);
    return test;
  }

  /**
   * Test 5: Component Integration Test
   */
  async testComponentIntegration() {
    const test = { name: 'Component Integration Test', passed: true, issues: [], details: {} };
    
    try {
      // Check if main.css properly imports components
      const mainCssPath = 'prompts-site-webflow-export/css/main.css';
      if (fs.existsSync(mainCssPath)) {
        const content = fs.readFileSync(mainCssPath, 'utf8');
        const imports = content.match(/@import\s+url\(["']([^"']+)["']\);?/g) || [];
        
        test.details.mainCssImports = imports.length;
        test.details.imports = imports;
        
        // Check if component files are properly imported
        const expectedComponents = ['_typography.css', '_sidebar.css', '_forms.css'];
        const missingImports = expectedComponents.filter(component => 
          !content.includes(component)
        );
        
        if (missingImports.length > 0) {
          test.passed = false;
          test.issues.push(`Missing imports in main.css: ${missingImports.join(', ')}`);
        }
        
      } else {
        test.details.mainCssExists = false;
        test.issues.push('main.css not found - component integration not set up');
      }
      
      // Check if HTML files reference the new CSS structure
      test.details.htmlReferences = {};
      this.testPages.forEach(page => {
        if (fs.existsSync(page.path)) {
          const content = fs.readFileSync(page.path, 'utf8');
          test.details.htmlReferences[page.name] = {
            referencesMainCss: content.includes('main.css'),
            referencesGptpCss: content.includes('gptp.css'),
            referencesComponents: content.includes('/components/')
          };
        }
      });
      
    } catch (error) {
      test.passed = false;
      test.issues.push(`Error testing component integration: ${error.message}`);
    }
    
    console.log(test.passed ? '✅' : '❌', test.name);
    return test;
  }

  /**
   * Test 6: Duplicate CSS Detection
   */
  async testDuplicates() {
    const test = { name: 'Duplicate CSS Detection', passed: true, issues: [], details: {} };
    
    try {
      const files = this.getAllCSSFiles();
      const rulesByContent = new Map();
      const duplicates = [];
      
      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const rules = this.extractCSSRules(content);
        const relativePath = file.replace('prompts-site-webflow-export/', '');
        
        rules.forEach(rule => {
          const normalizedRule = rule.replace(/\s+/g, ' ').trim();
          if (normalizedRule.length > 50) { // Only check substantial rules
            if (rulesByContent.has(normalizedRule)) {
              duplicates.push({
                rule: normalizedRule.substring(0, 100) + '...',
                files: [rulesByContent.get(normalizedRule), relativePath]
              });
            } else {
              rulesByContent.set(normalizedRule, relativePath);
            }
          }
        });
      });
      
      test.details.duplicatesFound = duplicates.length;
      test.details.duplicates = duplicates.slice(0, 10); // Show first 10
      
      if (duplicates.length > 20) {
        test.passed = false;
        test.issues.push(`High number of duplicate rules (${duplicates.length}) found across files`);
      }
      
      console.log(`  🔍 Duplicate rules found: ${duplicates.length}`);
      
    } catch (error) {
      test.passed = false;
      test.issues.push(`Error detecting duplicates: ${error.message}`);
    }
    
    console.log(test.passed ? '✅' : '❌', test.name);
    return test;
  }

  /**
   * Test 7: Media Query Validation
   */
  async testMediaQueries() {
    const test = { name: 'Media Query Validation', passed: true, issues: [], details: {} };
    
    try {
      const files = this.getAllCSSFiles();
      const breakpoints = new Set();
      let totalMediaQueries = 0;
      
      test.details.mediaQueriesByFile = {};
      
      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const mediaQueries = content.match(/@media[^{]+\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g) || [];
        const relativePath = file.replace('prompts-site-webflow-export/', '');
        
        test.details.mediaQueriesByFile[relativePath] = mediaQueries.length;
        totalMediaQueries += mediaQueries.length;
        
        // Extract breakpoints
        mediaQueries.forEach(mq => {
          const breakpoint = mq.match(/max-width:\s*(\d+px)/);
          if (breakpoint) {
            breakpoints.add(breakpoint[1]);
          }
        });
      });
      
      test.details.summary = {
        totalMediaQueries: totalMediaQueries,
        uniqueBreakpoints: Array.from(breakpoints).sort()
      };
      
      // Check for consistent breakpoints
      const standardBreakpoints = ['991px', '767px', '479px'];
      const nonStandardBreakpoints = Array.from(breakpoints).filter(bp => 
        !standardBreakpoints.includes(bp)
      );
      
      if (nonStandardBreakpoints.length > 2) {
        test.issues.push(`Non-standard breakpoints found: ${nonStandardBreakpoints.join(', ')}`);
      }
      
      console.log(`  📱 Media queries: ${totalMediaQueries}, Breakpoints: ${breakpoints.size}`);
      
    } catch (error) {
      test.passed = false;
      test.issues.push(`Error validating media queries: ${error.message}`);
    }
    
    console.log(test.passed ? '✅' : '❌', test.name);
    return test;
  }

  /**
   * Helper: Count CSS rules in content
   */
  countCSSRules(content) {
    // Remove comments
    const cleaned = content.replace(/\/\*[\s\S]*?\*\//g, '');
    // Count rule blocks (selector + properties)
    const ruleMatches = cleaned.match(/[^{}]+\{[^{}]*\}/g);
    return ruleMatches ? ruleMatches.length : 0;
  }

  /**
   * Helper: Extract selectors from CSS content
   */
  extractSelectors(content) {
    const selectors = [];
    const cleaned = content.replace(/\/\*[\s\S]*?\*\//g, '');
    const ruleMatches = cleaned.match(/([^{}]+)\{[^{}]*\}/g) || [];
    
    ruleMatches.forEach(rule => {
      const selector = rule.split('{')[0].trim();
      if (selector && !selector.startsWith('@')) {
        selectors.push(selector);
      }
    });
    
    return selectors;
  }

  /**
   * Helper: Extract CSS rules from content
   */
  extractCSSRules(content) {
    const rules = [];
    const cleaned = content.replace(/\/\*[\s\S]*?\*\//g, '');
    const ruleMatches = cleaned.match(/[^{}]+\{[^{}]*\}/g) || [];
    
    ruleMatches.forEach(rule => {
      const trimmed = rule.trim();
      if (trimmed && !trimmed.startsWith('@media')) {
        rules.push(trimmed);
      }
    });
    
    return rules;
  }

  /**
   * Helper: Get all CSS files recursively
   */
  getAllCSSFiles() {
    const files = [];
    const cssDir = 'prompts-site-webflow-export/css';
    
    const findCSSFiles = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          findCSSFiles(fullPath);
        } else if (item.endsWith('.css')) {
          files.push(fullPath);
        }
      });
    };

    findCSSFiles(cssDir);
    return files;
  }

  /**
   * Helper: Update test summary
   */
  updateSummary(results, test) {
    results.summary.total++;
    if (test.passed) {
      results.summary.passed++;
    } else {
      results.summary.failed++;
    }
  }

  /**
   * Helper: Print final summary
   */
  printSummary(results) {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 CSS MIGRATION QUALITY TEST RESULTS');
    console.log('='.repeat(60));
    
    const { passed, failed, total } = results.summary;
    const passRate = ((passed / total) * 100).toFixed(1);
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📈 Success Rate: ${passRate}%`);
    
    if (failed === 0) {
      console.log(`\n🎉 ALL TESTS PASSED! Migration quality is excellent.`);
    } else {
      console.log(`\n⚠️  ${failed} test(s) failed. Review issues above.`);
    }
    
    // Key metrics
    if (results.tests.performance?.details?.summary) {
      const perf = results.tests.performance.details.summary;
      console.log(`\n📦 PERFORMANCE:`);
      console.log(`   Total CSS: ${perf.totalSizeKB}KB`);
      console.log(`   Component files: ${perf.componentFiles}`);
    }
    
    if (results.tests.ruleCounts?.details?.distribution) {
      const dist = results.tests.ruleCounts.details.distribution;
      console.log(`\n📊 MIGRATION:`);
      console.log(`   Rules migrated: ${dist.migrationPercentage}%`);
      console.log(`   Component rules: ${dist.componentRules}`);
      console.log(`   gptp.css rules: ${dist.gptpRules}`);
    }
    
    console.log('\n' + '='.repeat(60));
  }

  /**
   * Helper: Ensure directory exists
   */
  ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
}

// CLI interface
if (require.main === module) {
  const tester = new MigrationQualityTester();
  
  tester.runQualityTests().then(results => {
    process.exit(results.summary.failed === 0 ? 0 : 1);
  }).catch(error => {
    console.error('❌ Quality test failed:', error);
    process.exit(1);
  });
}

module.exports = MigrationQualityTester;