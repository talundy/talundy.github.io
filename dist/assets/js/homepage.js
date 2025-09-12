/**
 * Homepage Module - Handles homepage-specific functionality
 * Includes hero animations and homepage-specific interactions
 */

class HomepageController {
    constructor() {
        this.init();
    }

    init() {
        this.setupHeroAnimations();
        this.setupProjectCardAnimations();
    }

    setupHeroAnimations() {
        // Add subtle parallax effect to hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            const rate = scrolled * -0.5;
            
            if (hero) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    setupProjectCardAnimations() {
        // Enhanced hover effects specifically for homepage project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Initialize homepage functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the homepage
    if (document.body.classList.contains('homepage') || 
        window.location.pathname.endsWith('index.html') || 
        window.location.pathname === '/') {
        new HomepageController();
    }
});
