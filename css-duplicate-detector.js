#!/usr/bin/env node
/**
 * Comprehensive CSS Duplicate Class Detector
 * Analyzes all CSS files to find duplicate class definitions across the project
 */

const fs = require('fs');
const path = require('path');
const css = require('css');

class CSSClassAnalyzer {
    constructor() {
        this.classDefinitions = new Map(); // className -> [{file, rule, properties}]
        this.duplicateReport = {
            totalFiles: 0,
            totalClasses: 0,
            duplicateClasses: 0,
            duplicates: [],
            summary: {}
        };
    }

    /**
     * Find all CSS files in the project
     */
    findCSSFiles(dir = './prompts-site-webflow-export/css') {
        const cssFiles = [];
        
        const scanDirectory = (currentDir) => {
            try {
                const items = fs.readdirSync(currentDir);
                
                for (const item of items) {
                    const fullPath = path.join(currentDir, item);
                    const stat = fs.statSync(fullPath);
                    
                    if (stat.isDirectory()) {
                        scanDirectory(fullPath);
                    } else if (item.endsWith('.css') && !item.includes('.backup')) {
                        cssFiles.push(fullPath);
                    }
                }
            } catch (error) {
                console.warn(`Warning: Could not scan directory ${currentDir}:`, error.message);
            }
        };

        scanDirectory(dir);
        return cssFiles;
    }

    /**
     * Extract class definitions from CSS content
     */
    extractClassDefinitions(cssContent, filePath) {
        try {
            const ast = css.parse(cssContent, { silent: true });
            const classes = [];

            const processRules = (rules, mediaQuery = null) => {
                if (!rules) return;

                for (const rule of rules) {
                    if (rule.type === 'rule') {
                        // Process selectors to find class definitions
                        const selectors = rule.selectors || [];
                        
                        for (const selector of selectors) {
                            // Extract class names (start with .)
                            const classMatches = selector.match(/\.[\w-]+/g);
                            
                            if (classMatches) {
                                for (const classMatch of classMatches) {
                                    const className = classMatch.substring(1); // Remove the dot
                                    
                                    // Get all properties for this rule
                                    const properties = (rule.declarations || [])
                                        .filter(decl => decl.type === 'declaration')
                                        .map(decl => `${decl.property}: ${decl.value}`)
                                        .sort();

                                    classes.push({
                                        className,
                                        selector,
                                        properties,
                                        mediaQuery,
                                        file: filePath,
                                        rulePosition: rule.position
                                    });
                                }
                            }
                        }
                    } else if (rule.type === 'media') {
                        // Recursively process media query rules
                        processRules(rule.rules, rule.media);
                    }
                }
            };

            processRules(ast.stylesheet.rules);
            return classes;

        } catch (error) {
            console.warn(`Warning: Could not parse CSS in ${filePath}:`, error.message);
            return [];
        }
    }

    /**
     * Analyze a single CSS file
     */
    analyzeFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const classes = this.extractClassDefinitions(content, filePath);
            
            console.log(`📄 Analyzing: ${filePath} (${classes.length} class definitions)`);
            
            // Group classes by name
            for (const classInfo of classes) {
                const key = classInfo.className;
                
                if (!this.classDefinitions.has(key)) {
                    this.classDefinitions.set(key, []);
                }
                
                this.classDefinitions.get(key).push(classInfo);
            }
            
            return classes.length;
        } catch (error) {
            console.error(`❌ Error analyzing ${filePath}:`, error.message);
            return 0;
        }
    }

    /**
     * Find duplicates and analyze conflicts
     */
    findDuplicates() {
        const duplicates = [];
        
        for (const [className, definitions] of this.classDefinitions) {
            if (definitions.length > 1) {
                // Check if properties are identical or conflicting
                const uniquePropertySets = new Set();
                const conflicts = [];
                
                for (const def of definitions) {
                    const propKey = def.properties.join('|');
                    uniquePropertySets.add(propKey);
                    
                    // Check for property conflicts with other definitions
                    for (const otherDef of definitions) {
                        if (def !== otherDef) {
                            const conflictingProps = this.findPropertyConflicts(def.properties, otherDef.properties);
                            if (conflictingProps.length > 0) {
                                conflicts.push({
                                    file1: def.file,
                                    selector1: def.selector,
                                    file2: otherDef.file,
                                    selector2: otherDef.selector,
                                    conflictingProperties: conflictingProps
                                });
                            }
                        }
                    }
                }
                
                duplicates.push({
                    className,
                    occurrences: definitions.length,
                    definitions: definitions.map(def => ({
                        file: path.relative('.', def.file),
                        selector: def.selector,
                        properties: def.properties,
                        mediaQuery: def.mediaQuery,
                        line: def.rulePosition ? def.rulePosition.start.line : null
                    })),
                    isConflicting: uniquePropertySets.size > 1,
                    uniquePropertySets: uniquePropertySets.size,
                    conflicts: conflicts.slice(0, 3) // Limit conflicts shown
                });
            }
        }
        
        return duplicates.sort((a, b) => b.occurrences - a.occurrences);
    }

    /**
     * Find conflicting properties between two property arrays
     */
    findPropertyConflicts(props1, props2) {
        const conflicts = [];
        const propMap1 = new Map();
        const propMap2 = new Map();
        
        // Parse properties into maps
        for (const prop of props1) {
            const [property, value] = prop.split(': ');
            propMap1.set(property, value);
        }
        
        for (const prop of props2) {
            const [property, value] = prop.split(': ');
            propMap2.set(property, value);
        }
        
        // Find conflicts
        for (const [property, value1] of propMap1) {
            if (propMap2.has(property)) {
                const value2 = propMap2.get(property);
                if (value1 !== value2) {
                    conflicts.push({
                        property,
                        value1,
                        value2
                    });
                }
            }
        }
        
        return conflicts;
    }

    /**
     * Generate comprehensive report
     */
    generateReport() {
        const duplicates = this.findDuplicates();
        
        this.duplicateReport = {
            timestamp: new Date().toISOString(),
            totalFiles: this.duplicateReport.totalFiles,
            totalClasses: this.classDefinitions.size,
            duplicateClasses: duplicates.length,
            duplicates: duplicates,
            summary: {
                highPriorityConflicts: duplicates.filter(d => d.isConflicting && d.occurrences >= 3).length,
                mediumPriorityConflicts: duplicates.filter(d => d.isConflicting && d.occurrences === 2).length,
                harmlessDuplicates: duplicates.filter(d => !d.isConflicting).length,
                totalOccurrences: duplicates.reduce((sum, d) => sum + d.occurrences, 0),
                filesWithMostDuplicates: this.getFilesWithMostDuplicates(duplicates)
            }
        };
        
        return this.duplicateReport;
    }

    /**
     * Get files that have the most duplicate classes
     */
    getFilesWithMostDuplicates(duplicates) {
        const fileStats = new Map();
        
        for (const duplicate of duplicates) {
            for (const def of duplicate.definitions) {
                const file = def.file;
                if (!fileStats.has(file)) {
                    fileStats.set(file, { file, duplicateCount: 0, conflictingCount: 0 });
                }
                
                const stats = fileStats.get(file);
                stats.duplicateCount += 1;
                if (duplicate.isConflicting) {
                    stats.conflictingCount += 1;
                }
            }
        }
        
        return Array.from(fileStats.values())
            .sort((a, b) => b.duplicateCount - a.duplicateCount)
            .slice(0, 5);
    }

    /**
     * Run complete analysis
     */
    async analyze() {
        console.log('🔍 Starting comprehensive CSS duplicate class analysis...\n');
        
        const cssFiles = this.findCSSFiles();
        console.log(`📁 Found ${cssFiles.length} CSS files to analyze\n`);
        
        this.duplicateReport.totalFiles = cssFiles.length;
        
        let totalClassDefinitions = 0;
        
        for (const file of cssFiles) {
            totalClassDefinitions += this.analyzeFile(file);
        }
        
        console.log(`\n✅ Analysis complete! Processed ${totalClassDefinitions} class definitions\n`);
        
        const report = this.generateReport();
        
        // Save detailed report
        fs.writeFileSync('./css-duplicate-analysis.json', JSON.stringify(report, null, 2));
        
        // Generate markdown summary
        this.generateMarkdownReport(report);
        
        return report;
    }

    /**
     * Generate human-readable markdown report
     */
    generateMarkdownReport(report) {
        const md = `# CSS Duplicate Class Analysis Report

**Analysis Date**: ${new Date(report.timestamp).toLocaleString()}  
**Files Analyzed**: ${report.totalFiles}  
**Total Unique Classes**: ${report.totalClasses}  
**Classes with Duplicates**: ${report.duplicateClasses}  

## 📊 Summary

- **High Priority Conflicts**: ${report.summary.highPriorityConflicts} (3+ occurrences with conflicting properties)
- **Medium Priority Conflicts**: ${report.summary.mediumPriorityConflicts} (2 occurrences with conflicting properties)  
- **Harmless Duplicates**: ${report.summary.harmlessDuplicates} (identical properties)
- **Total Duplicate Occurrences**: ${report.summary.totalOccurrences}

## 🎯 Files with Most Duplicates

${report.summary.filesWithMostDuplicates.map((file, i) => 
`${i + 1}. **${file.file}** - ${file.duplicateCount} duplicates (${file.conflictingCount} conflicting)`
).join('\n')}

## 🚨 High Priority Conflicts (3+ occurrences)

${report.duplicates
    .filter(d => d.isConflicting && d.occurrences >= 3)
    .slice(0, 10)
    .map(d => `### .${d.className}
- **Occurrences**: ${d.occurrences}
- **Files**: ${d.definitions.map(def => def.file).join(', ')}
- **Property Sets**: ${d.uniquePropertySets}
${d.conflicts.length > 0 ? `- **Sample Conflict**: ${d.conflicts[0].property} (${d.conflicts[0].value1} vs ${d.conflicts[0].value2})` : ''}
`).join('\n')}

## ⚠️ Medium Priority Conflicts (2 occurrences)

${report.duplicates
    .filter(d => d.isConflicting && d.occurrences === 2)
    .slice(0, 15)
    .map(d => `### .${d.className}
- **Files**: ${d.definitions.map(def => `${def.file}:${def.line || '?'}`).join(' vs ')}
${d.conflicts.length > 0 ? `- **Conflict**: ${d.conflicts[0].property} (${d.conflicts[0].value1} vs ${d.conflicts[0].value2})` : ''}
`).join('\n')}

## ✅ Harmless Duplicates (identical properties)

${report.duplicates
    .filter(d => !d.isConflicting)
    .slice(0, 10)
    .map(d => `- **.${d.className}** (${d.occurrences} occurrences) - Safe to consolidate`
).join('\n')}

---

**Total Issues Found**: ${report.duplicateClasses}  
**Recommended Action**: Focus on High Priority conflicts first, then Medium Priority, finally consolidate Harmless duplicates.
`;

        fs.writeFileSync('./CSS-DUPLICATE-ANALYSIS.md', md);
        console.log('📄 Reports saved:');
        console.log('  - css-duplicate-analysis.json (detailed data)');
        console.log('  - CSS-DUPLICATE-ANALYSIS.md (summary report)');
    }
}

// Run the analysis
async function main() {
    try {
        const analyzer = new CSSClassAnalyzer();
        const report = await analyzer.analyze();
        
        console.log('\n🎉 Analysis Summary:');
        console.log(`   • ${report.duplicateClasses} classes have duplicates`);
        console.log(`   • ${report.summary.highPriorityConflicts} high priority conflicts`);
        console.log(`   • ${report.summary.mediumPriorityConflicts} medium priority conflicts`);
        console.log(`   • ${report.summary.harmlessDuplicates} harmless duplicates`);
        
    } catch (error) {
        console.error('❌ Analysis failed:', error.message);
        process.exit(1);
    }
}

// Check if css module is available, install if not
try {
    require('css');
    main();
} catch (error) {
    console.log('📦 Installing required CSS parser...');
    const { execSync } = require('child_process');
    execSync('npm install css', { stdio: 'inherit' });
    console.log('✅ CSS parser installed, running analysis...\n');
    main();
}