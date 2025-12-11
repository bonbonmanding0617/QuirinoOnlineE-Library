// Utilities and Validation Functions

// Form Validation
const FormValidator = {
    // Email validation
    isEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Password validation
    isStrongPassword: (password) => {
        return password && password.length >= 6;
    },

    // Name validation
    isValidName: (name) => {
        return name && name.trim().length >= 2;
    },

    // Student ID validation
    isValidStudentId: (id) => {
        return id && id.trim().length >= 3;
    },

    // ISBN validation
    isValidISBN: (isbn) => {
        return isbn && isbn.replace(/-/g, '').length >= 10;
    },

    // Phone number validation
    isValidPhone: (phone) => {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        return phoneRegex.test(phone);
    },

    // URL validation
    isValidURL: (url) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    },

    // Validate form fields
    validateField: (name, value) => {
        const errors = {};

        switch(name) {
            case 'email':
                if (!value) errors.email = 'Email is required';
                else if (!FormValidator.isEmail(value)) errors.email = 'Invalid email format';
                break;
            case 'password':
                if (!value) errors.password = 'Password is required';
                else if (!FormValidator.isStrongPassword(value)) errors.password = 'Password must be at least 6 characters';
                break;
            case 'name':
                if (!value) errors.name = 'Name is required';
                else if (!FormValidator.isValidName(value)) errors.name = 'Name must be at least 2 characters';
                break;
            case 'title':
                if (!value) errors.title = 'Title is required';
                else if (value.trim().length < 2) errors.title = 'Title must be at least 2 characters';
                break;
            case 'author':
                if (!value) errors.author = 'Author is required';
                else if (!FormValidator.isValidName(value)) errors.author = 'Author must be at least 2 characters';
                break;
            case 'isbn':
                if (!value) errors.isbn = 'ISBN is required';
                else if (!FormValidator.isValidISBN(value)) errors.isbn = 'Invalid ISBN format';
                break;
        }

        return errors;
    }
};

// UI Helper Functions
const UIHelper = {
    // Show loading spinner
    showLoading: (element, show = true) => {
        if (show) {
            element.innerHTML = '<div class="spinner"></div> Loading...';
            element.disabled = true;
        } else {
            element.disabled = false;
        }
    },

    // Format date
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Format date time
    formatDateTime: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Truncate text
    truncateText: (text, length = 50) => {
        return text && text.length > length ? text.substring(0, length) + '...' : text;
    },

    // Display error in form field
    showFieldError: (fieldId, errorMessage) => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.parentElement.classList.add('error');
            let errorEl = field.parentElement.querySelector('.form-error');
            if (!errorEl) {
                errorEl = document.createElement('div');
                errorEl.className = 'form-error';
                field.parentElement.appendChild(errorEl);
            }
            errorEl.textContent = errorMessage;
        }
    },

    // Clear field error
    clearFieldError: (fieldId) => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.parentElement.classList.remove('error');
            const errorEl = field.parentElement.querySelector('.form-error');
            if (errorEl) errorEl.remove();
        }
    },

    // Clear all errors in form
    clearFormErrors: (formId) => {
        const form = document.getElementById(formId);
        if (form) {
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
                const errorEl = group.querySelector('.form-error');
                if (errorEl) errorEl.remove();
            });
        }
    },

    // Show success message
    showSuccess: (message) => {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.innerHTML = `✅ ${message}`;
        document.body.insertBefore(alertDiv, document.body.firstChild);
        
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            alertDiv.style.transition = 'opacity 0.3s';
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    },

    // Show error message
    showError: (message) => {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger';
        alertDiv.innerHTML = `❌ ${message}`;
        document.body.insertBefore(alertDiv, document.body.firstChild);
        
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            alertDiv.style.transition = 'opacity 0.3s';
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    },

    // Show warning message
    showWarning: (message) => {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-warning';
        alertDiv.innerHTML = `⚠️ ${message}`;
        document.body.insertBefore(alertDiv, document.body.firstChild);
        
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            alertDiv.style.transition = 'opacity 0.3s';
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    }
};

// Data Export Functions
const DataExport = {
    // Export to CSV
    toCSV: (data, filename = 'data.csv') => {
        if (!Array.isArray(data) || data.length === 0) {
            UIHelper.showError('No data to export');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header];
                    const escaped = String(value).replace(/"/g, '""');
                    return `"${escaped}"`;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);

        UIHelper.showSuccess('Data exported successfully');
    },

    // Export to JSON
    toJSON: (data, filename = 'data.json') => {
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);

        UIHelper.showSuccess('Data exported successfully');
    }
};

// Data Management
const DataManager = {
    // Get all students
    getStudents: () => {
        return JSON.parse(localStorage.getItem('students') || '[]');
    },

    // Get student by ID
    getStudentById: (id) => {
        return DataManager.getStudents().find(s => s.id === id);
    },

    // Add student
    addStudent: (student) => {
        const students = DataManager.getStudents();
        const newStudent = {
            id: Date.now().toString(),
            ...student,
            createdAt: new Date().toISOString()
        };
        students.push(newStudent);
        localStorage.setItem('students', JSON.stringify(students));
        return newStudent;
    },

    // Update student
    updateStudent: (id, updates) => {
        const students = DataManager.getStudents();
        const index = students.findIndex(s => s.id === id);
        if (index !== -1) {
            students[index] = { ...students[index], ...updates };
            localStorage.setItem('students', JSON.stringify(students));
            return students[index];
        }
        return null;
    },

    // Delete student
    deleteStudent: (id) => {
        const students = DataManager.getStudents();
        const filtered = students.filter(s => s.id !== id);
        localStorage.setItem('students', JSON.stringify(filtered));
        return true;
    },

    // Get all books
    getBooks: () => {
        return JSON.parse(localStorage.getItem('books') || '[]');
    },

    // Get book by ID
    getBookById: (id) => {
        return DataManager.getBooks().find(b => b.id === id);
    },

    // Add book
    addBook: (book) => {
        const books = DataManager.getBooks();
        const newBook = {
            id: Date.now().toString(),
            ...book,
            createdAt: new Date().toISOString()
        };
        books.push(newBook);
        localStorage.setItem('books', JSON.stringify(books));
        return newBook;
    },

    // Update book
    updateBook: (id, updates) => {
        const books = DataManager.getBooks();
        const index = books.findIndex(b => b.id === id);
        if (index !== -1) {
            books[index] = { ...books[index], ...updates };
            localStorage.setItem('books', JSON.stringify(books));
            return books[index];
        }
        return null;
    },

    // Delete book
    deleteBook: (id) => {
        const books = DataManager.getBooks();
        const filtered = books.filter(b => b.id !== id);
        localStorage.setItem('books', JSON.stringify(filtered));
        return true;
    }
};

// Search and Filter
const SearchFilter = {
    // Search students
    searchStudents: (query) => {
        const students = DataManager.getStudents();
        const lowerQuery = query.toLowerCase();
        return students.filter(s => 
            s.name.toLowerCase().includes(lowerQuery) ||
            s.email.toLowerCase().includes(lowerQuery) ||
            s.studentId.toLowerCase().includes(lowerQuery)
        );
    },

    // Search books
    searchBooks: (query) => {
        const books = DataManager.getBooks();
        const lowerQuery = query.toLowerCase();
        return books.filter(b => 
            b.title.toLowerCase().includes(lowerQuery) ||
            b.author.toLowerCase().includes(lowerQuery) ||
            b.isbn.toLowerCase().includes(lowerQuery)
        );
    },

    // Filter books by category
    filterByCategory: (category) => {
        const books = DataManager.getBooks();
        return books.filter(b => b.category === category);
    },

    // Filter books by availability
    filterAvailable: (available = true) => {
        const books = DataManager.getBooks();
        return available ? 
            books.filter(b => b.available > 0) : 
            books.filter(b => b.available === 0);
    }
};

// Print Functions
const PrintHelper = {
    // Print table
    printTable: (tableId, title = '') => {
        const table = document.getElementById(tableId);
        if (!table) {
            UIHelper.showError('Table not found');
            return;
        }

        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${title || 'Print'}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #2c3e50; }
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                        th { background-color: #2c3e50; color: white; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    ${table.outerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 250);
    }
};

// Session Management
const SessionManager = {
    // Get session timeout (in minutes)
    SESSION_TIMEOUT: 30,

    // Start session timer
    startSessionTimer: () => {
        let timeout;
        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                logout();
                UIHelper.showWarning('Session expired. Please log in again.');
            }, SessionManager.SESSION_TIMEOUT * 60 * 1000);
        };

        ['click', 'keypress', 'mousemove'].forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });

        resetTimer();
    },

    // Clear session
    clearSession: () => {
        localStorage.removeItem('currentUser');
        sessionStorage.clear();
    }
};

// Notification System
const NotificationCenter = {
    // Get pending notifications
    getPendingNotifications: () => {
        const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
        const books = JSON.parse(localStorage.getItem('books') || '[]');
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        
        const today = new Date();
        const notifications = [];

        // Overdue books
        borrowing.forEach(b => {
            if (!b.returnedDate && new Date(b.dueDate) < today) {
                const student = students.find(s => s.id === b.studentId);
                const book = books.find(k => k.id === b.bookId);
                notifications.push({
                    type: 'overdue',
                    title: 'Overdue Book',
                    message: `${student?.name || 'Student'} has overdue: ${book?.title || 'Unknown'}`,
                    date: b.dueDate,
                    priority: 'high'
                });
            }
        });

        // Due soon
        borrowing.forEach(b => {
            if (!b.returnedDate) {
                const daysLeft = Math.ceil((new Date(b.dueDate) - today) / (1000 * 60 * 60 * 24));
                if (daysLeft <= 3 && daysLeft > 0) {
                    const student = students.find(s => s.id === b.studentId);
                    const book = books.find(k => k.id === b.bookId);
                    notifications.push({
                        type: 'due-soon',
                        title: 'Due Soon',
                        message: `${book?.title || 'Book'} due in ${daysLeft} days`,
                        date: b.dueDate,
                        priority: 'medium'
                    });
                }
            }
        });

        return notifications.sort((a, b) => {
            const priorityMap = { high: 3, medium: 2, low: 1 };
            return priorityMap[b.priority] - priorityMap[a.priority];
        });
    },

    // Count unread notifications
    getUnreadCount: () => {
        return NotificationCenter.getPendingNotifications().length;
    }
};

// Statistics Helper
const StatsHelper = {
    // Calculate average
    average: (numbers) => {
        if (numbers.length === 0) return 0;
        return numbers.reduce((a, b) => a + b, 0) / numbers.length;
    },

    // Calculate total
    sum: (numbers) => {
        return numbers.reduce((a, b) => a + b, 0);
    },

    // Calculate percentage
    percentage: (value, total) => {
        return total === 0 ? 0 : Math.round((value / total) * 100);
    },

    // Get most borrowed books
    getMostBorrowedBooks: (limit = 5) => {
        const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
        const books = DataManager.getBooks();
        
        const borrowed = {};
        borrowing.forEach(b => {
            borrowed[b.bookId] = (borrowed[b.bookId] || 0) + 1;
        });

        return Object.entries(borrowed)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([id, count]) => ({
                book: books.find(b => b.id === id),
                count
            }));
    }
};

// Export all utilities
window.FormValidator = FormValidator;
window.UIHelper = UIHelper;
window.DataExport = DataExport;
window.DataManager = DataManager;
window.SearchFilter = SearchFilter;
window.PrintHelper = PrintHelper;
window.SessionManager = SessionManager;
window.NotificationCenter = NotificationCenter;
window.StatsHelper = StatsHelper;
