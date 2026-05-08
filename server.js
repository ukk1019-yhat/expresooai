const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false // Allow inline scripts/styles for this simple static page
}));
app.use(cors()); 

// Body Parsing Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Serve the static frontend files
app.use(express.static(path.join(__dirname)));

// Rate Limiter: Max 5 submissions per 15 minutes per IP
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, 
    message: { result: 'error', error: 'Too many requests from this IP, please try again after 15 minutes.' }
});

// API Route to handle contact form submissions
app.post(
    '/api/contact',
    contactLimiter,
    [
        // Strict input validation and sanitization
        body('name').trim().notEmpty().withMessage('Name is required').escape(),
        body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
        body('company').optional().trim().escape(),
        body('message').trim().notEmpty().withMessage('Message is required').escape()
    ],
    async (req, res) => {
        // 1. Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Return first error message
            return res.status(400).json({ result: 'error', error: errors.array()[0].msg });
        }

        try {
            const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;
            if (!googleScriptUrl) {
                console.error("GOOGLE_SCRIPT_URL is missing in environment variables.");
                return res.status(500).json({ result: 'error', error: 'Server configuration error' });
            }

            // 2. Prepare payload for Google Apps Script using FormData (matches original working frontend logic)
            const formData = new FormData();
            formData.append('name', req.body.name);
            formData.append('email', req.body.email);
            formData.append('company', req.body.company || '');
            formData.append('message', req.body.message);

            // 3. Forward request securely to Google Apps Script
            const response = await fetch(googleScriptUrl, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            // 4. Return success to the frontend
            if (data.result === 'success') {
                res.status(200).json({ result: 'success' });
            } else {
                console.error('Upstream error from Google Script:', data);
                res.status(500).json({ result: 'error', error: 'Upstream error' });
            }

        } catch (error) {
            console.error('Error forwarding request:', error);
            res.status(500).json({ result: 'error', error: 'Failed to process request' });
        }
    }
);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running securely on http://localhost:${PORT}`);
});
