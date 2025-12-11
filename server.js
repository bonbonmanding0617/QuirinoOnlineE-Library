const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/pages/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, `pages/${page}.html`));
});

// API Routes (for future backend integration)
app.get('/api/stats', (req, res) => {
    res.json({
        message: 'Stats endpoint ready for integration',
        status: 'success'
    });
});

// Error handling
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🎓 Quirino Online Library Hub is running on port ${PORT}`);
    console.log(`📚 Access the application at http://localhost:${PORT}`);
});
