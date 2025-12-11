// Home Page JavaScript

// Initialize animations on scroll
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add fade-in animation to elements
    observeElements();
});

// Intersection Observer for animations
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Press 'S' for Student Login
    if (event.key === 's' || event.key === 'S') {
        openStudentLogin();
    }
    // Press 'A' for Admin Login
    if (event.key === 'a' || event.key === 'A') {
        openAdminLogin();
    }
    // Press 'Escape' to close modals
    if (event.key === 'Escape') {
        closeStudentLogin();
        closeAdminLogin();
    }
});
