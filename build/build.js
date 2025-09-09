#!/usr/bin/env node

/**
 * Build Script for Thomas Lundy Portfolio
 * Handles HTML processing, asset optimization, and deployment preparation
 */

const fs = require('fs');
const path = require('path');

class PortfolioBuilder {
    constructor() {
        this.srcDir = path.join(__dirname, '../src');
        this.distDir = path.join(__dirname, '../dist');
        this.buildDir = path.join(__dirname, '../build');
    }

    async build() {
        console.log('🚀 Starting portfolio build...');
        
        try {
            await this.cleanDist();
            await this.createDirectories();
            await this.processHTML();
            await this.copyAssets();
            await this.loadComponents();
            await this.generateSitemap();
            
            console.log('✅ Build completed successfully!');
            console.log(`📁 Output directory: ${this.distDir}`);
        } catch (error) {
            console.error('❌ Build failed:', error);
            process.exit(1);
        }
    }

    async cleanDist() {
        if (fs.existsSync(this.distDir)) {
            fs.rmSync(this.distDir, { recursive: true, force: true });
        }
        console.log('🧹 Cleaned dist directory');
    }

    async createDirectories() {
        const dirs = [
            'assets/css',
            'assets/js',
            'assets/images',
            'assets/resumes',
            'projects'
        ];

        for (const dir of dirs) {
            const fullPath = path.join(this.distDir, dir);
            fs.mkdirSync(fullPath, { recursive: true });
        }
        console.log('📁 Created directory structure');
    }

    async processHTML() {
        const pagesDir = path.join(this.srcDir, 'pages');
        const projectsDir = path.join(this.srcDir, 'projects');
        
        // Copy pages to root of dist directory
        if (fs.existsSync(pagesDir)) {
            const entries = fs.readdirSync(pagesDir, { withFileTypes: true });
            
            for (const entry of entries) {
                const srcPath = path.join(pagesDir, entry.name);
                const destPath = path.join(this.distDir, entry.name);
                
                if (entry.isFile()) {
                    fs.copyFileSync(srcPath, destPath);
                } else if (entry.isDirectory()) {
                    this.copyDirectory(srcPath, destPath);
                }
            }
            console.log('📄 Processed HTML pages');
        }

        // Copy projects
        if (fs.existsSync(projectsDir)) {
            this.copyDirectory(projectsDir, path.join(this.distDir, 'projects'));
            console.log('🎨 Processed project files');
        }
    }

    async copyAssets() {
        const assetsDir = path.join(this.srcDir, 'assets');
        
        if (fs.existsSync(assetsDir)) {
            this.copyDirectory(assetsDir, path.join(this.distDir, 'assets'));
            console.log('📦 Copied assets');
        }
    }

    async loadComponents() {
        console.log('🧩 Loading components...');
        
        const pagesDir = path.join(this.distDir);
        this.processDirectoryForComponents(pagesDir);
        
        console.log('✅ Component loading completed');
    }

    async generateSitemap() {
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://talundy.github.io/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://talundy.github.io/about_me.html</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://talundy.github.io/experience.html</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://talundy.github.io/portfolio.html</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.8</priority>
    </url>
</urlset>`;

        fs.writeFileSync(path.join(this.distDir, 'sitemap.xml'), sitemap);
        console.log('🗺️ Generated sitemap.xml');
    }

    processDirectoryForComponents(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                this.processDirectoryForComponents(fullPath);
            } else if (entry.name.endsWith('.html')) {
                this.processHTMLFileForComponents(fullPath);
            }
        }
    }

    processHTMLFileForComponents(filePath) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace component placeholders
        const componentRegex = /<include src="([^"]+)"><\/include>/g;
        let match;
        
        while ((match = componentRegex.exec(content)) !== null) {
            // The ../components/ path from dist should resolve to src/components/
            // We need to resolve it relative to the src directory
            let componentPath;
            if (match[1].startsWith('../components/')) {
                // Convert ../components/ to components/ relative to src
                componentPath = path.join(this.srcDir, 'components', match[1].replace('../components/', ''));
            } else {
                componentPath = path.join(this.srcDir, match[1]);
            }
            
            if (fs.existsSync(componentPath)) {
                const componentContent = fs.readFileSync(componentPath, 'utf8');
                content = content.replace(match[0], componentContent);
                console.log(`📦 Loaded component: ${match[1]}`);
            } else {
                console.warn(`⚠️ Component not found: ${componentPath}`);
            }
        }
        
        fs.writeFileSync(filePath, content);
    }

    copyDirectory(src, dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const entries = fs.readdirSync(src, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
}

// Run build if called directly
if (require.main === module) {
    const builder = new PortfolioBuilder();
    builder.build();
}

module.exports = PortfolioBuilder;
