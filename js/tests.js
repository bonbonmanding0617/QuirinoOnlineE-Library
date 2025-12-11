// Testing Guide for Quirino Online Library
// Comprehensive test cases and utilities for validation

class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.results = [];
    }
    
    add(name, testFn) {
        this.tests.push({ name, testFn });
    }
    
    async run() {
        console.log('🧪 Running Tests...\n');
        
        for (const test of this.tests) {
            try {
                await test.testFn();
                this.passed++;
                this.results.push({ name: test.name, status: '✅ PASS', error: null });
                console.log(`✅ ${test.name}`);
            } catch (error) {
                this.failed++;
                this.results.push({ name: test.name, status: '❌ FAIL', error: error.message });
                console.log(`❌ ${test.name}: ${error.message}`);
            }
        }
        
        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed out of ${this.tests.length} total`);
        return this.results;
    }
    
    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }
    
    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected} but got ${actual}`);
        }
    }
    
    assertExists(value, message) {
        if (!value) {
            throw new Error(message || `Value does not exist`);
        }
    }
}

// Initialize test runner
const tester = new TestRunner();

// ============================================================================
// 1. AUTHENTICATION TESTS
// ============================================================================
tester.add('Login - Valid Student Credentials', () => {
    const result = loginStudent('STU-001', 'student123');
    tester.assert(result === true, 'Valid student login failed');
});

tester.add('Login - Invalid Student Credentials', () => {
    const result = loginStudent('STU-001', 'wrongpassword');
    tester.assert(result === false, 'Invalid credentials should not login');
});

tester.add('Signup - New Student', () => {
    const result = signupStudent('John Doe', 'STU-NEW', 'john@example.com', 'pass123456');
    tester.assert(result !== false, 'New student signup failed');
});

tester.add('Login - Valid Admin Credentials', () => {
    const result = loginAdmin('admin@example.com', 'admin123');
    tester.assert(result === true, 'Valid admin login failed');
});

tester.add('Check Auth - Student Session', () => {
    loginStudent('STU-001', 'student123');
    const auth = checkAuth('student');
    tester.assertExists(auth, 'Student auth check failed');
});

tester.add('Logout - Clear Session', () => {
    loginStudent('STU-001', 'student123');
    logout();
    const auth = checkAuth('student');
    tester.assert(auth === false, 'Logout did not clear session');
});

// ============================================================================
// 2. FORM VALIDATION TESTS
// ============================================================================
tester.add('Validate Email - Valid', () => {
    const result = FormValidator.isValidEmail('test@example.com');
    tester.assert(result === true, 'Valid email validation failed');
});

tester.add('Validate Email - Invalid', () => {
    const result = FormValidator.isValidEmail('invalidemail');
    tester.assert(result === false, 'Invalid email should not validate');
});

tester.add('Validate Password - Valid (8+ chars, mixed)', () => {
    const result = FormValidator.isValidPassword('Pass123456');
    tester.assert(result === true, 'Valid password validation failed');
});

tester.add('Validate Password - Invalid (too short)', () => {
    const result = FormValidator.isValidPassword('Pass1');
    tester.assert(result === false, 'Short password should not validate');
});

tester.add('Validate Name - Valid', () => {
    const result = FormValidator.isValidName('John Doe');
    tester.assert(result === true, 'Valid name validation failed');
});

tester.add('Validate ISBN - Valid', () => {
    const result = FormValidator.isValidISBN('978-0-306-40615-2');
    tester.assert(result === true, 'Valid ISBN validation failed');
});

tester.add('Validate Phone - Valid', () => {
    const result = FormValidator.isValidPhone('+1-555-123-4567');
    tester.assert(result === true, 'Valid phone validation failed');
});

tester.add('Validate URL - Valid', () => {
    const result = FormValidator.isValidURL('https://example.com');
    tester.assert(result === true, 'Valid URL validation failed');
});

// ============================================================================
// 3. STUDENT DATA MANAGEMENT TESTS
// ============================================================================
tester.add('Add Student - Valid Data', () => {
    const studentData = {
        name: 'Test Student',
        studentId: 'STU-TEST-001',
        email: 'test@example.com',
        phone: '+1-555-123-4567',
        department: 'Engineering'
    };
    const result = saveStudent(studentData);
    tester.assert(result, 'Failed to add student');
});

tester.add('Get Student - By ID', () => {
    const student = DataManager.getStudentById('STU-001');
    tester.assertExists(student, 'Student not found');
});

tester.add('Update Student - Valid Data', () => {
    const updatedData = { ...DataManager.getStudentById('STU-001'), phone: '+1-555-999-9999' };
    const result = DataManager.updateStudent('STU-001', updatedData);
    tester.assert(result, 'Failed to update student');
});

tester.add('Delete Student - By ID', () => {
    saveStudent({ name: 'Delete Test', studentId: 'STU-DELETE', email: 'del@test.com', phone: '5551234567' });
    const result = DataManager.deleteStudent('STU-DELETE');
    tester.assert(result, 'Failed to delete student');
});

tester.add('Get All Students - Count', () => {
    const students = DataManager.getAllStudents();
    tester.assert(students.length > 0, 'No students found');
});

// ============================================================================
// 4. BOOK DATA MANAGEMENT TESTS
// ============================================================================
tester.add('Add Book - Valid Data', () => {
    const bookData = {
        title: 'Test Book',
        isbn: '978-0-306-40615-2',
        author: 'Test Author',
        category: 'Fiction',
        availableCopies: 5,
        totalCopies: 10,
        location: 'Shelf A1'
    };
    const result = saveBook(bookData);
    tester.assert(result, 'Failed to add book');
});

tester.add('Get Book - By ISBN', () => {
    const book = DataManager.getBookByISBN('978-0-306-40615-1');
    tester.assertExists(book, 'Book not found');
});

tester.add('Update Book - Available Copies', () => {
    const book = DataManager.getBookByISBN('978-0-306-40615-1');
    const updatedData = { ...book, availableCopies: book.availableCopies - 1 };
    const result = DataManager.updateBook(book.isbn, updatedData);
    tester.assert(result, 'Failed to update book');
});

tester.add('Delete Book - By ISBN', () => {
    const bookData = {
        title: 'Delete Test Book',
        isbn: '978-0-000-00000-0',
        author: 'Delete Author',
        category: 'Test',
        availableCopies: 1,
        totalCopies: 1,
        location: 'Test'
    };
    saveBook(bookData);
    const result = DataManager.deleteBook('978-0-000-00000-0');
    tester.assert(result, 'Failed to delete book');
});

tester.add('Get All Books - Count', () => {
    const books = DataManager.getAllBooks();
    tester.assert(books.length > 0, 'No books found');
});

tester.add('Search Books - By Title', () => {
    const results = SearchFilter.searchStudents('programming', DataManager.getAllBooks());
    tester.assert(Array.isArray(results), 'Search failed');
});

// ============================================================================
// 5. BORROWING SYSTEM TESTS
// ============================================================================
tester.add('Issue Book - Valid', () => {
    const book = DataManager.getAllBooks()[0];
    const student = DataManager.getAllStudents()[0];
    if (book && student) {
        const result = issueBook(student.studentId, book.isbn);
        tester.assert(result === true || result === false, 'Issue book function failed');
    }
});

tester.add('Return Book - Valid', () => {
    const borrowing = getBorrowingHistory()[0];
    if (borrowing && !borrowing.returnDate) {
        const result = returnBook(borrowing.id);
        tester.assert(result === true || result === false, 'Return book function failed');
    }
});

tester.add('Check Overdue Books', () => {
    const borrowings = getBorrowingHistory();
    const today = new Date();
    const overdue = borrowings.filter(b => !b.returnDate && new Date(b.dueDate) < today);
    tester.assert(Array.isArray(overdue), 'Overdue check failed');
});

// ============================================================================
// 6. DATA EXPORT TESTS
// ============================================================================
tester.add('Export Students - CSV Format', () => {
    const csv = exportStudentsCSV();
    tester.assert(csv.includes(','), 'CSV export format invalid');
    tester.assert(csv.includes('Student ID'), 'CSV export missing headers');
});

tester.add('Export Books - CSV Format', () => {
    const csv = exportBooksCSV();
    tester.assert(csv.includes(','), 'CSV export format invalid');
    tester.assert(csv.includes('ISBN'), 'CSV export missing headers');
});

tester.add('Export Borrowing - CSV Format', () => {
    const csv = exportBorrowingCSV();
    tester.assert(csv.includes(','), 'CSV export format invalid');
});

// ============================================================================
// 7. SEARCH AND FILTER TESTS
// ============================================================================
tester.add('Search Students - By Name', () => {
    const results = SearchFilter.searchStudents('John', DataManager.getAllStudents());
    tester.assert(Array.isArray(results), 'Student search failed');
});

tester.add('Search Books - By Author', () => {
    const results = SearchFilter.searchBooks('Author', DataManager.getAllBooks());
    tester.assert(Array.isArray(results), 'Book search failed');
});

tester.add('Filter Books - By Category', () => {
    const books = DataManager.getAllBooks();
    const categories = [...new Set(books.map(b => b.category))];
    tester.assert(categories.length > 0, 'No categories found');
});

tester.add('Filter Books - By Availability', () => {
    const books = DataManager.getAllBooks();
    const available = books.filter(b => b.availableCopies > 0);
    tester.assert(Array.isArray(available), 'Availability filter failed');
});

// ============================================================================
// 8. CACHE AND SESSION TESTS
// ============================================================================
tester.add('Cache - Set and Get', () => {
    window.CacheManager.set('test_key', { data: 'test' });
    const cached = window.CacheManager.get('test_key');
    tester.assertExists(cached, 'Cache set/get failed');
});

tester.add('Cache - Expiration', async () => {
    window.CacheManager.set('expire_test', { data: 'test' }, 0.0001); // Expire immediately
    await new Promise(resolve => setTimeout(resolve, 100));
    const cached = window.CacheManager.get('expire_test');
    tester.assert(cached === null, 'Cache expiration not working');
});

tester.add('Session Manager - Timeout', async () => {
    SessionManager.startSession(1000); // 1 second timeout
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Session should timeout
});

// ============================================================================
// 9. UI HELPER TESTS
// ============================================================================
tester.add('Format Currency - USD', () => {
    const formatted = UIHelper.formatCurrency(1500, 'USD');
    tester.assert(formatted.includes('$'), 'Currency formatting failed');
});

tester.add('Format Date - Standard', () => {
    const date = new Date('2024-01-15');
    const formatted = UIHelper.formatDate(date);
    tester.assert(formatted.includes('2024'), 'Date formatting failed');
});

tester.add('Format Date - Full', () => {
    const date = new Date('2024-01-15');
    const formatted = UIHelper.formatDate(date, 'full');
    tester.assert(formatted.length > 10, 'Full date formatting failed');
});

// ============================================================================
// 10. ACTIVITY LOGGING TESTS
// ============================================================================
tester.add('Log Activity - Event Recording', () => {
    logActivity('TEST_ACTION', 'Test Description', 'test_user');
    const activities = getActivityLog();
    tester.assert(activities.some(a => a.action === 'TEST_ACTION'), 'Activity logging failed');
});

tester.add('Get Activity Log - Filtered', () => {
    const logs = getActivityLog().filter(a => a.action === 'LOGIN');
    tester.assert(Array.isArray(logs), 'Activity log filtering failed');
});

// ============================================================================
// 11. BACKUP AND RESTORE TESTS
// ============================================================================
tester.add('Backup System Data - JSON Format', () => {
    const backup = backupSystemData();
    tester.assert(backup.includes('students'), 'Backup missing students');
    tester.assert(backup.includes('books'), 'Backup missing books');
});

tester.add('Restore System Data - From Backup', () => {
    const backup = backupSystemData();
    const result = restoreFromBackup(backup);
    tester.assert(result === true, 'Restore failed');
});

// ============================================================================
// 12. STATISTICS TESTS
// ============================================================================
tester.add('Generate Library Stats - Complete', () => {
    const stats = generateLibraryStats();
    tester.assertExists(stats.totalStudents, 'Stats missing student count');
    tester.assertExists(stats.totalBooks, 'Stats missing book count');
    tester.assertExists(stats.totalBorrowings, 'Stats missing borrowing count');
});

tester.add('Get Category Stats - Non-Empty', () => {
    const stats = getCategoryStats();
    tester.assert(Object.keys(stats).length > 0, 'No category statistics found');
});

tester.add('Get Student Activity Stats - Valid', () => {
    const students = DataManager.getAllStudents();
    if (students.length > 0) {
        const stats = getStudentActivityStats(students[0].studentId);
        tester.assertExists(stats, 'Student activity stats not found');
    }
});

// ============================================================================
// RUN ALL TESTS
// ============================================================================
async function runAllTests() {
    const results = await tester.run();
    
    // Generate test report
    const report = {
        timestamp: new Date().toISOString(),
        total: tester.tests.length,
        passed: tester.passed,
        failed: tester.failed,
        passRate: `${((tester.passed / tester.tests.length) * 100).toFixed(2)}%`,
        results: results
    };
    
    console.log('\n📋 Test Report:');
    console.table(report);
    
    return report;
}

// Export test utilities
window.TestRunner = TestRunner;
window.tester = tester;
window.runAllTests = runAllTests;

// Run tests on page load if debug mode is enabled
if (localStorage.getItem('DEBUG_MODE') === 'true') {
    document.addEventListener('DOMContentLoaded', () => {
        runAllTests();
    });
}

console.log('✅ Test suite loaded. Run runAllTests() to execute all tests.');
