<!-- Integration Guide for New Features -->
<!-- Add these script includes to your HTML files -->

<!-- For admin-dashboard.html, add to <head> or before </body> -->
<script src="../js/performance.js"></script>
<script src="../js/tests.js"></script>

<!-- For student-dashboard.html, add to <head> or before </body> -->
<script src="../js/performance.js"></script>
<script src="../js/tests.js"></script>

<!-- For index.html (optional, for performance monitoring) -->
<script src="js/performance.js"></script>
<script src="js/tests.js"></script>

<!-- ============================================================================ -->
<!-- FEATURE ACTIVATION GUIDE -->
<!-- ============================================================================ -->

<!-- 1. ENABLE PERFORMANCE MONITORING -->
<script>
// Add this to your JavaScript initialization
document.addEventListener('DOMContentLoaded', () => {
    // Log performance metrics when page loads
    PerformanceMonitor.logMetrics();
    
    // Report Web Vitals
    PerformanceMonitor.reportWebVitals();
    
    // Initialize lazy loading
    if (window.initLazyLoading) {
        initLazyLoading();
    }
});
</script>

<!-- 2. ENABLE TESTING FRAMEWORK -->
<script>
// In browser console, run:
// runAllTests() - Runs all 50+ tests
// tester.passed - View number of passed tests
// tester.failed - View number of failed tests
// tester.results - View detailed test results

// Enable debug mode to auto-run tests on page load
localStorage.setItem('DEBUG_MODE', 'true');
</script>

<!-- 3. USE ACCESSIBILITY FEATURES -->
<!-- Add to admin-dashboard.html or student-dashboard.html -->
<script>
// Keyboard shortcuts
// ESC - Close modals/dialogs
// S - Student Login (home page)
// A - Admin Login (home page)
// ? - Show keyboard shortcuts

// All interactive elements now have proper ARIA labels
// Tab navigation works throughout the application
// High contrast mode automatically detected
// Screen readers fully supported
</script>

<!-- 4. USE PERFORMANCE OPTIMIZATION -->
<script>
// Use debounce for search inputs
const searchInput = document.querySelector('#search');
if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
        performSearch(e.target.value);
    }, 300));
}

// Use cache for frequently accessed data
function loadStudentsWithCache() {
    let students = CacheManager.get('students_list');
    if (!students) {
        students = DataManager.getAllStudents();
        CacheManager.set('students_list', students, 30);
    }
    return students;
}

// Monitor operations
const result = PerformanceMonitor.measureOperation('Load Students', () => {
    return loadStudentsWithCache();
});
</script>

<!-- ============================================================================ -->
<!-- TESTING COMMANDS -->
<!-- ============================================================================ -->

<!-- Run these in the browser console (F12) -->
<script>
/*
QUICK TESTING COMMANDS:

1. Run All Tests
   runAllTests()

2. Test Authentication
   loginStudent('STU-001', 'student123')
   loginAdmin('admin@example.com', 'admin123')

3. Test Form Validation
   FormValidator.isValidEmail('test@example.com')
   FormValidator.isValidPassword('Pass123456')
   FormValidator.isValidISBN('978-0-306-40615-2')

4. Test Data Management
   DataManager.getAllStudents()
   DataManager.getAllBooks()
   SearchFilter.searchStudents('John', DataManager.getAllStudents())

5. Test Data Export
   exportStudentsCSV()
   exportBooksCSV()
   backupSystemData()

6. Test Caching
   CacheManager.set('test', { data: 'test' })
   CacheManager.get('test')
   CacheManager.clearAll()

7. Test Performance
   PerformanceMonitor.logMetrics()
   PerformanceMonitor.reportWebVitals()

8. Test Activity Logging
   getActivityLog()
   logActivity('TEST', 'Test action', 'user')

9. View Statistics
   generateLibraryStats()
   getCategoryStats()

10. Enable Debug Mode
    localStorage.setItem('DEBUG_MODE', 'true')
    localStorage.removeItem('DEBUG_MODE')
*/
</script>

<!-- ============================================================================ -->
<!-- TROUBLESHOOTING CONSOLE COMMANDS -->
<!-- ============================================================================ -->

<script>
/*
TROUBLESHOOTING COMMANDS:

1. Check Data Initialization
   console.log('Students:', DataManager.getAllStudents())
   console.log('Books:', DataManager.getAllBooks())

2. Check Cache Status
   console.log('Cache Size:', Object.keys(localStorage).length)
   console.log('Cache Keys:', Object.keys(localStorage))

3. Check Activity Log
   console.log('Recent Activities:', getActivityLog().slice(-10))

4. Check Session Status
   console.log('Current User:', localStorage.getItem('currentUser'))
   console.log('User Role:', localStorage.getItem('userRole'))

5. Check Browser Support
   console.log('localStorage Support:', typeof(Storage) !== 'undefined')
   console.log('Service Worker Support:', 'serviceWorker' in navigator)

6. Clear All Data (WARNING: Resets everything)
   localStorage.clear()
   location.reload()

7. Check Error Log
   Object.keys(localStorage).filter(k => k.startsWith('error_'))

8. Performance Analysis
   PerformanceMonitor.logMetrics()
   performance.memory  // Chrome only

9. Test Accessibility
   document.querySelectorAll('button:not([aria-label])')  // Buttons without labels
   document.querySelectorAll('img:not([alt])')            // Images without alt
   document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])')  // Inputs without labels

10. Run Single Test
    tester.add('Custom Test', () => {
        const result = testFunction();
        tester.assert(result === true, 'Test failed');
    });
    tester.run()
*/
</script>

<!-- ============================================================================ -->
<!-- FEATURE INITIALIZATION GUIDE -->
<!-- ============================================================================ -->

<!-- Step 1: Include the scripts in your HTML -->
<!-- Already done: Performance.js, tests.js, utils.js, features.js -->

<!-- Step 2: Initialize performance monitoring on page load -->
<script>
document.addEventListener('DOMContentLoaded', () => {
    // Initialize performance tracking
    PerformanceMonitor.logMetrics();
    
    // Initialize lazy loading for images
    initLazyLoading();
    
    // Apply accessibility features
    console.log('✅ Performance and accessibility features initialized');
});
</script>

<!-- Step 3: Use utility functions throughout your code -->
<script>
// Example 1: Form Validation
function handleFormSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    
    if (!FormValidator.isValidEmail(email)) {
        UIHelper.showError('Please enter a valid email');
        return;
    }
    
    // Submit form
    UIHelper.showSuccess('Form submitted successfully');
    logActivity('FORM_SUBMIT', `Submitted form with email: ${email}`);
}

// Example 2: Data Management with Caching
function getStudents(forceRefresh = false) {
    if (!forceRefresh) {
        const cached = CacheManager.get('students');
        if (cached) return cached;
    }
    
    const students = DataManager.getAllStudents();
    CacheManager.set('students', students, 30);
    return students;
}

// Example 3: Performance Monitoring
function slowOperation() {
    return PerformanceMonitor.measureOperation('Slow Operation', () => {
        // Do something that takes time
        let sum = 0;
        for (let i = 0; i < 1000000; i++) {
            sum += i;
        }
        return sum;
    });
}

// Example 4: Search with Debounce
const handleSearch = debounce((query) => {
    const results = SearchFilter.searchBooks(query, DataManager.getAllBooks());
    displayResults(results);
}, 300);

// Example 5: Activity Logging
function importantAction(action, description) {
    logActivity(action, description, currentUserID);
    UIHelper.showSuccess(description + ' completed');
}
</script>

<!-- Step 4: Access features from browser console -->
<script>
/*
All features are available globally:

FormValidator.isValidEmail()
FormValidator.isValidPassword()
UIHelper.showSuccess()
UIHelper.showError()
DataManager.getAllStudents()
DataManager.getAllBooks()
SearchFilter.searchStudents()
CacheManager.get()
CacheManager.set()
PerformanceMonitor.logMetrics()
runAllTests()
exportStudentsCSV()
backupSystemData()
logActivity()
getActivityLog()
*/
</script>

<!-- ============================================================================ -->
<!-- MIGRATION CHECKLIST -->
<!-- ============================================================================ -->

<script>
/*
MIGRATION CHECKLIST - Follow these steps to integrate new features:

1. ✅ Create/Update Files
   - performance.js (created)
   - tests.js (created)
   - ACCESSIBILITY.md (created)
   - This integration guide

2. ✅ Update HTML Files
   - admin-dashboard.html: Add <script src="../js/performance.js"></script>
   - admin-dashboard.html: Add <script src="../js/tests.js"></script>
   - student-dashboard.html: Add both script tags
   - index.html: Add script tags (optional)

3. ✅ Verify Functionality
   - Open browser console (F12)
   - Run: runAllTests()
   - Verify: All tests pass or identify issues

4. ✅ Test Performance
   - Open Performance Monitor: PerformanceMonitor.logMetrics()
   - Check Web Vitals: PerformanceMonitor.reportWebVitals()
   - Monitor memory usage in DevTools

5. ✅ Test Accessibility
   - Navigate with keyboard only (Tab, Enter, Escape)
   - Check with screen reader (NVDA, JAWS, VoiceOver)
   - Verify: Focus visible on all interactive elements
   - Run: document.querySelectorAll('button:not([aria-label])')

6. ✅ Enable Caching
   - Import performance.js loads caching utilities
   - Use: CacheManager.set() and CacheManager.get()
   - Configure cache duration as needed

7. ✅ Setup Monitoring
   - Add performance logging to critical operations
   - Use: PerformanceMonitor.measureOperation()
   - Export metrics for analysis

8. ✅ Configure Testing
   - Enable debug mode: localStorage.setItem('DEBUG_MODE', 'true')
   - Tests auto-run on page load
   - Access results: tester.results

9. ✅ Deploy to Render.com
   - All files committed to git
   - server.js configured
   - package.json updated
   - Run: npm start locally
   - Deploy to Render.com

10. ✅ Monitor Production
    - Check browser console for errors
    - Monitor performance metrics
    - Review activity logs
    - Test all user flows
*/
</script>

<!-- ============================================================================ -->
<!-- COMMON USE CASES -->
<!-- ============================================================================ -->

<script>
/*
COMMON USE CASES:

1. Add Student with Full Validation
   const studentData = {
       name: 'John Doe',
       studentId: 'STU-001',
       email: 'john@example.com',
       phone: '+1-555-123-4567',
       department: 'Engineering'
   };
   
   if (FormValidator.isValidEmail(studentData.email) &&
       FormValidator.isValidPhone(studentData.phone)) {
       saveStudent(studentData);
       logActivity('ADD_STUDENT', `Added student: ${studentData.name}`);
   }

2. Search with Caching
   function searchBooks(query) {
       // Check cache first
       let results = CacheManager.get(`search_${query}`);
       
       if (!results) {
           results = SearchFilter.searchBooks(query, DataManager.getAllBooks());
           CacheManager.set(`search_${query}`, results, 15);
       }
       
       return results;
   }

3. Export Data with Logging
   function exportData(type) {
       let csv = '';
       if (type === 'students') csv = exportStudentsCSV();
       else if (type === 'books') csv = exportBooksCSV();
       
       logActivity('EXPORT_DATA', `Exported ${type}`);
       download(csv, `${type}.csv`);
   }

4. Backup and Restore
   function createBackup() {
       const backup = backupSystemData();
       localStorage.setItem('last_backup', new Date().toISOString());
       return backup;
   }
   
   function restoreData(backupData) {
       if (confirm('Are you sure? This will replace all data.')) {
           restoreFromBackup(backupData);
           logActivity('RESTORE_BACKUP', 'System data restored from backup');
       }
   }

5. Monitor Operation Performance
   const users = PerformanceMonitor.measureOperation('Load Users', () => {
       return DataManager.getAllStudents();
   });

6. Implement Session Timeout
   SessionManager.startSession(1800000); // 30 minutes
   // User will be logged out after 30 minutes of inactivity

7. Generate Reports
   function generateReport() {
       const stats = generateLibraryStats();
       const categoryStats = getCategoryStats();
       
       printBorrowingReport();
       logActivity('GENERATE_REPORT', 'Generated library report');
   }

8. Handle Form Errors
   function validateAndSave(formData) {
       const errors = [];
       
       if (!FormValidator.isValidEmail(formData.email)) {
           errors.push('Invalid email format');
       }
       if (!FormValidator.isValidPassword(formData.password)) {
           errors.push('Password must be 8+ characters with mixed case');
       }
       
       if (errors.length > 0) {
           UIHelper.showError(errors.join(', '));
           return false;
       }
       
       return true;
   }

9. Track User Activity
   function trackAction(action, description) {
       logActivity(action, description, getCurrentUserId());
       
       // View activity log
       const log = getActivityLog();
       console.log('Recent actions:', log.slice(-5));
   }

10. Cache Configuration
    // Set cache for different durations
    CacheManager.set('frequently_used_data', data, 60);     // 60 minutes
    CacheManager.set('session_data', data, 30);             // 30 minutes
    CacheManager.set('temporary_data', data, 5);            // 5 minutes
*/
</script>

<!-- ============================================================================ -->
<!-- END OF INTEGRATION GUIDE -->
<!-- ============================================================================ -->
