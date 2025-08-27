#!/usr/bin/env node

/**
 * CSS Component Extraction Tool
 * Safely extracts component-specific styles from gptp.css
 */

const fs = require('fs');
const path = require('path');

class ComponentExtractor {
  constructor() {
    this.componentSelectors = {
      utilities: [
        '.hidden', '.sr-only', '.loading-skeleton', '.transitioning',
        '@keyframes', '.animation-', '.fade-', '.scale-'
      ],
      
      typography: [
        'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'li', 'ol',
        'strong', 'em', 'label', '.text-', '.font-'
      ],
      
      cards: [
        '.prompt-body', '.start-page-content', '.example-item', '.example-input-content',
        '.prompt-overview-wrap', '.prompt-text-container', '.loading-content',
        '.ai-services-section', '.services-grid', '.service-button'
      ],
      
      buttons: [
        '.copy-btn', '.tab', '.block-link', '.show-example', '.close-example-items',
        '.page-controls', '.service-button', '.w-button', '.icon.dropdown-trigger',
        '.icon.home'
      ],
      
      forms: [
        '.form', '.field', '.field-label', '.field-wrap', '.input-wrap',
        '.prompt-form', '.form-controls', '.field::placeholder', '.field:focus',
        '.field:hover'
      ],
      
      layout: [
        '.page-wrap', '.right-panel', '.left-panel', '.w-layout-layout',
        '.w-layout-cell', '.universal-prompt-head', '.logo-lockup-ctnr',
        '.services-dropdown-trigger'
      ],
      
      sidebar: [
        '.sidebar', '.sidebar-content', '.sidebar-section', '.sidebar-category-head',
        '.sidebar-links-container', '.sidebar-link', '.sidebar-section-head',
        '.sidebar-header', '.sidebar-all-content-wrap', '.sb-toggle-state',
        '.prompts-title'
      ],
      
      popups: [
        '.popup-notification', '.close-popup', '.tooltip', '.copied', '.copied-content',
        '.services-popup-menu', '.mobile-menu-overlay', '.mobile-close'
      ]
    };

    this.mediaQueryComponents = {
      utilities: ['@media', 'prefers-reduced-motion'],
      typography: [],
      cards: [],
      buttons: [],
      forms: [],
      layout: ['@media', 'max-width: 1024px', 'max-width: 991px', 'max-width: 767px'],
      sidebar: ['@media'],
      popups: ['@media']
    };
  }

  /**
   * Extract styles for a specific component
   */
  extractComponent(componentName, sourceFile = 'prompts-site-webflow-export/css/gptp.css') {
    console.log(`🔍 Extracting ${componentName} styles from ${sourceFile}...`);
    
    if (!this.componentSelectors[componentName]) {
      throw new Error(`Unknown component: ${componentName}. Available: ${Object.keys(this.componentSelectors).join(', ')}`);
    }

    const sourceContent = fs.readFileSync(sourceFile, 'utf8');
    const selectors = this.componentSelectors[componentName];
    const mediaQueries = this.mediaQueryComponents[componentName] || [];

    const extracted = this.extractRulesForSelectors(sourceContent, selectors, mediaQueries);
    
    console.log(`✅ Extracted ${extracted.rules.length} rules for ${componentName}`);
    console.log(`📊 Total extracted content: ${extracted.content.length} characters`);
    
    return extracted;
  }

  /**
   * Extract CSS rules matching given selectors
   */
  extractRulesForSelectors(cssContent, selectors, mediaQueries = []) {
    const rules = [];
    const extractedContent = [];
    let remainingContent = cssContent;

    // Extract regular rules
    selectors.forEach(selector => {
      const matchedRules = this.findMatchingRules(remainingContent, selector);
      rules.push(...matchedRules);
      
      matchedRules.forEach(rule => {
        extractedContent.push(rule.fullRule);
        // Remove from remaining content to avoid duplicates
        remainingContent = remainingContent.replace(rule.fullRule, '');
      });
    });

    // Extract media query rules
    mediaQueries.forEach(mqPattern => {
      const matchedMQ = this.findMatchingMediaQueries(remainingContent, mqPattern, selectors);
      rules.push(...matchedMQ);
      
      matchedMQ.forEach(rule => {
        extractedContent.push(rule.fullRule);
        remainingContent = remainingContent.replace(rule.fullRule, '');
      });
    });

    return {
      rules: rules,
      content: extractedContent.join('\n\n'),
      remainingContent: remainingContent
    };
  }

  /**
   * Find CSS rules matching a selector pattern
   */
  findMatchingRules(cssContent, selectorPattern) {
    const rules = [];
    
    // Handle different selector types
    if (selectorPattern.startsWith('@keyframes')) {
      // Extract keyframe animations
      const keyframeRegex = /@keyframes\s+[^{]+\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
      const matches = cssContent.match(keyframeRegex) || [];
      matches.forEach(match => {
        rules.push({
          selector: match.match(/@keyframes\s+([^{]+)/)[1].trim(),
          fullRule: match,
          type: 'keyframes'
        });
      });
    } else if (selectorPattern.includes('::') || selectorPattern.includes(':')) {
      // Handle pseudo-selectors
      const pseudoRegex = new RegExp(
        `([^{}]*${selectorPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^{}]*)\\s*\\{[^{}]*\\}`,
        'g'
      );
      const matches = cssContent.match(pseudoRegex) || [];
      matches.forEach(match => {
        rules.push({
          selector: selectorPattern,
          fullRule: match,
          type: 'pseudo'
        });
      });
    } else {
      // Handle regular selectors (class, ID, element)
      const escaped = selectorPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const selectorRegex = new RegExp(
        `([^{}]*\\b${escaped}[^{}]*)\\s*\\{[^{}]*\\}`,
        'g'
      );
      const matches = cssContent.match(selectorRegex) || [];
      matches.forEach(match => {
        rules.push({
          selector: selectorPattern,
          fullRule: match,
          type: 'regular'
        });
      });
    }

    return rules;
  }

  /**
   * Find media query rules containing component selectors
   */
  findMatchingMediaQueries(cssContent, mqPattern, componentSelectors) {
    const rules = [];
    
    // Find media queries
    const mediaQueryRegex = /@media[^{]+\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
    const mediaQueries = cssContent.match(mediaQueryRegex) || [];
    
    mediaQueries.forEach(mq => {
      if (mqPattern === '@media' || mq.includes(mqPattern)) {
        // Check if media query contains any of our component selectors
        const containsComponentStyles = componentSelectors.some(selector => 
          mq.includes(selector)
        );
        
        if (containsComponentStyles) {
          rules.push({
            selector: mqPattern,
            fullRule: mq,
            type: 'media-query'
          });
        }
      }
    });

    return rules;
  }

  /**
   * Append extracted styles to component file
   */
  appendToComponentFile(componentName, extractedContent) {
    const targetFile = `prompts-site-webflow-export/css/components/_${componentName}.css`;
    
    console.log(`📝 Appending to ${targetFile}...`);
    
    // Ensure component file exists
    if (!fs.existsSync(targetFile)) {
      console.log(`Creating new component file: ${targetFile}`);
      fs.writeFileSync(targetFile, `/* ${componentName} Component Styles */\n\n`);
    }

    // Read existing content
    const existingContent = fs.readFileSync(targetFile, 'utf8');
    
    // Append new content with separator
    const separator = `\n\n/* === Extracted from gptp.css === */\n\n`;
    const updatedContent = existingContent + separator + extractedContent + '\n';
    
    fs.writeFileSync(targetFile, updatedContent);
    
    console.log(`✅ Successfully appended to ${targetFile}`);
  }

  /**
   * Update source file with remaining content
   */
  updateSourceFile(sourceFile, remainingContent) {
    console.log(`🔄 Updating source file: ${sourceFile}...`);
    
    // Create backup first
    const backupFile = sourceFile + '.backup.' + Date.now();
    fs.copyFileSync(sourceFile, backupFile);
    
    // Write remaining content
    fs.writeFileSync(sourceFile, remainingContent);
    
    console.log(`✅ Updated ${sourceFile} (backup: ${backupFile})`);
  }

  /**
   * Perform complete component migration
   */
  migrateComponent(componentName) {
    console.log(`🚀 Starting migration for component: ${componentName}`);
    
    const sourceFile = 'prompts-site-webflow-export/css/gptp.css';
    
    try {
      // Extract component styles
      const extracted = this.extractComponent(componentName, sourceFile);
      
      if (extracted.content.trim().length === 0) {
        console.log(`⚠️ No styles found for component: ${componentName}`);
        return false;
      }

      // Append to component file
      this.appendToComponentFile(componentName, extracted.content);
      
      // Update source file
      this.updateSourceFile(sourceFile, extracted.remainingContent);
      
      console.log(`✅ Successfully migrated ${componentName} component`);
      return true;
      
    } catch (error) {
      console.error(`❌ Error migrating ${componentName}:`, error.message);
      return false;
    }
  }

  /**
   * List available components
   */
  listComponents() {
    console.log('Available components for extraction:');
    Object.keys(this.componentSelectors).forEach(component => {
      const selectorCount = this.componentSelectors[component].length;
      console.log(`  - ${component} (${selectorCount} selectors)`);
    });
  }

  /**
   * Analyze gptp.css to estimate extraction potential
   */
  analyzeExtractionPotential() {
    const sourceFile = 'prompts-site-webflow-export/css/gptp.css';
    const cssContent = fs.readFileSync(sourceFile, 'utf8');
    
    console.log('🔍 Analyzing extraction potential...\n');
    
    const analysis = {};
    let totalExtractable = 0;
    
    Object.keys(this.componentSelectors).forEach(component => {
      const selectors = this.componentSelectors[component];
      const extracted = this.extractRulesForSelectors(cssContent, selectors);
      
      analysis[component] = {
        ruleCount: extracted.rules.length,
        contentSize: extracted.content.length,
        percentage: ((extracted.content.length / cssContent.length) * 100).toFixed(1)
      };
      
      totalExtractable += extracted.content.length;
      
      console.log(`${component.padEnd(12)}: ${extracted.rules.length.toString().padStart(3)} rules, ${(extracted.content.length/1024).toFixed(1).padStart(5)}KB (${analysis[component].percentage}%)`);
    });
    
    const totalPercentage = ((totalExtractable / cssContent.length) * 100).toFixed(1);
    console.log(`\n📊 Total extractable: ${(totalExtractable/1024).toFixed(1)}KB (${totalPercentage}%)`);
    console.log(`📊 Original file size: ${(cssContent.length/1024).toFixed(1)}KB`);
    console.log(`📊 Estimated remaining: ${((cssContent.length - totalExtractable)/1024).toFixed(1)}KB`);
    
    return analysis;
  }
}

// CLI interface
if (require.main === module) {
  const extractor = new ComponentExtractor();
  const command = process.argv[2];
  const componentName = process.argv[3];
  
  switch (command) {
    case 'extract':
      if (componentName) {
        extractor.extractComponent(componentName);
      } else {
        console.log('Usage: node extract-component.js extract <component-name>');
        extractor.listComponents();
      }
      break;
      
    case 'migrate':
      if (componentName) {
        extractor.migrateComponent(componentName);
      } else {
        console.log('Usage: node extract-component.js migrate <component-name>');
        extractor.listComponents();
      }
      break;
      
    case 'list':
      extractor.listComponents();
      break;
      
    case 'analyze':
      extractor.analyzeExtractionPotential();
      break;
      
    default:
      console.log(`
CSS Component Extraction Tool

Usage:
  node extract-component.js list                    # List available components
  node extract-component.js analyze                 # Analyze extraction potential
  node extract-component.js extract <component>     # Extract component (preview)
  node extract-component.js migrate <component>     # Migrate component (modifies files)

Available components: ${Object.keys(extractor.componentSelectors).join(', ')}

Example workflow:
  1. node extract-component.js analyze              # See what can be extracted
  2. node css-migration-test.js before             # Take before snapshot  
  3. node extract-component.js migrate utilities   # Start with low-risk component
  4. node css-migration-test.js after             # Take after snapshot
  5. node css-migration-test.js compare           # Validate no regressions
      `);
  }
}

module.exports = ComponentExtractor;