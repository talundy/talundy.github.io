#!/usr/bin/env node

/**
 * HTML Processor for Portfolio Build
 * Updates file paths and optimizes HTML files
 */

const fs = require('fs');
const path = require('path');

class HTMLProcessor {
    constructor() {
        this.srcDir = path.join(__dirname, '../src');
        this.distDir = path.join(__dirname, '../dist');
    }

    async processHTML() {
        console.log('🔧 Processing HTML files...');
        
        const pagesDir = path.join(this.distDir);
        this.processDirectory(pagesDir);
        
        console.log('✅ HTML processing completed');
    }

    processDirectory(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                this.processDirectory(fullPath);
            } else if (entry.name.endsWith('.html')) {
                this.processHTMLFile(fullPath);
            }
        }
    }

    processHTMLFile(filePath) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Update CSS paths
        content = content.replace(/href="\.\.\/styles\//g, 'href="assets/css/');
        content = content.replace(/href="styles\//g, 'href="assets/css/');
        
        // Update JS paths
        content = content.replace(/src="\.\.\/js\//g, 'src="assets/js/');
        content = content.replace(/src="js\//g, 'src="assets/js/');
        
        // Update project paths
        content = content.replace(/href="\.\.\/\.\.\/styles\//g, 'href="assets/css/');
        content = content.replace(/href="\.\.\/\.\.\/js\//g, 'href="assets/js/');
        
        // Add cache busting for assets (optional)
        const timestamp = Date.now();
        content = content.replace(/\.css"/g, `.css?v=${timestamp}"`);
        content = content.replace(/\.js"/g, `.js?v=${timestamp}"`);
        
        fs.writeFileSync(filePath, content);
        console.log(`📄 Processed: ${path.relative(this.distDir, filePath)}`);
    }
}

// Run processor if called directly
if (require.main === module) {
    const processor = new HTMLProcessor();
    processor.processHTML();
}

module.exports = HTMLProcessor;

