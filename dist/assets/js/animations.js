/**
 * Animation Module - Handles scroll-triggered animations
 * Uses Intersection Observer for performance-optimized animations
 */

class AnimationController {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        this.setupBasicAnimations();
        this.setupStaggeredAnimations();
    }

    setupBasicAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, this.observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.animate-fade-in, .animate-slide-up').forEach(el => {
            observer.observe(el);
        });
    }

    setupStaggeredAnimations() {
        // Staggered animation for project cards
        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length > 0) {
            const projectObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, index * 200);
                    }
                });
            }, this.observerOptions);

            projectCards.forEach(card => {
                projectObserver.observe(card);
            });
        }

        // Staggered animation for timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        if (timelineItems.length > 0) {
            const timelineObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, index * 200);
                    }
                });
            }, this.observerOptions);

            timelineItems.forEach(item => {
                timelineObserver.observe(item);
            });
        }
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
});
