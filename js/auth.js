// Authentication & User Management

// Initialize localStorage with demo data
function initializeDatabase() {
    if (!localStorage.getItem('students')) {
        localStorage.setItem('students', JSON.stringify([
            {
                id: '1',
                name: 'John Doe',
                email: 'email@student.com',
                studentId: 'STU-2025-001',
                password: 'password',
                createdAt: new Date().toISOString(),
                profilePicture: 'https://via.placeholder.com/150?text=John'
            }
        ]));
    }

    if (!localStorage.getItem('admins')) {
        localStorage.setItem('admins', JSON.stringify([
            {
                id: '1',
                name: 'Super Admin',
                email: 'admin@library.com',
                password: 'admin123',
                role: 'super_admin',
                createdAt: new Date().toISOString(),
                profilePicture: 'https://via.placeholder.com/150?text=Admin'
            },
            {
                id: '2',
                name: 'Admin User',
                email: 'teacher@library.com',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toISOString(),
                profilePicture: 'https://via.placeholder.com/150?text=Teacher'
            }
        ]));
    }

    if (!localStorage.getItem('books')) {
        localStorage.setItem('books', JSON.stringify([
            { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', isbn: '978-0743273565', quantity: 5, available: 5, coverUrl: 'https://via.placeholder.com/150?text=Gatsby' },
            { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', isbn: '978-0061120084', quantity: 3, available: 2, coverUrl: 'https://via.placeholder.com/150?text=Mockingbird' },
            { id: '3', title: 'Python Programming', author: 'Guido van Rossum', category: 'Technology', isbn: '978-0134685991', quantity: 4, available: 3, coverUrl: 'https://via.placeholder.com/150?text=Python' }
        ]));
    }

    if (!localStorage.getItem('borrowing')) {
        localStorage.setItem('borrowing', JSON.stringify([]));
    }

    if (!localStorage.getItem('ebooks')) {
        localStorage.setItem('ebooks', JSON.stringify([
            { id: '1', title: 'Digital Age', author: 'Tech Author', category: 'Technology', status: 'approved', uploadDate: new Date().toISOString() }
        ]));
    }
}

// Call on page load
initializeDatabase();

// Login Functions
function openStudentLogin() {
    document.getElementById('studentLoginModal').style.display = 'block';
    document.getElementById('student-login').classList.add('active');
}

function closeStudentLogin() {
    document.getElementById('studentLoginModal').style.display = 'none';
}

function openAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'block';
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'none';
}

// Tab Switching
function switchTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabContents.forEach(tab => tab.classList.remove('active'));
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Student Login
function loginStudent() {
    const email = document.getElementById('student-email').value;
    const password = document.getElementById('student-password').value;

    if (!email || !password) {
        UIHelper.showError('Please fill all fields');
        return;
    }

    if (!FormValidator.isEmail(email)) {
        UIHelper.showError('Invalid email format');
        return;
    }

    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find(s => s.email === email && s.password === password);

    if (student) {
        localStorage.setItem('currentUser', JSON.stringify({
            ...student,
            userType: 'student'
        }));
        logActivity('Student Login', { email });
        closeStudentLogin();
        window.location.href = 'pages/student-dashboard.html';
    } else {
        UIHelper.showError('Invalid email or password');
    }
}

// Student Signup
function signupStudent() {
    const name = document.getElementById('student-name').value;
    const email = document.getElementById('student-signup-email').value;
    const studentId = document.getElementById('student-id').value;
    const password = document.getElementById('student-signup-password').value;

    if (!name || !email || !studentId || !password) {
        UIHelper.showError('Please fill all fields');
        return;
    }

    if (!FormValidator.isValidName(name)) {
        UIHelper.showError('Name must be at least 2 characters');
        return;
    }

    if (!FormValidator.isEmail(email)) {
        UIHelper.showError('Invalid email address');
        return;
    }

    if (!FormValidator.isValidStudentId(studentId)) {
        UIHelper.showError('Student ID must be at least 3 characters');
        return;
    }

    if (!FormValidator.isStrongPassword(password)) {
        UIHelper.showError('Password must be at least 6 characters');
        return;
    }

    const students = JSON.parse(localStorage.getItem('students') || '[]');
    
    if (students.find(s => s.email === email)) {
        UIHelper.showError('Email already exists');
        return;
    }

    const newStudent = {
        id: Date.now().toString(),
        name,
        email,
        studentId,
        password,
        createdAt: new Date().toISOString(),
        profilePicture: signupProfilePictureData || 'https://via.placeholder.com/150?text=' + name.split(' ')[0]
    };

    students.push(newStudent);
    localStorage.setItem('students', JSON.stringify(students));

    UIHelper.showSuccess('Account created successfully! Please login.');
    
    setTimeout(() => {
        document.getElementById('student-name').value = '';
        document.getElementById('student-signup-email').value = '';
        document.getElementById('student-id').value = '';
        document.getElementById('student-signup-password').value = '';
        document.getElementById('signup-profile-picture-upload').value = '';
        signupProfilePictureData = null;
        switchTab('student-login');
    }, 1500);
}

// Admin/Teacher Login
function loginAdmin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    if (!email || !password) {
        UIHelper.showError('Please fill all fields');
        return;
    }

    if (!FormValidator.isEmail(email)) {
        UIHelper.showError('Invalid email format');
        return;
    }

    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    const admin = admins.find(a => a.email === email && a.password === password);

    if (admin) {
        localStorage.setItem('currentUser', JSON.stringify({
            ...admin,
            userType: 'admin'
        }));
        logActivity('Admin Login', { email, role: admin.role });
        closeAdminLogin();
        window.location.href = 'pages/admin-dashboard.html';
    } else {
        UIHelper.showError('Invalid email or password');
    }
}

// Logout
function logout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // Log logout activity before clearing session
        if (currentUser) {
            logActivity('User Logout', { 
                user: currentUser.name, 
                email: currentUser.email,
                role: currentUser.role,
                userType: currentUser.userType,
                logoutTime: new Date().toISOString()
            });
        }
        
        // Clear ALL session-related data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionStartTime');
        localStorage.removeItem('lastActivity');
        localStorage.removeItem('sessionUpdated');
        localStorage.removeItem('signupProfilePictureData');
        
        // Clear any session storage
        if (sessionStorage) {
            sessionStorage.clear();
        }
        
        // Clear any form data
        const forms = document.querySelectorAll('form');
        forms.forEach(form => form.reset());
        
        // Show logout message
        UIHelper.showSuccess('You have been logged out successfully!');
        
        // Redirect to home page after a short delay
        setTimeout(() => {
            // Force page reload to clear all page state
            window.location.href = '../index.html';
            window.location.reload(true); // Force hard reload
        }, 1000);
    }
}
}

// Log Activity
function logActivity(action, details) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const activityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');

    if (currentUser) {
        activityLog.push({
            timestamp: new Date().toISOString(),
            user: currentUser.name,
            action,
            details
        });
    }

    localStorage.setItem('activityLog', JSON.stringify(activityLog));
}

// Check if user is logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = '../index.html';
    }
    return JSON.parse(currentUser);
}

// Show Alert
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Try to insert after modal content or at top
    const modal = document.querySelector('.modal-content') || document.body;
    modal.insertBefore(alertDiv, modal.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Handle signup profile picture upload
let signupProfilePictureData = null;

function handleSignupProfilePictureUpload(event) {
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
    
    // Read file as data URL
    const reader = new FileReader();
    
    reader.onloadstart = () => {
        const uploadContainer = document.querySelector('#signup-profile-picture-upload').parentElement;
        const progressDiv = uploadContainer.querySelector('.upload-progress');
        if (progressDiv) {
            progressDiv.style.display = 'block';
        }
    };
    
    reader.onload = (e) => {
        signupProfilePictureData = e.target.result;
        const uploadContainer = document.querySelector('#signup-profile-picture-upload').parentElement;
        const statusText = uploadContainer.querySelector('.upload-status');
        if (statusText) {
            statusText.textContent = '✓ Image uploaded successfully';
            statusText.style.color = '#27ae60';
        }
        UIHelper.showSuccess('Profile picture uploaded successfully!');
    };
    
    reader.onerror = () => {
        signupProfilePictureData = null;
        UIHelper.showError('Error reading file');
    };
    
    reader.readAsDataURL(file);
}

// Close modals on outside click
window.onclick = function(event) {
    const studentModal = document.getElementById('studentLoginModal');
    const adminModal = document.getElementById('adminLoginModal');
    
    if (event.target === studentModal) {
        studentModal.style.display = 'none';
    }
    if (event.target === adminModal) {
        adminModal.style.display = 'none';
    }
}
