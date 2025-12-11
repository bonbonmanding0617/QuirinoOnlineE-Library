// Student Dashboard JavaScript

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializeStudentSession();
    initializeStudentUI();
    loadStudentDashboard();
    
    // Load profile form
    setTimeout(loadStudentProfileForm, 500);
});

// Initialize student session
function initializeStudentSession() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser.sessionStartTime) {
        currentUser.sessionStartTime = new Date().toISOString();
    }
    currentUser.lastActivity = new Date().toISOString();
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Initialize Student UI
function initializeStudentUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Update all user info
    const userElements = {
        'user-avatar': 'profilePicture',
        'user-name': 'name',
        'user-email': 'email',
        'welcome-name': 'name',
        'profile-avatar': 'profilePicture',
        'profile-name': 'name',
        'profile-email': 'email',
        'edit-name': 'name'
    };
    
    Object.keys(userElements).forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            const key = userElements[elementId];
            if (elementId.includes('avatar') || elementId.includes('picture')) {
                element.src = currentUser[key];
            } else {
                element.textContent = currentUser[key];
            }
        }
    });
    
    // Set student ID and join date
    document.getElementById('profile-id').textContent = `Student ID: ${currentUser.studentId}`;
    document.getElementById('profile-joined').textContent = `Joined: ${formatDate(currentUser.createdAt)}`;
    
    // Load category filter
    loadCategoryFilter();
}

// Load Student Dashboard
function loadStudentDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    
    const studentBorrows = borrowing.filter(b => b.studentId === currentUser.id);
    const borrowed = studentBorrows.filter(b => !b.returnedDate);
    const returned = studentBorrows.filter(b => b.returnedDate);
    
    // Update statistics
    document.getElementById('stat-borrowed').textContent = borrowed.length;
    document.getElementById('stat-returned').textContent = returned.length;
    
    // Calculate overdue
    const today = new Date();
    const overdue = borrowed.filter(b => new Date(b.dueDate) < today).length;
    document.getElementById('stat-overdue').textContent = overdue;
    
    // Wishlist (placeholder)
    document.getElementById('stat-wishlist').textContent = '0';
    
    // Load activity
    loadActivityList(currentUser.id);
    
    // Load books
    loadBooksGrid(books);
}

// Load Activity List
function loadActivityList(studentId) {
    const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const container = document.getElementById('activity-list');
    container.innerHTML = '';
    
    const studentBorrows = borrowing
        .filter(b => b.studentId === studentId)
        .sort((a, b) => new Date(b.issuedDate) - new Date(a.issuedDate))
        .slice(0, 5);
    
    if (studentBorrows.length === 0) {
        container.innerHTML = '<p class="text-center">No activity yet</p>';
        return;
    }
    
    studentBorrows.forEach(borrow => {
        const book = books.find(b => b.id === borrow.bookId);
        const activity = `
            <div class="activity-item ${borrow.returnedDate ? 'return' : ''}">
                <div class="activity-item-text">
                    <strong>${borrow.returnedDate ? '✅ Returned' : '📚 Borrowed'}</strong>
                    <p>${book ? book.title : 'Unknown Book'}</p>
                    <span class="activity-date">${formatDate(borrow.issuedDate)}</span>
                </div>
            </div>
        `;
        container.innerHTML += activity;
    });
}

// Load Books Grid
function loadBooksGrid(books = null) {
    if (!books) {
        books = JSON.parse(localStorage.getItem('books') || '[]');
    }
    
    const grid = document.getElementById('books-grid');
    grid.innerHTML = '';
    
    books.forEach(book => {
        const card = `
            <div class="book-card">
                <img src="${book.coverUrl}" alt="${book.title}" class="book-cover">
                <div class="book-info">
                    <p class="book-title">${book.title}</p>
                    <p class="book-author">by ${book.author}</p>
                    <span class="book-category">${book.category}</span>
                    <p class="book-availability ${book.available <= 0 ? 'unavailable' : ''}">
                        ${book.available > 0 ? `Available: ${book.available}` : 'Not Available'}
                    </p>
                    <button class="book-action" 
                        onclick="requestBook('${book.id}')" 
                        ${book.available <= 0 ? 'disabled' : ''}>
                        ${book.available > 0 ? 'Request Book' : 'Unavailable'}
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// Load Category Filter
function loadCategoryFilter() {
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const categories = [...new Set(books.map(b => b.category))];
    const select = document.getElementById('filter-category');
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}

// Load E-Books
function loadEbooks() {
    const ebooks = JSON.parse(localStorage.getItem('ebooks') || '[]');
    const approved = ebooks.filter(e => e.status === 'approved');
    const grid = document.getElementById('ebooks-grid');
    grid.innerHTML = '';
    
    if (approved.length === 0) {
        grid.innerHTML = '<p class="text-center">No e-books available yet</p>';
        return;
    }
    
    approved.forEach(ebook => {
        const card = `
            <div class="ebook-card">
                <p class="ebook-title">${ebook.title}</p>
                <p class="ebook-author">by ${ebook.author}</p>
                <span class="ebook-category">${ebook.category}</span>
                <span class="ebook-status">Available</span>
                <button class="ebook-action" onclick="downloadEbook('${ebook.id}')">
                    📥 Read Now
                </button>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// Load Borrowed Books Table
function loadBorrowedBooks() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const tbody = document.querySelector('#borrowed-table tbody');
    tbody.innerHTML = '';
    
    const studentBorrows = borrowing.filter(b => b.studentId === currentUser.id && !b.returnedDate);
    
    if (studentBorrows.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No borrowed books</td></tr>';
        return;
    }
    
    studentBorrows.forEach(borrow => {
        const book = books.find(b => b.id === borrow.bookId);
        const dueDate = new Date(borrow.dueDate);
        const today = new Date();
        const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        const statusClass = daysLeft < 0 ? 'overdue' : daysLeft <= 3 ? 'warning' : 'success';
        const statusText = daysLeft < 0 ? 'Overdue' : `${daysLeft} days`;
        
        const row = `
            <tr>
                <td>${book ? book.title : 'Unknown'}</td>
                <td>${book ? book.author : 'Unknown'}</td>
                <td>${formatDate(borrow.issuedDate)}</td>
                <td>${formatDate(borrow.dueDate)}</td>
                <td><span class="badge badge-${statusClass}">Borrowed</span></td>
                <td class="${statusClass === 'overdue' ? 'text-danger' : ''}">${statusText}</td>
                <td><button class="btn btn-small btn-primary" onclick="renewBook('${borrow.id}')">Renew</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Show Student Section
function showStudentSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.student-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all nav links
    document.querySelectorAll('.student-nav .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show target section
    document.getElementById(sectionId).classList.add('active');
    event.target.closest('.nav-link').classList.add('active');
    
    // Load data specific to section
    if (sectionId === 'browse-books') {
        loadBooksGrid();
    } else if (sectionId === 'borrowed-books') {
        loadBorrowedBooks();
    } else if (sectionId === 'ebooks') {
        loadEbooks();
    }
    
    return false;
}

// Filter Books
function filterBooks() {
    const searchTerm = document.getElementById('search-books').value.toLowerCase();
    const selectedCategory = document.getElementById('filter-category').value;
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    
    let filtered = books.filter(book => {
        const matchSearch = book.title.toLowerCase().includes(searchTerm) || 
                          book.author.toLowerCase().includes(searchTerm);
        const matchCategory = !selectedCategory || book.category === selectedCategory;
        return matchSearch && matchCategory;
    });
    
    loadBooksGrid(filtered);
}

// Request Book
function requestBook(bookId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
    
    const book = books.find(b => b.id === bookId);
    
    if (!book || book.available <= 0) {
        showAlert('Book is not available', 'danger');
        return;
    }
    
    // Create borrowing record
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days
    
    const record = {
        id: Date.now().toString(),
        studentId: currentUser.id,
        bookId,
        issuedDate: new Date().toISOString(),
        dueDate: dueDate.toISOString(),
        returnedDate: null
    };
    
    borrowing.push(record);
    localStorage.setItem('borrowing', JSON.stringify(borrowing));
    
    // Update book availability
    book.available--;
    localStorage.setItem('books', JSON.stringify(books));
    
    showAlert(`${book.title} has been issued to you!`, 'success');
    loadBooksGrid();
    loadActivityList(currentUser.id);
    loadStudentDashboard();
}

// Download E-Book
function downloadEbook(ebookId) {
    showAlert('Downloading e-book...', 'success');
}

// Update Student Profile
// Load student profile form
function loadStudentProfileForm() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Populate form fields
    document.getElementById('edit-name').value = currentUser.name || '';
    
    // Display profile picture
    const profileImg = document.getElementById('profile-avatar');
    if (profileImg && currentUser.profilePicture) {
        profileImg.src = currentUser.profilePicture;
    }
    
    // Load profile info
    document.getElementById('profile-name').textContent = currentUser.name || 'Student';
    document.getElementById('profile-email').textContent = currentUser.email || '';
    document.getElementById('profile-id').textContent = `Student ID: ${currentUser.studentId || 'N/A'}`;
    
    const joinedDate = new Date(currentUser.createdAt);
    document.getElementById('profile-joined').textContent = `Joined: ${joinedDate.toLocaleDateString()}`;
}

function updateStudentProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const name = document.getElementById('edit-name').value;
    const currentPassword = document.getElementById('edit-current-password').value;
    const newPassword = document.getElementById('edit-new-password').value;
    
    if (!name) {
        showAlert('Name is required', 'danger');
        return;
    }
    
    if (!currentPassword) {
        showAlert('Current password is required', 'danger');
        return;
    }
    
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find(s => s.id === currentUser.id);
    
    if (!student) {
        showAlert('Student profile not found', 'danger');
        return;
    }
    
    if (student.password !== currentPassword) {
        showAlert('Incorrect current password', 'danger');
        return;
    }
    
    // Validate new password if provided
    if (newPassword && newPassword.length < 6) {
        showAlert('New password must be at least 6 characters', 'danger');
        return;
    }
    
    // Update student record
    student.name = name;
    if (newPassword) {
        student.password = newPassword;
    }
    
    // Use uploaded picture if available
    if (signupProfilePictureData) {
        student.profilePicture = signupProfilePictureData;
    }
    
    // Save to students array
    localStorage.setItem('students', JSON.stringify(students));
    
    // Update and save current user session
    currentUser.name = student.name;
    currentUser.password = student.password;
    if (student.profilePicture) {
        currentUser.profilePicture = student.profilePicture;
    }
    currentUser.sessionUpdated = new Date().toISOString();
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Log activity
    logActivity('Profile Updated', { user: currentUser.name, email: currentUser.email });
    
    showAlert('Profile updated successfully!', 'success');
    document.getElementById('student-profile-form').reset();
    document.getElementById('edit-current-password').value = '';
    loadStudentProfileForm();
    initializeStudentUI();
}

// Enhanced Student Dashboard Functions

// Export student data
function exportMyBooks() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
    const books = DataManager.getBooks();
    
    const studentBorrows = borrowing.filter(b => b.studentId === currentUser.id);
    const exportData = studentBorrows.map(b => ({
        'Book Title': books.find(k => k.id === b.bookId)?.title || 'Unknown',
        'Author': books.find(k => k.id === b.bookId)?.author || 'Unknown',
        'Issue Date': UIHelper.formatDate(b.issuedDate),
        'Due Date': UIHelper.formatDate(b.dueDate),
        'Status': b.returnedDate ? 'Returned' : 'Borrowed'
    }));
    
    DataExport.toCSV(exportData, 'my_borrowed_books.csv');
}

// Add book to wishlist
function addToWishlist(bookId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (wishlist.find(w => w.studentId === currentUser.id && w.bookId === bookId)) {
        UIHelper.showWarning('Already in your wishlist');
        return;
    }
    
    wishlist.push({
        studentId: currentUser.id,
        bookId,
        addedAt: new Date().toISOString()
    });
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    UIHelper.showSuccess('Added to wishlist!');
}

// Get wishlist count
function getWishlistCount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.filter(w => w.studentId === currentUser.id).length;
}

// Rate book
function rateBook(bookId, rating) {
    if (rating < 1 || rating > 5) {
        UIHelper.showError('Rating must be between 1 and 5');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const ratings = JSON.parse(localStorage.getItem('bookRatings') || '[]');
    
    const existingRating = ratings.find(r => r.studentId === currentUser.id && r.bookId === bookId);
    
    if (existingRating) {
        existingRating.rating = rating;
        existingRating.date = new Date().toISOString();
    } else {
        ratings.push({
            studentId: currentUser.id,
            bookId,
            rating,
            date: new Date().toISOString()
        });
    }
    
    localStorage.setItem('bookRatings', JSON.stringify(ratings));
    UIHelper.showSuccess(`You rated this book ${rating} stars!`);
}

// Get average book rating
function getBookRating(bookId) {
    const ratings = JSON.parse(localStorage.getItem('bookRatings') || '[]');
    const bookRatings = ratings.filter(r => r.bookId === bookId);
    
    if (bookRatings.length === 0) return 0;
    
    const sum = bookRatings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / bookRatings.length).toFixed(1);
}

// Renew book
function renewBook(borrowId) {
    const borrowing = JSON.parse(localStorage.getItem('borrowing') || '[]');
    const record = borrowing.find(b => b.id === borrowId);
    
    if (!record) {
        UIHelper.showError('Book record not found');
        return;
    }
    
    // Extend due date by 14 days
    const newDueDate = new Date(record.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 14);
    
    record.dueDate = newDueDate.toISOString();
    localStorage.setItem('borrowing', JSON.stringify(borrowing));
    
    UIHelper.showSuccess('Book renewed for 14 more days!');
    loadBorrowedBooks();
}

// Helper Functions
function formatDate(dateString) {
    return UIHelper.formatDate(dateString);
}

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const mainContent = document.querySelector('.student-main');
    mainContent.insertBefore(alertDiv, mainContent.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Handle Student Profile Picture Upload
function handleProfilePictureUpload(event) {
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
    const progressDiv = document.getElementById('upload-progress');
    const progressStatus = document.getElementById('upload-status');

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
            
            // Update students array
            const students = JSON.parse(localStorage.getItem('students') || '[]');
            const studentIndex = students.findIndex(s => s.studentId === currentUser.studentId);
            if (studentIndex !== -1) {
                students[studentIndex].profilePicture = imageData;
                localStorage.setItem('students', JSON.stringify(students));
            }
            
            // Update UI
            document.getElementById('profile-avatar').src = imageData;
            document.getElementById('user-avatar').src = imageData;
            
            progressDiv.style.display = 'none';
            UIHelper.showSuccess('Profile picture uploaded successfully!');
            logActivity('UPLOAD_PROFILE_PIC', 'Student uploaded new profile picture');
            
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

