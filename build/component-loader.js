#!/usr/bin/env node

/**
 * Component Loader for Portfolio Build
 * Replaces component placeholders with actual component HTML
 */

const fs = require('fs');
const path = require('path');

class ComponentLoader {
    constructor() {
        this.srcDir = path.join(__dirname, '../src');
        this.distDir = path.join(__dirname, '../dist');
        this.componentsDir = path.join(this.srcDir, 'components');
    }

    async loadComponents() {
        console.log('🧩 Loading components...');
        
        const pagesDir = path.join(this.distDir);
        this.processDirectory(pagesDir);
        
        console.log('✅ Component loading completed');
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
        
        // Replace component placeholders
        const componentRegex = /<include src="([^"]+)"><\/include>/g;
        let match;
        
        while ((match = componentRegex.exec(content)) !== null) {
            const componentPath = path.join(this.componentsDir, match[1]);
            
            if (fs.existsSync(componentPath)) {
                const componentContent = fs.readFileSync(componentPath, 'utf8');
                content = content.replace(match[0], componentContent);
                console.log(`📦 Loaded component: ${match[1]}`);
            } else {
                console.warn(`⚠️ Component not found: ${match[1]}`);
            }
        }
        
        fs.writeFileSync(filePath, content);
    }
}

// Run loader if called directly
if (require.main === module) {
    const loader = new ComponentLoader();
    loader.loadComponents();
}

module.exports = ComponentLoader;

