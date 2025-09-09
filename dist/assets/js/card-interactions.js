<<<<<<< HEAD
// Card interaction effects
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        });
    });
=======
/**
 * Card Interactions Module - Handles hover effects for cards
 * Provides consistent interaction patterns across all pages
 */

class CardInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.setupCardHoverEffects();
    }

    setupCardHoverEffects() {
        // Enhanced hover effects for all cards
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Enhanced hover effects for content cards (about page)
        document.querySelectorAll('.content-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px) scale(1.01)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Initialize card interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CardInteractions();
>>>>>>> f4a3186b685599d4c1d7d4b7f147e28283737ff8
});
