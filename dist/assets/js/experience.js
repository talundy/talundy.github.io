<<<<<<< HEAD
// Experience page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Experience page script loaded');
    
    // Add any experience page specific functionality here
    initializeExperiencePage();
});

function initializeExperiencePage() {
    // Experience page initialization code
    console.log('Experience page initialized');
}
=======
/**
 * Experience Module - Handles experience page-specific functionality
 * Includes timeline interactions and skill card animations
 */

class ExperienceController {
    constructor() {
        this.init();
    }

    init() {
        this.setupTimelineInteractions();
        this.setupSkillCardAnimations();
        this.setupResumeCardInteraction();
    }

    setupTimelineInteractions() {
        // Enhanced interactions for timeline items
        document.querySelectorAll('.timeline-content').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = 'var(--shadow-md)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'var(--shadow-sm)';
            });
        });
    }

    setupSkillCardAnimations() {
        // Enhanced interactions for skill cards
        document.querySelectorAll('.skill-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px) scale(1.01)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    setupResumeCardInteraction() {
        // Special interaction for resume card
        const resumeCard = document.querySelector('.resume-card');
        if (resumeCard) {
            resumeCard.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px) scale(1.02)';
            });
            
            resumeCard.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        }
    }
}

// Initialize experience functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the experience page
    if (window.location.pathname.includes('experience.html')) {
        new ExperienceController();
    }
});
>>>>>>> f4a3186b685599d4c1d7d4b7f147e28283737ff8
