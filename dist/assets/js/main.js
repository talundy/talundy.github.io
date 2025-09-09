<<<<<<< HEAD
// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main script loaded');
    
    // Initialize any global functionality here
    initializeApp();
});

function initializeApp() {
    // Add any global initialization code here
    console.log('App initialized');
=======
/**
 * Main JavaScript Entry Point
 * Initializes all shared modules and handles global functionality
 */

// Global error handling
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
});

// Global unhandled promise rejection handling
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Website loaded successfully');
    
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
    
    // Initialize any global functionality here
    initializeGlobalFeatures();
});

function initializeGlobalFeatures() {
    // Add any global initialization code here
    // For example: analytics, global event listeners, etc.
    
    // Example: Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
>>>>>>> f4a3186b685599d4c1d7d4b7f147e28283737ff8
}
