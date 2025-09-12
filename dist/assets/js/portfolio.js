/**
 * Portfolio Module - Handles portfolio page-specific functionality
 * Includes project card interactions and portfolio-specific animations
 */

class PortfolioController {
    constructor() {
        this.init();
    }

    init() {
        this.setupProjectInteractions();
        this.setupFeaturedHighlight();
    }

    setupProjectInteractions() {
        // Enhanced interactions for portfolio project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    setupFeaturedHighlight() {
        // Add special interaction for featured highlight section
        const featuredHighlight = document.querySelector('.featured-highlight');
        if (featuredHighlight) {
            featuredHighlight.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = 'var(--shadow-md)';
            });
            
            featuredHighlight.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'var(--shadow-sm)';
            });
        }
    }
}

// Initialize portfolio functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the portfolio page
    if (window.location.pathname.includes('portfolio.html')) {
        new PortfolioController();
    }
});
