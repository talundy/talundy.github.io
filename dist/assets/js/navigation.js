/**
 * Navigation Module - Shared functionality across all pages
 * Handles mobile navigation, scroll effects, and common interactions
 */

class Navigation {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.mobileNav = document.querySelector('.mobile-nav');
        this.nav = document.querySelector('.nav');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
        
        this.init();
    }

    init() {
        if (!this.navToggle || !this.mobileNav || !this.nav) {
            console.warn('Navigation elements not found');
            return;
        }

        this.setupMobileNavigation();
        this.setupScrollEffects();
        this.setupLinkHandlers();
    }

    setupMobileNavigation() {
        this.navToggle.addEventListener('click', () => {
            this.navToggle.classList.toggle('active');
            this.mobileNav.classList.toggle('active');
        });
    }

    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
            
            lastScrollY = scrollY;
        });
    }

    setupLinkHandlers() {
        // Close mobile nav when clicking on links
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navToggle.classList.remove('active');
                this.mobileNav.classList.remove('active');
            });
        });
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});
