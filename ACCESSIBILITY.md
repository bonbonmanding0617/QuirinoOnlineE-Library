<!-- Accessibility Improvements Guide -->
<!-- Add these ARIA labels and attributes to improve accessibility -->

<!-- For Admin Dashboard -->
<!-- Update sidebar nav with ARIA labels -->
<nav class="sidebar-nav" role="navigation" aria-label="Admin Dashboard Navigation">
    <a href="#" onclick="showSection('quick-actions')" class="nav-link active" aria-current="page">
        Quick Actions
    </a>
    <!-- Each section should have aria-current when active -->
</nav>

<!-- Add ARIA labels to main sections -->
<main class="main-content" role="main" aria-label="Dashboard Content">
    <!-- Each section with unique ID -->
    <section id="quick-actions" class="section active" role="region" aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading">Quick Actions</h2>
    </section>
</main>

<!-- For Forms -->
<!-- Add aria-required, aria-invalid, aria-describedby -->
<form id="studentForm" role="form">
    <div class="form-group">
        <label for="form-student-name" id="student-name-label">Full Name *</label>
        <input 
            type="text" 
            id="form-student-name" 
            aria-required="true" 
            aria-labelledby="student-name-label"
            aria-describedby="student-name-error">
        <div id="student-name-error" role="alert" aria-live="polite"></div>
    </div>
</form>

<!-- For Tables -->
<!-- Add scope attribute to headers and aria-label to action buttons -->
<table>
    <thead>
        <tr>
            <th scope="col">Student ID</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Actions</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>STU-001</td>
            <td>John Doe</td>
            <td>john@example.com</td>
            <td>
                <button class="btn btn-small btn-primary" aria-label="Edit student John Doe">Edit</button>
                <button class="btn btn-small btn-danger" aria-label="Delete student John Doe">Delete</button>
            </td>
        </tr>
    </tbody>
</table>

<!-- For Modals -->
<!-- Add role and aria-modal, aria-labelledby -->
<div id="studentFormModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="studentModalTitle">
    <div class="modal-content">
        <h2 id="studentModalTitle">Add Student</h2>
        <button class="close" aria-label="Close modal">&times;</button>
        <!-- Form content -->
    </div>
</div>

<!-- For Cards and Lists -->
<!-- Add proper heading structure and ARIA live regions -->
<div class="card" role="region" aria-labelledby="card-title">
    <h3 id="card-title">Card Title</h3>
    <div class="card-body">
        <!-- Content -->
    </div>
</div>

<!-- For Alerts -->
<!-- Add role="alert" and aria-live="polite" -->
<div class="alert alert-success" role="alert" aria-live="polite" aria-atomic="true">
    ✅ Action completed successfully
</div>

<!-- JavaScript Accessibility Enhancements -->
<script>
// Skip to main content link (should be first focusable element)
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.textContent = 'Skip to main content';
skipLink.style.position = 'absolute';
skipLink.style.top = '-40px';
skipLink.style.left = '0';
skipLink.style.background = '#000';
skipLink.style.color = '#fff';
skipLink.style.padding = '8px';
skipLink.style.zIndex = '100';
skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});
skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});
document.body.insertBefore(skipLink, document.body.firstChild);

// Add aria-label to dynamic content
function createAccessibleAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.setAttribute('aria-live', 'polite');
    alertDiv.setAttribute('aria-atomic', 'true');
    alertDiv.textContent = message;
    return alertDiv;
}

// Announce page changes for screen readers
function announcePageChange(pageName) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.textContent = `Now viewing ${pageName}`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close modals on Escape
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
    
    if (e.key === '?') {
        // Show keyboard shortcuts on ?
        showKeyboardShortcuts();
    }
});

// Keyboard shortcuts help dialog
function showKeyboardShortcuts() {
    const shortcuts = `
        Keyboard Shortcuts:
        
        ESC - Close modals/dialogs
        S - Student Login (home page)
        A - Admin Login (home page)
        Alt + H - Home
        Alt + M - Menu
        Alt + S - Search
        Alt + P - Print
        
        Tab - Navigate between elements
        Enter - Activate buttons/links
        Space - Toggle buttons/checkboxes
    `;
    UIHelper.showSuccess(shortcuts);
}

// Focus management for modals
function openModalWithFocusManagement(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    
    // Move focus to first input in modal
    const firstInput = modal.querySelector('input, textarea, select');
    if (firstInput) {
        firstInput.focus();
    }
}

// Improve color contrast
function checkColorContrast() {
    // This would calculate and verify WCAG AA contrast ratios
    // Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text
    console.log('Color contrast verification should be run');
}

// Test accessibility
function runAccessibilityTests() {
    console.log('Accessibility Tests:');
    
    // Check for images without alt text
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    if (imagesWithoutAlt.length > 0) {
        console.warn(`${imagesWithoutAlt.length} images missing alt text`);
    }
    
    // Check for form inputs without labels
    const inputsWithoutLabels = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    if (inputsWithoutLabels.length > 0) {
        console.warn(`${inputsWithoutLabels.length} inputs missing labels`);
    }
    
    // Check for color-only information
    console.log('Verify no information is conveyed by color alone');
    
    // Check for sufficient heading hierarchy
    console.log('Verify proper heading hierarchy (h1 > h2 > h3, etc.)');
}

// Run tests on page load
document.addEventListener('DOMContentLoaded', runAccessibilityTests);

// Ensure focus is visible
const style = document.createElement('style');
style.textContent = `
    button:focus,
    input:focus,
    select:focus,
    textarea:focus,
    a:focus {
        outline: 3px solid #3498db;
        outline-offset: 2px;
    }
    
    *:focus {
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
    }
`;
document.head.appendChild(style);

// High contrast mode detection
if (window.matchMedia('(prefers-contrast: more)').matches) {
    document.body.classList.add('high-contrast-mode');
}

// Reduced motion detection
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduce-motion');
}

// Add lang attribute to document
document.documentElement.lang = 'en';
</script>

<!-- CSS for Accessibility -->
<style>
/* High Contrast Mode */
.high-contrast-mode {
    --primary-color: #000;
    --secondary-color: #000;
    --light-text: #000;
}

.high-contrast-mode button,
.high-contrast-mode a {
    border: 2px solid #000;
}

/* Reduce Motion */
.reduce-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
}

/* Focus Visible */
*:focus-visible {
    outline: 3px solid #3498db;
    outline-offset: 2px;
}

/* Print Styles */
@media print {
    /* Hide navigation and controls */
    .sidebar,
    .navbar,
    .dashboard-header,
    button,
    .close {
        display: none;
    }
    
    /* Adjust layout for print */
    body {
        margin: 0;
        padding: 0;
    }
    
    /* Ensure text is readable */
    body {
        color: #000;
        background: #fff;
        font-size: 12pt;
        line-height: 1.5;
    }
    
    a {
        color: #0000ee;
        text-decoration: underline;
    }
    
    /* Preserve colors for charts and important info */
    @page {
        margin: 1cm;
    }
}

/* Screen Reader Only Content */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

/* Visible Focus Indicator */
.has-focus {
    outline: 3px solid #3498db;
    outline-offset: 2px;
}
</style>

<!-- Mobile Accessibility -->
<!--
Ensure:
1. Touch targets are at least 48x48 pixels
2. Labels are associated with form inputs
3. Page is zoomable to 200%
4. Text sizing is adjustable
5. Color is not the only means of conveying information
-->
