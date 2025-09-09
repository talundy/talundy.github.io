/**
 * About Module - Handles about page-specific functionality
 * Includes content card interactions and skill category animations
 */

class AboutController {
    constructor() {
        this.init();
    }

    init() {
        this.setupContentCardInteractions();
        this.setupSkillCategoryAnimations();
    }

    setupContentCardInteractions() {
        // Enhanced interactions for content cards
        document.querySelectorAll('.content-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px) scale(1.01)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    setupSkillCategoryAnimations() {
        // Add subtle animations to skill categories
        document.querySelectorAll('.skill-category').forEach(category => {
            category.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(4px)';
                this.style.transition = 'transform 0.2s ease';
            });
            
            category.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
            });
        });
    }
}

// Initialize about functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the about page
    if (window.location.pathname.includes('about_me.html')) {
        new AboutController();
    }
});
