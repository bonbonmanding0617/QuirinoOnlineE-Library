// Dashboard JavaScript - Admin/Teacher Functions

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializeUser();
    initializeSession();
    loadAllData();
    setDefaultDates();
    logActivity('Dashboard Load', { page: 'admin-dashboard' });
    
    // Load profile form when page loads
    setTimeout(loadProfileForm, 500);
    
    // Add event listeners for Issue Books form
    const issueStudentSelect = document.getElementById('issue-student');
    if (issueStudentSelect) {
        issueStudentSelect.addEventListener('change', showStudentInfo);
    }
});

// Initialize session data
function initializeSession() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser.sessionStartTime) {
        currentUser.sessionStartTime = new Date().toISOString();
    }
    currentUser.lastActivity = new Date().toISOString();
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Initialize user data
function initializeUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('header-name').textContent = currentUser.name;
    document.getElementById('header-role').textContent = capitalizeRole(currentUser.role);
    document.getElementById('header-avatar').src = currentUser.profilePicture;
}

// Load all dashboard data
function loadAllData() {
    loadStudentsTable();
    loadBooksTable();
    loadCategoriesDisplay();
    loadBorrowingTable();
    loadEbooksTable();
    loadAdminsTable();
    loadStatistics();
    loadNotifications();
    populateSelects();
    loadIssuedBooksTable();
}

// Show/Hide Sections
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show target section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active to clicked nav link
    event.target.classList.add('active');
    
    // Update page title
    const title = event.target.textContent.trim();
    document.getElementById('page-title').textContent = title || 'Dashboard';
    
    // Reload data for specific sections
    if (sectionId === 'manage-students') {
        loadStudentsTable();
    } else if (sectionId === 'manage-books') {
        loadBooksTable();
    } else if (sectionId === 'return-books') {
        loadBorrowingTable();
    } else if (sectionId === 'approve-ebooks') {
        loadEbooksTable();
    } else if (sectionId === 'manage-admins') {
        loadAdminsTable();
    } else if (sectionId === 'library-statistics') {
        updateStatistics();
    }
    
    return false;
}

// Load Statistics
function loadStatistics() {
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
    
    document.getElementById('stat-books').textContent = books.length;
    document.getElementById('stat-students').textContent = students.length;
    
    // Count today's borrowing
    const today = new Date().toDateString();
    const todayBorrows = borrowing.filter(b => {
        const borrowDate = new Date(b.issuedDate).toDateString();
        return borrowDate === today;
    }).length;
    document.getElementById('stat-today').textContent = todayBorrows;
    
    // Count pending returns
    const pending = borrowing.filter(b => !b.returnedDate).length;
    document.getElementById('stat-pending').textContent = pending;
}

// Update detailed statistics
function updateStatistics() {
    const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
    const today = new Date();
    
    let todayCount = 0, weekCount = 0, monthCount = 0, yearCount = 0;
    
    borrowing.forEach(b => {
        const borrowDate = new Date(b.issuedDate);
        
        // Today
        if (borrowDate.toDateString() === today.toDateString()) {
            todayCount++;
        }
        
        // This week
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (borrowDate >= weekAgo) {
            weekCount++;
        }
        
        // This month
        if (borrowDate.getMonth() === today.getMonth() && 
            borrowDate.getFullYear() === today.getFullYear()) {
            monthCount++;
        }
        
        // This year
        if (borrowDate.getFullYear() === today.getFullYear()) {
            yearCount++;
        }
    });
    
    document.getElementById('stats-today-borrow').textContent = todayCount;
    document.getElementById('stats-week-borrow').textContent = weekCount;
    document.getElementById('stats-month-borrow').textContent = monthCount;
    document.getElementById('stats-year-borrow').textContent = yearCount;
}

// Load Students Table
function loadStudentsTable() {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
    const tbody = document.querySelector('#students-table tbody');
    tbody.innerHTML = '';
    
    students.forEach(student => {
        const borrowed = borrowing.filter(b => b.studentId === student.id && !b.returnedDate).length;
        const row = `
            <tr>
                <td>${student.studentId}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${borrowed}</td>
                <td>${formatDate(student.createdAt)}</td>
                <td>
                    <button class="btn btn-small btn-primary" onclick="editStudent('${student.id}')">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteStudent('${student.id}')">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Load Books Table
function loadBooksTable() {
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const tbody = document.querySelector('#books-table tbody');
    tbody.innerHTML = '';
    
    books.forEach(book => {
        const row = `
            <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.category}</td>
                <td>${book.isbn}</td>
                <td>${book.quantity}</td>
                <td>${book.available}</td>
                <td>
                    <button class="btn btn-small btn-primary" onclick="editBook('${book.id}')">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteBook('${book.id}')">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Load Categories Display
function loadCategoriesDisplay() {
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const categories = [...new Set(books.map(b => b.category))];
    const grid = document.getElementById('categories-grid');
    grid.innerHTML = '';
    
    categories.forEach(category => {
        const count = books.filter(b => b.category === category).length;
        const card = `
            <div class="category-item">
                <h4>${category}</h4>
                <p>${count} books</p>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// Load Borrowing Table
function loadBorrowingTable() {
    const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const tbody = document.querySelector('#borrowed-table tbody');
    tbody.innerHTML = '';
    
    borrowing.forEach(borrow => {
        const student = students.find(s => s.id === borrow.studentId);
        const book = books.find(b => b.id === borrow.bookId);
        const status = borrow.returnedDate ? 'Returned' : 'Borrowed';
        const statusClass = borrow.returnedDate ? 'success' : 'warning';
        
        const row = `
            <tr>
                <td>${student ? student.name : 'Unknown'}</td>
                <td>${book ? book.title : 'Unknown'}</td>
                <td>${formatDate(borrow.issuedDate)}</td>
                <td>${formatDate(borrow.dueDate)}</td>
                <td><span class="badge badge-${statusClass}">${status}</span></td>
                <td>
                    ${!borrow.returnedDate ? 
                        `<button class="btn btn-small btn-success" onclick="returnBook('${borrow.id}')">Mark Returned</button>` 
                        : ''}
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Load E-Books Table
function loadEbooksTable() {
    const ebooks = JSON.parse(localStorage.getItem('ebooks') || '[]');
    const tbody = document.querySelector('#ebooks-table tbody');
    tbody.innerHTML = '';
    
    ebooks.forEach(ebook => {
        const row = `
            <tr>
                <td>${ebook.title}</td>
                <td>${ebook.author}</td>
                <td>${ebook.category}</td>
                <td><span class="badge badge-${ebook.status === 'approved' ? 'success' : 'warning'}">${ebook.status}</span></td>
                <td>
                    ${ebook.status !== 'approved' ? 
                        `<button class="btn btn-small btn-success" onclick="approveEbook('${ebook.id}')">Approve</button>` 
                        : ''}
                    <button class="btn btn-small btn-danger" onclick="deleteEbook('${ebook.id}')">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Load Admins Table
function loadAdminsTable() {
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    const tbody = document.querySelector('#admins-table tbody');
    tbody.innerHTML = '';
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    admins.forEach(admin => {
        // Only super admin can manage other admins
        const canDelete = currentUser.role === 'super_admin' && currentUser.id !== admin.id;
        
        const row = `
            <tr>
                <td>${admin.name}</td>
                <td>${admin.email}</td>
                <td>${capitalizeRole(admin.role)}</td>
                <td>${formatDate(admin.createdAt)}</td>
                <td>
                    ${canDelete ? `<button class="btn btn-small btn-danger" onclick="deleteAdmin('${admin.id}')">Delete</button>` : 'N/A'}
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Load Notifications
function loadNotifications() {
    const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const container = document.getElementById('notifications-list');
    container.innerHTML = '';
    
    // Get overdue books
    const today = new Date();
    const overdue = borrowing.filter(b => {
        const dueDate = new Date(b.dueDate);
        return dueDate < today && !b.returnedDate;
    });
    
    if (overdue.length === 0) {
        container.innerHTML = '<p class="text-center">No pending notifications</p>';
        return;
    }
    
    overdue.forEach(borrow => {
        const student = students.find(s => s.id === borrow.studentId);
        const book = books.find(b => b.id === borrow.bookId);
        const daysOverdue = Math.floor((today - new Date(borrow.dueDate)) / (1000 * 60 * 60 * 24));
        
        const notification = `
            <div class="notification-item">
                <div>
                    <p><strong>${student ? student.name : 'Unknown'}</strong> has overdue book</p>
                    <p>${book ? book.title : 'Unknown'} - <span style="color: var(--danger-color);">${daysOverdue} days overdue</span></p>
                </div>
                <button class="btn btn-small btn-primary" onclick="sendReminder('${borrow.studentId}')">Send Reminder</button>
            </div>
        `;
        container.innerHTML += notification;
    });
}

// Populate Select Dropdowns
function populateSelects() {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    
    // Populate student select
    const studentSelect = document.getElementById('issue-student');
    studentSelect.innerHTML = '<option value="">Choose a student</option>';
    students.forEach(student => {
        studentSelect.innerHTML += `<option value="${student.id}">${student.name}</option>`;
    });
    
    // Populate book select
    const bookSelect = document.getElementById('issue-book');
    bookSelect.innerHTML = '<option value="">Choose a book</option>';
    books.forEach(book => {
        bookSelect.innerHTML += `<option value="${book.id}">${book.title}</option>`;
    });
}

// Filter student dropdown
function filterStudentDropdown() {
    const searchInput = document.getElementById('student-search').value.toLowerCase();
    const studentSelect = document.getElementById('issue-student');
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    
    studentSelect.innerHTML = '<option value="">Choose a student</option>';
    
    students.forEach(student => {
        if (student.name.toLowerCase().includes(searchInput) || 
            student.email.toLowerCase().includes(searchInput)) {
            studentSelect.innerHTML += `<option value="${student.id}" data-name="${student.name}">${student.name} (${student.email})</option>`;
        }
    });
}

// Filter book dropdown
function filterBookDropdown() {
    const searchInput = document.getElementById('book-search').value.toLowerCase();
    const bookSelect = document.getElementById('issue-book');
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    
    bookSelect.innerHTML = '<option value="">Choose a book</option>';
    
    books.forEach(book => {
        if (book.title.toLowerCase().includes(searchInput) || 
            (book.isbn && book.isbn.toLowerCase().includes(searchInput))) {
            const availability = book.available > 0 ? `(${book.available} available)` : '(Not available)';
            bookSelect.innerHTML += `<option value="${book.id}" data-available="${book.available}">${book.title} ${availability}</option>`;
        }
    });
}

// Show book information
function showBookInfo() {
    const bookId = document.getElementById('issue-book').value;
    const bookSelect = document.getElementById('issue-book');
    const bookInfoDiv = document.getElementById('book-info');
    
    if (!bookId) {
        bookInfoDiv.style.display = 'none';
        return;
    }
    
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const book = books.find(b => b.id === bookId);
    
    if (book) {
        const availability = book.available > 0 ? `✓ Available (${book.available} copies)` : '✗ Not Available';
        const availabilityColor = book.available > 0 ? '#27ae60' : '#e74c3c';
        
        bookInfoDiv.innerHTML = `
            <div style="padding: 10px; background-color: #f8f9fa; border-left: 4px solid ${availabilityColor}; border-radius: 4px;">
                <strong>Author:</strong> ${book.author || 'N/A'}<br>
                <strong>ISBN:</strong> ${book.isbn || 'N/A'}<br>
                <strong>Category:</strong> ${book.category || 'N/A'}<br>
                <strong>Status:</strong> <span style="color: ${availabilityColor}; font-weight: bold;">${availability}</span>
            </div>
        `;
        bookInfoDiv.style.display = 'block';
        
        // Update quantity input max value
        const quantityInput = document.getElementById('issue-quantity');
        quantityInput.max = Math.min(book.available, 10);
    }
}

// Show student information
function showStudentInfo() {
    const studentId = document.getElementById('issue-student').value;
    const studentInfoDiv = document.getElementById('student-info');
    
    if (!studentId) {
        studentInfoDiv.style.display = 'none';
        return;
    }
    
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find(s => s.id === studentId);
    
    if (student) {
        const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
        const activeBooks = borrowing.filter(b => b.studentId === studentId && !b.returnedDate).length;
        
        studentInfoDiv.innerHTML = `
            <div style="padding: 10px; background-color: #f8f9fa; border-left: 4px solid #3498db; border-radius: 4px;">
                <strong>Email:</strong> ${student.email}<br>
                <strong>ID:</strong> ${student.studentId}<br>
                <strong>Currently Borrowing:</strong> ${activeBooks} books
            </div>
        `;
        studentInfoDiv.style.display = 'block';
    }
}

// Clear issue form
function clearIssueForm() {
    document.getElementById('issue-form').reset();
    document.getElementById('student-search').value = '';
    document.getElementById('book-search').value = '';
    document.getElementById('student-info').style.display = 'none';
    document.getElementById('book-info').style.display = 'none';
    setDefaultDates();
}

// Issue Book
function issueBook() {
    const studentId = document.getElementById('issue-student').value;
    const bookId = document.getElementById('issue-book').value;
    const issuedDate = document.getElementById('issue-date').value;
    const dueDate = document.getElementById('due-date').value;
    const quantity = parseInt(document.getElementById('issue-quantity').value) || 1;
    const notes = document.getElementById('issue-notes').value;
    
    if (!studentId || !bookId) {
        UIHelper.showError('Please select both student and book');
        return;
    }
    
    if (!issuedDate || !dueDate) {
        UIHelper.showError('Please select both issue and due dates');
        return;
    }
    
    if (new Date(dueDate) <= new Date(issuedDate)) {
        UIHelper.showError('Due date must be after issue date');
        return;
    }
    
    const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    
    const book = books.find(b => b.id === bookId);
    if (!book || book.available < quantity) {
        UIHelper.showError(`Not enough copies available. Only ${book?.available || 0} copies available.`);
        return;
    }
    
    // Add borrowing record(s)
    for (let i = 0; i < quantity; i++) {
        const record = {
            id: Date.now().toString() + '_' + i,
            studentId,
            bookId,
            issuedDate,
            dueDate,
            returnedDate: null,
            notes,
            quantity: 1
        };
        borrowing.push(record);
    }
    
    localStorage.setItem('borrowing', JSON.stringify(borrowing));
    
    // Update book availability
    book.available -= quantity;
    localStorage.setItem('books', JSON.stringify(books));
    
    UIHelper.showSuccess(`${quantity} copy(ies) of "${book.title}" issued successfully!`);
    logActivity('Issue Book', { bookId, studentId, quantity, notes });
    clearIssueForm();
    loadBorrowingTable();
    loadIssuedBooksTable();
    loadStatistics();
}

// Load issued books table
function loadIssuedBooksTable() {
    const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const tbody = document.querySelector('#issued-books-table tbody');
    
    if (!tbody) return;
    
    // Get the most recent 10 issued books
    const recentIssued = borrowing
        .filter(b => !b.returnedDate)
        .sort((a, b) => new Date(b.issuedDate) - new Date(a.issuedDate))
        .slice(0, 10);
    
    tbody.innerHTML = '';
    
    recentIssued.forEach(issue => {
        const student = students.find(s => s.id === issue.studentId);
        const book = books.find(b => b.id === issue.bookId);
        
        if (student && book) {
            const isOverdue = new Date() > new Date(issue.dueDate);
            const status = isOverdue ? 'Overdue' : 'Active';
            const statusClass = isOverdue ? 'danger' : 'success';
            
            tbody.innerHTML += `
                <tr>
                    <td>${student.name}</td>
                    <td>${book.title}</td>
                    <td>${new Date(issue.issuedDate).toLocaleDateString()}</td>
                    <td>${new Date(issue.dueDate).toLocaleDateString()}</td>
                    <td>${issue.quantity || 1}</td>
                    <td><span class="badge badge-${statusClass}">${status}</span></td>
                    <td>
                        <button class="btn btn-small btn-info" onclick="showIssueDetails('${issue.id}')">Details</button>
                    </td>
                </tr>
            `;
        }
    });
    
    if (recentIssued.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No active issues</td></tr>';
    }
}

// Show issue details
function showIssueDetails(issueId) {
    const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    
    const issue = borrowing.find(b => b.id === issueId);
    if (!issue) return;
    
    const student = students.find(s => s.id === issue.studentId);
    const book = books.find(b => b.id === issue.bookId);
    
    let detailsHtml = `
        <strong>Student:</strong> ${student?.name}<br>
        <strong>Book:</strong> ${book?.title}<br>
        <strong>Issued Date:</strong> ${new Date(issue.issuedDate).toLocaleDateString()}<br>
        <strong>Due Date:</strong> ${new Date(issue.dueDate).toLocaleDateString()}<br>
        <strong>Notes:</strong> ${issue.notes || 'N/A'}<br>
    `;
    
    UIHelper.showInfo(detailsHtml);
}

// Return Book
function returnBook(borrowId) {
    const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    
    const record = borrowing.find(b => b.id === borrowId);
    if (record) {
        record.returnedDate = new Date().toISOString();
        
        // Update book availability
        const book = books.find(b => b.id === record.bookId);
        if (book) {
            book.available++;
        }
        
        localStorage.setItem('borrowing', JSON.stringify(borrowing));
        localStorage.setItem('books', JSON.stringify(books));
        
        UIHelper.showSuccess('Book returned successfully!');
        logActivity('Return Book', { bookId: record.bookId, studentId: record.studentId });
        loadBorrowingTable();
        loadStatistics();
    }
}

// Reset Returned Books
function resetReturnedBooks() {
    if (confirm('Are you sure you want to reset all returned books? This cannot be undone.')) {
        const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
        const books = JSON.parse(localStorage.getItem('books') || '[]');
        
        // Update book availability
        borrowing.forEach(record => {
            if (record.returnedDate) {
                const book = books.find(b => b.id === record.bookId);
                if (book && book.available > 0) {
                    book.available--;
                }
            }
        });
        
        // Clear returned records
        const filtered = borrowing.filter(b => !b.returnedDate);
        localStorage.setItem('borrowing', JSON.stringify(filtered));
        localStorage.setItem('books', JSON.stringify(books));
        
        UIHelper.showSuccess('Returned books reset successfully!');
        logActivity('Reset Returned Books', {});
        loadBorrowingTable();
    }
}

// Publish E-Book
function publishEbook() {
    const title = document.getElementById('ebook-title').value;
    const author = document.getElementById('ebook-author').value;
    const category = document.getElementById('ebook-category').value;
    const file = document.getElementById('ebook-file').value;
    
    if (!title || !author || !category || !file) {
        showAlert('Please fill all fields', 'danger');
        return;
    }
    
    const ebooks = JSON.parse(localStorage.getItem('ebooks') || '[]');
    
    const ebook = {
        id: Date.now().toString(),
        title,
        author,
        category,
        status: 'pending',
        uploadDate: new Date().toISOString()
    };
    
    ebooks.push(ebook);
    localStorage.setItem('ebooks', JSON.stringify(ebooks));
    
    showAlert('E-Book published successfully! Pending approval.', 'success');
    document.getElementById('ebook-form').reset();
    loadEbooksTable();
}

// Approve E-Book
function approveEbook(ebookId) {
    const ebooks = JSON.parse(localStorage.getItem('ebooks') || '[]');
    const ebook = ebooks.find(e => e.id === ebookId);
    
    if (ebook) {
        ebook.status = 'approved';
        localStorage.setItem('ebooks', JSON.stringify(ebooks));
        showAlert('E-Book approved!', 'success');
        loadEbooksTable();
    }
}

// Delete E-Book
function deleteEbook(ebookId) {
    if (confirm('Delete this E-Book?')) {
        const ebooks = JSON.parse(localStorage.getItem('ebooks') || '[]');
        const filtered = ebooks.filter(e => e.id !== ebookId);
        localStorage.setItem('ebooks', JSON.stringify(filtered));
        showAlert('E-Book deleted!', 'success');
        loadEbooksTable();
    }
}

// Send Test Email
function sendTestEmail() {
    const email = document.getElementById('test-email').value;
    const subject = document.getElementById('test-subject').value;
    const message = document.getElementById('test-message').value;
    
    if (!email || !subject || !message) {
        showAlert('Please fill all fields', 'danger');
        return;
    }
    
    // Simulate email sending
    showAlert(`Test email sent to ${email}!`, 'success');
    document.getElementById('email-form').reset();
}

// Create Admin Account
function createAdminAccount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Only super admin can create accounts
    if (currentUser.role !== 'super_admin') {
        showAlert('Only Super Admin can create accounts!', 'danger');
        return;
    }
    
    const name = document.getElementById('new-admin-name').value;
    const email = document.getElementById('new-admin-email').value;
    const password = document.getElementById('new-admin-password').value;
    const role = document.getElementById('new-admin-role').value;
    
    if (!name || !email || !password || !role) {
        showAlert('Please fill all fields', 'danger');
        return;
    }
    
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    
    if (admins.find(a => a.email === email)) {
        showAlert('Email already exists', 'danger');
        return;
    }
    
    const newAdmin = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role,
        createdAt: new Date().toISOString(),
        profilePicture: 'https://via.placeholder.com/150?text=' + name.split(' ')[0]
    };
    
    admins.push(newAdmin);
    localStorage.setItem('admins', JSON.stringify(admins));
    
    showAlert('Admin account created successfully!', 'success');
    document.getElementById('create-admin-form').reset();
    loadAdminsTable();
}

// Delete Admin
function deleteAdmin(adminId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser.role !== 'super_admin') {
        showAlert('Only Super Admin can delete accounts!', 'danger');
        return;
    }
    
    if (confirm('Delete this admin account?')) {
        const admins = JSON.parse(localStorage.getItem('admins') || '[]');
        const filtered = admins.filter(a => a.id !== adminId);
        localStorage.setItem('admins', JSON.stringify(filtered));
        showAlert('Admin account deleted!', 'success');
        loadAdminsTable();
    }
}

// Update Profile
// Load profile form with current user data
function loadProfileForm() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    document.getElementById('profile-name').value = currentUser.name || '';
    document.getElementById('profile-email').value = currentUser.email || '';
    
    // Display profile picture
    const profileImg = document.querySelector('[src*="avatar"]') || document.querySelector('img[alt="profile"]');
    if (profileImg && currentUser.profilePicture) {
        profileImg.src = currentUser.profilePicture;
    }
}

function updateProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const name = document.getElementById('profile-name').value;
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    
    if (!name) {
        UIHelper.showError('Name is required');
        return;
    }
    
    if (!currentPassword) {
        UIHelper.showError('Current password is required');
        return;
    }
    
    // Verify current password
    let users = JSON.parse(localStorage.getItem('admins') || '[]');
    const user = users.find(u => u.id === currentUser.id);
    
    if (!user) {
        UIHelper.showError('User not found');
        return;
    }
    
    if (user.password !== currentPassword) {
        UIHelper.showError('Incorrect current password');
        return;
    }
    
    // Validate new password if provided
    if (newPassword && newPassword.length < 6) {
        UIHelper.showError('New password must be at least 6 characters');
        return;
    }
    
    // Update user object
    user.name = name;
    if (newPassword) {
        user.password = newPassword;
    }
    
    // Use uploaded picture if available, otherwise keep current
    if (signupProfilePictureData) {
        user.profilePicture = signupProfilePictureData;
    }
    
    // Save updated user to admins array
    localStorage.setItem('admins', JSON.stringify(users));
    
    // Update and save current user session
    currentUser.name = user.name;
    currentUser.password = user.password;
    if (user.profilePicture) {
        currentUser.profilePicture = user.profilePicture;
    }
    currentUser.sessionUpdated = new Date().toISOString();
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Log activity
    logActivity('Profile Updated', { user: currentUser.name, email: currentUser.email });
    
    UIHelper.showSuccess('Profile updated successfully!');
    document.getElementById('profile-form').reset();
    document.getElementById('current-password').value = '';
    initializeUser();
}

// Delete Student
function deleteStudent(studentId) {
    if (confirm('Delete this student?')) {
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const filtered = students.filter(s => s.id !== studentId);
        localStorage.setItem('students', JSON.stringify(filtered));
        showAlert('Student deleted!', 'success');
        loadStudentsTable();
    }
}

// Delete Book
function deleteBook(bookId) {
    if (confirm('Delete this book?')) {
        const books = JSON.parse(localStorage.getItem('books') || '[]');
        const filtered = books.filter(b => b.id !== bookId);
        localStorage.setItem('books', JSON.stringify(filtered));
        showAlert('Book deleted!', 'success');
        loadBooksTable();
    }
}

// Send Reminder
function sendReminder(studentId) {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find(s => s.id === studentId);
    
    if (student) {
        showAlert(`Reminder sent to ${student.email}!`, 'success');
    }
}

// Edit Student (placeholder)
function editStudent(studentId) {
    showAlert('Edit feature coming soon!', 'warning');
}

// Edit Book (placeholder)
function editBook(bookId) {
    showAlert('Edit feature coming soon!', 'warning');
}

// Show Add Student Form
function showAddStudentForm() {
    document.getElementById('studentModalTitle').textContent = 'Add Student';
    document.getElementById('studentForm').reset();
    UIHelper.clearFormErrors('studentForm');
    document.getElementById('studentFormModal').style.display = 'block';
}

// Close Student Modal
function closeStudentModal() {
    document.getElementById('studentFormModal').style.display = 'none';
}

// Save Student
function saveStudent() {
    const name = document.getElementById('form-student-name').value;
    const email = document.getElementById('form-student-email').value;
    const studentId = document.getElementById('form-student-id').value;
    const password = document.getElementById('form-student-password').value;
    const phone = document.getElementById('form-student-phone').value;

    // Validation
    UIHelper.clearFormErrors('studentForm');
    let hasErrors = false;

    if (!FormValidator.isValidName(name)) {
        UIHelper.showFieldError('form-student-name', 'Name must be at least 2 characters');
        hasErrors = true;
    }
    if (!FormValidator.isEmail(email)) {
        UIHelper.showFieldError('form-student-email', 'Invalid email address');
        hasErrors = true;
    }
    if (!FormValidator.isValidStudentId(studentId)) {
        UIHelper.showFieldError('form-student-id', 'Student ID must be at least 3 characters');
        hasErrors = true;
    }
    if (!FormValidator.isStrongPassword(password)) {
        UIHelper.showFieldError('form-student-password', 'Password must be at least 6 characters');
        hasErrors = true;
    }

    if (hasErrors) return;

    const students = JSON.parse(localStorage.getItem('students') || '[]');
    if (students.find(s => s.email === email)) {
        UIHelper.showFieldError('form-student-email', 'Email already exists');
        return;
    }

    const newStudent = {
        id: Date.now().toString(),
        name,
        email,
        studentId,
        password,
        phone: phone || 'N/A',
        createdAt: new Date().toISOString(),
        profilePicture: 'https://via.placeholder.com/150?text=' + name.split(' ')[0]
    };

    students.push(newStudent);
    localStorage.setItem('students', JSON.stringify(students));

    UIHelper.showSuccess('Student added successfully!');
    closeStudentModal();
    loadStudentsTable();
    populateSelects();
}

// Edit Student
function editStudent(studentId) {
    const student = DataManager.getStudentById(studentId);
    if (!student) {
        UIHelper.showError('Student not found');
        return;
    }

    document.getElementById('studentModalTitle').textContent = 'Edit Student';
    document.getElementById('form-student-name').value = student.name;
    document.getElementById('form-student-email').value = student.email;
    document.getElementById('form-student-id').value = student.studentId;
    document.getElementById('form-student-password').value = student.password;
    document.getElementById('form-student-phone').value = student.phone || '';
    
    // Change button functionality temporarily
    const saveBtn = document.querySelector('#studentForm .btn-success');
    saveBtn.onclick = () => updateStudentData(studentId);
    
    document.getElementById('studentFormModal').style.display = 'block';
}

// Update Student Data
function updateStudentData(studentId) {
    const name = document.getElementById('form-student-name').value;
    const email = document.getElementById('form-student-email').value;
    const phone = document.getElementById('form-student-phone').value;

    UIHelper.clearFormErrors('studentForm');

    if (!FormValidator.isValidName(name)) {
        UIHelper.showFieldError('form-student-name', 'Name must be at least 2 characters');
        return;
    }

    DataManager.updateStudent(studentId, { name, email, phone });
    UIHelper.showSuccess('Student updated successfully!');
    closeStudentModal();
    loadStudentsTable();
}

// Show Add Book Form
function showAddBookForm() {
    document.getElementById('bookModalTitle').textContent = 'Add Book';
    document.getElementById('bookForm').reset();
    UIHelper.clearFormErrors('bookForm');
    document.getElementById('bookFormModal').style.display = 'block';
}

// Close Book Modal
function closeBookModal() {
    document.getElementById('bookFormModal').style.display = 'none';
}

// Save Book
function saveBook() {
    const title = document.getElementById('form-book-title').value;
    const author = document.getElementById('form-book-author').value;
    const isbn = document.getElementById('form-book-isbn').value;
    const category = document.getElementById('form-book-category').value;
    const quantity = parseInt(document.getElementById('form-book-quantity').value);
    const coverUrl = document.getElementById('form-book-cover').value;

    UIHelper.clearFormErrors('bookForm');
    let hasErrors = false;

    if (!FormValidator.isValidName(title)) {
        UIHelper.showFieldError('form-book-title', 'Title must be at least 2 characters');
        hasErrors = true;
    }
    if (!FormValidator.isValidName(author)) {
        UIHelper.showFieldError('form-book-author', 'Author must be at least 2 characters');
        hasErrors = true;
    }
    if (!FormValidator.isValidISBN(isbn)) {
        UIHelper.showFieldError('form-book-isbn', 'Invalid ISBN format');
        hasErrors = true;
    }
    if (!FormValidator.isValidName(category)) {
        UIHelper.showFieldError('form-book-category', 'Category must be at least 2 characters');
        hasErrors = true;
    }
    if (quantity < 1) {
        UIHelper.showFieldError('form-book-quantity', 'Quantity must be at least 1');
        hasErrors = true;
    }

    if (hasErrors) return;

    const newBook = {
        id: Date.now().toString(),
        title,
        author,
        isbn,
        category,
        quantity,
        available: quantity,
        coverUrl: coverUrl || 'https://via.placeholder.com/150?text=' + title.substring(0, 10),
        createdAt: new Date().toISOString()
    };

    const books = JSON.parse(localStorage.getItem('books') || '[]');
    books.push(newBook);
    localStorage.setItem('books', JSON.stringify(books));

    UIHelper.showSuccess('Book added successfully!');
    closeBookModal();
    loadBooksTable();
    loadCategoriesDisplay();
    populateSelects();
}

// Edit Book
function editBook(bookId) {
    const book = DataManager.getBookById(bookId);
    if (!book) {
        UIHelper.showError('Book not found');
        return;
    }

    document.getElementById('bookModalTitle').textContent = 'Edit Book';
    document.getElementById('form-book-title').value = book.title;
    document.getElementById('form-book-author').value = book.author;
    document.getElementById('form-book-isbn').value = book.isbn;
    document.getElementById('form-book-category').value = book.category;
    document.getElementById('form-book-quantity').value = book.quantity;
    document.getElementById('form-book-cover').value = book.coverUrl;

    const saveBtn = document.querySelector('#bookForm .btn-success');
    saveBtn.onclick = () => updateBookData(bookId);
    
    document.getElementById('bookFormModal').style.display = 'block';
}

// Update Book Data
function updateBookData(bookId) {
    const title = document.getElementById('form-book-title').value;
    const author = document.getElementById('form-book-author').value;
    const category = document.getElementById('form-book-category').value;
    const quantity = parseInt(document.getElementById('form-book-quantity').value);

    UIHelper.clearFormErrors('bookForm');

    if (!FormValidator.isValidName(title)) {
        UIHelper.showFieldError('form-book-title', 'Title must be at least 2 characters');
        return;
    }

    const book = DataManager.getBookById(bookId);
    const quantityDifference = quantity - book.quantity;

    DataManager.updateBook(bookId, { 
        title, 
        author, 
        category, 
        quantity,
        available: book.available + quantityDifference
    });

    UIHelper.showSuccess('Book updated successfully!');
    closeBookModal();
    loadBooksTable();
}

// Show Add Category Form
function showAddCategoryForm() {
    document.getElementById('categoryForm').reset();
    UIHelper.clearFormErrors('categoryForm');
    document.getElementById('categoryFormModal').style.display = 'block';
}

// Close Category Modal
function closeCategoryModal() {
    document.getElementById('categoryFormModal').style.display = 'none';
}

// Save Category
function saveCategory() {
    const name = document.getElementById('form-category-name').value;
    const description = document.getElementById('form-category-description').value;

    UIHelper.clearFormErrors('categoryForm');

    if (!FormValidator.isValidName(name)) {
        UIHelper.showFieldError('form-category-name', 'Category name must be at least 2 characters');
        return;
    }

    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    
    if (categories.find(c => c.name.toLowerCase() === name.toLowerCase())) {
        UIHelper.showFieldError('form-category-name', 'Category already exists');
        return;
    }

    const newCategory = {
        id: Date.now().toString(),
        name,
        description,
        createdAt: new Date().toISOString()
    };

    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));

    UIHelper.showSuccess('Category added successfully!');
    closeCategoryModal();
    loadCategoriesDisplay();
}

// Toggle Sidebar
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

// Helper Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function capitalizeRole(role) {
    return role.replace(/_/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function closeFormModal() {
    document.getElementById('formModal').style.display = 'none';
}

// Handle Admin Profile Picture Upload
function handleAdminProfilePictureUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        UIHelper.showError('File size must be less than 5MB');
        return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        UIHelper.showError('Please upload an image file');
        return;
    }

    const reader = new FileReader();
    const progressDiv = document.getElementById('admin-upload-progress');
    const progressStatus = document.getElementById('admin-upload-status');

    reader.onloadstart = () => {
        progressDiv.style.display = 'block';
        progressStatus.textContent = 'Processing image...';
    };

    reader.onload = (e) => {
        try {
            const imageData = e.target.result;
            
            // Store in localStorage
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            currentUser.profilePicture = imageData;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update admins array
            const admins = JSON.parse(localStorage.getItem('admins') || '[]');
            const adminIndex = admins.findIndex(a => a.email === currentUser.email);
            if (adminIndex !== -1) {
                admins[adminIndex].profilePicture = imageData;
                localStorage.setItem('admins', JSON.stringify(admins));
            }
            
            // Update UI
            document.getElementById('header-avatar').src = imageData;
            
            progressDiv.style.display = 'none';
            UIHelper.showSuccess('Profile picture uploaded successfully!');
            logActivity('UPLOAD_PROFILE_PIC', 'Admin uploaded new profile picture');
            
            // Reset file input
            event.target.value = '';
        } catch (error) {
            progressDiv.style.display = 'none';
            UIHelper.showError('Error processing image: ' + error.message);
        }
    };

    reader.onerror = () => {
        progressDiv.style.display = 'none';
        UIHelper.showError('Error reading file');
    };

    reader.readAsDataURL(file);
}

