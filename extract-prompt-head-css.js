#!/usr/bin/env node
/**
 * Comprehensive CSS Extractor for Universal Prompt Head Component
 * Extracts ALL related CSS rules from multiple stylesheets
 */

const fs = require('fs');
const path = require('path');

class PromptHeadCSSExtractor {
  constructor() {
    this.cssFiles = [
      'prompts-site-webflow-export/css/components/_layout.css',
      'prompts-site-webflow-export/css/components/_features.css', 
      'prompts-site-webflow-export/css/components/_navigation.css',
      'prompts-site-webflow-export/css/hamburger-menu.css',
      'prompts-site-webflow-export/css/components/_buttons.css',
      'prompts-site-webflow-export/css/components/_animations.css',
      'prompts-site-webflow-export/css/components/_interactive.css',
      'prompts-site-webflow-export/css/main.css'
    ];
    
    // All CSS selectors that are part of the prompt head component
    this.componentSelectors = [
      'universal-prompt-head',
      'logo-lockup-ctnr',
      'logo-image-container', 
      'logo-image',
      'home-link',
      'sidebar-toggle',
      'sb-toggle-state',
      'copied',
      'copied-content',
      'mobile-menu-icon',
      'services-dropdown-trigger',
      'services-dropdown',
      'services-popup-menu',
      'universal-heading-icon',
      'ai-icon',
      'tooltip',
      'icon.home',
      'icon.dropdown-trigger',
      'ai-menu-heading',
      'block-link',
      'block-link-ctnr',
      'block-link-title',
      'block-link-arrow',
      'confetti-animation',
      'link-list'
    ];
    
    this.extractedRules = [];
    this.mediaQueryRules = [];
  }

  /**
   * Extract CSS rules from a single file
   */
  extractFromFile(filePath) {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    console.log(`📄 Processing: ${fileName}`);

    // Split into rules (simple approach - could be enhanced with proper CSS parser)
    const rules = this.parseSimpleCSS(content);
    let foundRules = 0;

    rules.forEach((rule, index) => {
      const hasComponentSelector = this.componentSelectors.some(selector => 
        rule.selector.includes(selector) || 
        rule.selector.includes(`.${selector}`) ||
        rule.selector.includes(`#${selector}`)
      );

      if (hasComponentSelector) {
        foundRules++;
        this.extractedRules.push({
          file: fileName,
          lineNumber: this.estimateLineNumber(content, rule.originalText),
          selector: rule.selector.trim(),
          properties: rule.properties.trim(),
          originalRule: rule.originalText,
          isMediaQuery: rule.isMediaQuery,
          mediaQuery: rule.mediaQuery
        });
      }
    });

    console.log(`   ✅ Found ${foundRules} relevant rules`);
  }

  /**
   * Simple CSS parser (basic implementation)
   */
  parseSimpleCSS(content) {
    const rules = [];
    let currentMediaQuery = null;
    
    // Handle media queries
    const mediaQueryRegex = /@media[^{]+\{([\s\S]*?)\}/g;
    let mediaMatch;
    
    while ((mediaMatch = mediaQueryRegex.exec(content)) !== null) {
      const mediaQueryRule = mediaMatch[0];
      const mediaQueryContent = mediaMatch[1];
      const mediaDeclaration = mediaMatch[0].match(/@media[^{]+/)[0];
      
      // Parse rules within media query
      const innerRules = this.parseRuleContent(mediaQueryContent, true, mediaDeclaration);
      rules.push(...innerRules);
    }
    
    // Remove media queries from content and parse regular rules
    const contentWithoutMedia = content.replace(mediaQueryRegex, '');
    const regularRules = this.parseRuleContent(contentWithoutMedia, false);
    rules.push(...regularRules);
    
    return rules;
  }

  /**
   * Parse CSS rule content
   */
  parseRuleContent(content, isMediaQuery = false, mediaQuery = null) {
    const rules = [];
    const ruleRegex = /([^{}]+)\{([^{}]*)\}/g;
    let match;

    while ((match = ruleRegex.exec(content)) !== null) {
      const selector = match[1].trim();
      const properties = match[2].trim();
      
      if (selector && properties) {
        rules.push({
          selector,
          properties,
          originalText: match[0],
          isMediaQuery,
          mediaQuery
        });
      }
    }

    return rules;
  }

  /**
   * Estimate line number of a CSS rule in the original file
   */
  estimateLineNumber(content, ruleText) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(ruleText.split('\n')[0].trim())) {
        return i + 1;
      }
    }
    return 'unknown';
  }

  /**
   * Generate comprehensive CSS output
   */
  generateOutput() {
    console.log('\n📊 Analysis Complete');
    console.log(`📝 Total rules found: ${this.extractedRules.length}`);
    
    // Group by file
    const rulesByFile = {};
    this.extractedRules.forEach(rule => {
      if (!rulesByFile[rule.file]) {
        rulesByFile[rule.file] = [];
      }
      rulesByFile[rule.file].push(rule);
    });

    // Generate consolidated CSS
    let consolidatedCSS = `/* Universal Prompt Head Component - Complete CSS */\n`;
    consolidatedCSS += `/* Auto-extracted from ${this.cssFiles.length} source files */\n`;
    consolidatedCSS += `/* Total rules: ${this.extractedRules.length} */\n\n`;

    // Regular rules first
    const regularRules = this.extractedRules.filter(rule => !rule.isMediaQuery);
    consolidatedCSS += `/* ===== REGULAR RULES ===== */\n\n`;
    
    regularRules.forEach(rule => {
      consolidatedCSS += `/* From: ${rule.file}:${rule.lineNumber} */\n`;
      consolidatedCSS += `${rule.selector} {\n`;
      consolidatedCSS += `${rule.properties.split(';').filter(p => p.trim()).map(p => `  ${p.trim()};`).join('\n')}\n`;
      consolidatedCSS += `}\n\n`;
    });

    // Media query rules
    const mediaRules = this.extractedRules.filter(rule => rule.isMediaQuery);
    if (mediaRules.length > 0) {
      consolidatedCSS += `/* ===== RESPONSIVE RULES ===== */\n\n`;
      
      // Group by media query
      const rulesByMedia = {};
      mediaRules.forEach(rule => {
        if (!rulesByMedia[rule.mediaQuery]) {
          rulesByMedia[rule.mediaQuery] = [];
        }
        rulesByMedia[rule.mediaQuery].push(rule);
      });

      Object.entries(rulesByMedia).forEach(([mediaQuery, rules]) => {
        consolidatedCSS += `${mediaQuery} {\n`;
        rules.forEach(rule => {
          consolidatedCSS += `  /* From: ${rule.file}:${rule.lineNumber} */\n`;
          consolidatedCSS += `  ${rule.selector} {\n`;
          consolidatedCSS += `${rule.properties.split(';').filter(p => p.trim()).map(p => `    ${p.trim()};`).join('\n')}\n`;
          consolidatedCSS += `  }\n\n`;
        });
        consolidatedCSS += `}\n\n`;
      });
    }

    // Generate analysis report
    let report = `# Universal Prompt Head CSS Analysis Report\n\n`;
    report += `**Generated:** ${new Date().toISOString()}\n`;
    report += `**Total Rules Extracted:** ${this.extractedRules.length}\n\n`;
    
    report += `## Rules by Source File\n\n`;
    Object.entries(rulesByFile).forEach(([file, rules]) => {
      report += `### ${file}\n`;
      report += `- **Rules found:** ${rules.length}\n`;
      report += `- **Selectors:** ${rules.map(r => r.selector).join(', ')}\n\n`;
    });

    report += `## Component Selector Coverage\n\n`;
    this.componentSelectors.forEach(selector => {
      const matchingRules = this.extractedRules.filter(rule => 
        rule.selector.includes(selector)
      );
      report += `- **${selector}:** ${matchingRules.length} rules\n`;
    });

    return { consolidatedCSS, report };
  }

  /**
   * Run the complete extraction process
   */
  async run() {
    console.log('🚀 Starting Universal Prompt Head CSS Extraction\n');
    
    // Extract from all files
    for (const filePath of this.cssFiles) {
      this.extractFromFile(filePath);
    }
    
    // Generate output
    const { consolidatedCSS, report } = this.generateOutput();
    
    // Write files
    fs.writeFileSync('prompt-head-extracted.css', consolidatedCSS);
    fs.writeFileSync('prompt-head-css-analysis.md', report);
    
    console.log('\n✅ Extraction Complete!');
    console.log('📁 Files generated:');
    console.log('   • prompt-head-extracted.css');
    console.log('   • prompt-head-css-analysis.md');
  }
}

// Run the extractor
if (require.main === module) {
  const extractor = new PromptHeadCSSExtractor();
  extractor.run().catch(console.error);
}

module.exports = PromptHeadCSSExtractor;