// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', function() {
            mobileNav.style.display = mobileNav.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // Close mobile nav when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileNav) {
                mobileNav.style.display = 'none';
            }
        });
    });
});
