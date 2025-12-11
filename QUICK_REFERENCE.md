# Quick Reference Guide - Quirino Online Library

## 🎯 Getting Started in 5 Minutes

### 1. Start the Server
```bash
npm install   # Install dependencies (first time only)
npm start     # Start local server
# Open: http://localhost:3000
```

### 2. Test the Application
```javascript
// Open browser console (F12)
runAllTests()  // Run all 50+ tests
```

### 3. Login Credentials
```
Student:     STU-001 / student123
Admin:       admin@example.com / admin123
Super Admin: superadmin@example.com / admin123
```

---

## 📚 Essential Files

| File | Purpose | Lines |
|------|---------|-------|
| index.html | Landing page | 150 |
| pages/admin-dashboard.html | Admin interface | 300+ |
| pages/student-dashboard.html | Student portal | 220 |
| js/auth.js | Authentication | 200+ |
| js/dashboard.js | Admin logic | 500+ |
| js/utils.js | **Utilities (NEW)** | 300+ |
| js/features.js | **Features (NEW)** | 400+ |
| js/performance.js | **Performance (NEW)** | 300+ |
| js/tests.js | **Testing (NEW)** | 400+ |

---

## 🔧 Most Used Functions

### Validation
```javascript
FormValidator.isValidEmail('test@test.com')
FormValidator.isValidPassword('Pass123')
FormValidator.isValidISBN('978-0-306-40615-2')
FormValidator.isValidPhone('+1-555-1234567')
```

### Data Management
```javascript
DataManager.getAllStudents()
DataManager.getAllBooks()
DataManager.getStudentById('STU-001')
DataManager.getBookByISBN('978-0-306-40615-1')
```

### UI & Alerts
```javascript
UIHelper.showSuccess('Action completed')
UIHelper.showError('Something went wrong')
UIHelper.formatDate(new Date())
UIHelper.formatCurrency(1500, 'USD')
```

### Search & Filter
```javascript
SearchFilter.searchStudents('John', students)
SearchFilter.searchBooks('programming', books)
SearchFilter.paginate(books, 1)  // Get first 10
```

### Export & Backup
```javascript
exportStudentsCSV()
exportBooksCSV()
backupSystemData()
restoreFromBackup(backupData)
```

### Logging & Stats
```javascript
logActivity('LOGIN', 'User logged in', userId)
getActivityLog()
generateLibraryStats()
getCategoryStats()
```

### Performance
```javascript
CacheManager.set('key', data, 30)  // 30 min cache
CacheManager.get('key')
PerformanceMonitor.logMetrics()
debounce(function, 300)  // For search
throttle(function, 1000)  // For scroll
```

---

## 🧪 Testing Commands

```javascript
// Run all tests
runAllTests()

// Check results
tester.passed   // # of passed tests
tester.failed   # # of failed tests
tester.results  // Detailed results

// Enable debug mode (auto-run tests on load)
localStorage.setItem('DEBUG_MODE', 'true')

// Clear debug mode
localStorage.removeItem('DEBUG_MODE')
```

---

## 📊 Admin Features Checklist

- [ ] Add/Edit/Delete students
- [ ] Add/Edit/Delete books
- [ ] Manage categories
- [ ] Issue books to students
- [ ] Return books
- [ ] View borrowing history
- [ ] Publish e-books
- [ ] Approve e-books
- [ ] Create admin accounts
- [ ] Generate reports
- [ ] Export data (CSV/JSON)
- [ ] View activity log
- [ ] Backup system data
- [ ] Send notifications

---

## 👤 Student Features Checklist

- [ ] Login/Register
- [ ] View dashboard
- [ ] Browse books
- [ ] Search books by title/author
- [ ] Filter by category
- [ ] Borrow books
- [ ] Return books
- [ ] Renew books (14 days)
- [ ] Rate books
- [ ] Add to wishlist
- [ ] View e-books
- [ ] Export borrowing history
- [ ] Update profile

---

## 🎨 Styling Classes

### Buttons
```html
<button class="btn">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-small">Small</button>
```

### Alerts
```html
<div class="alert alert-success">✅ Success</div>
<div class="alert alert-danger">❌ Error</div>
<div class="alert alert-warning">⚠️ Warning</div>
<div class="alert alert-info">ℹ️ Info</div>
```

### Badges
```html
<span class="badge">Default</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-danger">Danger</span>
<span class="badge badge-warning">Warning</span>
```

### Forms
```html
<div class="form-group">
    <label>Label</label>
    <input type="text" required>
</div>

<div class="form-group error">  <!-- Error state -->
    <label>Label</label>
    <input type="text">
    <span class="form-error">Error message</span>
</div>
```

---

## 🔍 Debug Mode

### Enable Debug Mode
```javascript
localStorage.setItem('DEBUG_MODE', 'true')
```

This will:
- Auto-run tests on page load
- Show more detailed error messages
- Enable console logging
- Display debug information

### Disable Debug Mode
```javascript
localStorage.removeItem('DEBUG_MODE')
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
max-width: 480px

/* Tablet */
min-width: 481px, max-width: 768px

/* Desktop */
min-width: 769px

/* Large Desktop */
min-width: 1024px
```

All features are fully responsive across all breakpoints.

---

## 🔐 Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9) or special character

### Valid Examples
- `MyPassword123`
- `SecurePass!`
- `MyLib@2024`

### Invalid Examples
- `password` (no uppercase or number)
- `Pass` (too short)
- `PASSWORD123` (no lowercase)

---

## 📧 Email Format

Valid email patterns:
- `user@example.com`
- `john.doe@company.co.uk`
- `test+alias@domain.org`

All emails are validated before storage.

---

## 📖 ISBN Format

Supported ISBN formats:
- `978-0-306-40615-2` (ISBN-13 with hyphens)
- `9780306406152` (ISBN-13 without hyphens)
- `0-306-40615-X` (ISBN-10 with hyphens)
- `030640615X` (ISBN-10 without hyphens)

---

## 📞 Phone Format

Supported phone formats:
- `+1-555-123-4567` (International)
- `555-123-4567` (US standard)
- `5551234567` (Digits only)
- `(555) 123-4567` (US with parentheses)

---

## 💾 Data Storage

All data stored in browser's localStorage:

```javascript
// View all data
JSON.parse(localStorage.getItem('students'))
JSON.parse(localStorage.getItem('books'))
JSON.parse(localStorage.getItem('borrowing'))
JSON.parse(localStorage.getItem('admins'))
JSON.parse(localStorage.getItem('ebooks'))
JSON.parse(localStorage.getItem('activities'))
```

### Backup Data
```javascript
const backup = backupSystemData()  // Get backup
localStorage.setItem('system_backup', backup)  // Store backup
```

### Restore Data
```javascript
const backup = localStorage.getItem('system_backup')
restoreFromBackup(backup)  // Restore from backup
```

---

## 🚀 Deployment

### Local Testing
```bash
npm start
# Visit http://localhost:3000
```

### Deploy to Render.com
1. Push to GitHub
2. Connect GitHub in Render dashboard
3. Select Node.js environment
4. Set start command: `npm start`
5. Deploy

### Environment Setup
```bash
Node.js: 18+
npm: 8+
Git: Latest
```

---

## 🆘 Common Issues

### Data Not Saving
```javascript
localStorage.clear()
location.reload()
```

### Tests Failing
```javascript
// Clear and reinitialize
localStorage.clear()
initializeDatabase()  // In auth.js
runAllTests()
```

### Performance Slow
```javascript
CacheManager.clearAll()
PerformanceMonitor.logMetrics()
// Check DevTools Performance tab
```

### Accessibility Issues
```javascript
// Test keyboard navigation (Tab key)
// Test with screen reader
// Check console for accessibility warnings
```

---

## 📖 Documentation Links

| Document | Purpose |
|----------|---------|
| README.md | Main documentation |
| FEATURES_DOCUMENTATION.md | Complete function reference |
| INTEGRATION_GUIDE.md | How to use new features |
| ACCESSIBILITY.md | Accessibility guide |
| PROJECT_SUMMARY.md | Project overview |
| This File | Quick reference |

---

## 🎓 Learn More

### JavaScript Concepts Used
- localStorage API
- Event delegation
- Closure and scope
- Promise and async/await
- Array methods (map, filter, reduce)
- Object destructuring
- Spread operator
- Template literals

### CSS Concepts Used
- Flexbox layout
- CSS Grid
- CSS Variables
- Media queries
- Animations and transitions
- Pseudo-elements
- Selector specificity

### Best Practices Shown
- Form validation
- Error handling
- Data persistence
- Activity logging
- Performance optimization
- Code organization
- Testing methodology

---

## 🎯 Next Steps

1. **Explore the Code**: Open files in VS Code
2. **Run Tests**: Execute `runAllTests()` in console
3. **Test Features**: Login and try each feature
4. **Read Documentation**: Check README.md and guides
5. **Monitor Performance**: Run `PerformanceMonitor.logMetrics()`
6. **Deploy**: Follow Render.com deployment steps
7. **Extend**: Add your own features using provided utilities

---

## 💡 Pro Tips

### Use Keyboard Shortcuts
- `Tab` - Navigate elements
- `Escape` - Close modals
- `?` - Show help (accessibility)
- `Enter` - Activate buttons/links
- `Space` - Toggle checkboxes

### Monitor Performance
```javascript
PerformanceMonitor.logMetrics()
PerformanceMonitor.reportWebVitals()
```

### Debug Activities
```javascript
getActivityLog().slice(-10)  // Last 10 activities
getActivityLog().filter(a => a.action === 'LOGIN')  // Filter by action
```

### Export for Analysis
```javascript
const csv = exportStudentsCSV()
const backup = backupSystemData()
// Download or analyze
```

### Cache Frequently Used Data
```javascript
CacheManager.set('my_data', data, 60)  // 60 min cache
const cached = CacheManager.get('my_data')
```

---

## ✅ Verification Checklist

Before submitting/deploying:

- [ ] All tests pass: `runAllTests()`
- [ ] No console errors (F12)
- [ ] Can login as student
- [ ] Can login as admin
- [ ] Can add/edit/delete students
- [ ] Can add/edit/delete books
- [ ] Can issue and return books
- [ ] Can export data
- [ ] Can backup/restore
- [ ] Responsive on mobile
- [ ] Accessibility features work
- [ ] Performance is acceptable

---

## 📞 Support

For issues or questions:
1. Check browser console (F12)
2. Enable debug mode
3. Run tests
4. Review documentation files
5. Check code comments in JS files

---

**Quick Note:** This is version 2.0.0 of the Quirino Online Library with comprehensive utilities, advanced features, testing framework, performance optimization, and accessibility support. It's ready for production deployment and educational use.

**Happy coding! 📚✨**

---

*Last Updated: 2024 | Version: 2.0.0 | Status: ✅ Production Ready*
