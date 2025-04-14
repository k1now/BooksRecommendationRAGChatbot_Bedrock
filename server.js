import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import xss from 'xss';
import rateLimit from 'express-rate-limit';
import { main } from './src/index.js';

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again after 15 minutes'
    }
});

// Apply CORS and rate limiting middleware
app.use(cors());
app.use(limiter);
app.use(express.json({ limit: '10kb' }));

// Basic logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = xss(req.body[key]);
            }
        });
    }
    next();
};

app.use(sanitizeInput);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Basic test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Chat endpoint with stricter rate limiting
const chatLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per minute
    message: {
        error: 'Too many chat requests, please wait a minute before trying again'
    }
});

app.post('/api/chat', chatLimiter, async (req, res) => {
    try {
        const { message } = req.body;
        
        // Input validation
        if (!message || typeof message !== 'string' || message.length > 1000) {
            return res.status(400).json({ 
                error: 'Invalid message format or length' 
            });
        }

        // Process the message using our existing logic
        console.log('Processing message:', message.substring(0, 50) + '...');
        const response = await main(message);

        // Ensure response is a string (React-safe)
        const cleanText = typeof response === 'string' 
            ? xss(response)
            : xss(JSON.stringify(response, null, 2));

        // Remove any special characters or formatting that might cause issues
        const sanitizedText = cleanText
            .replace(/\\n/g, ' ')  // Replace newlines with spaces
            .replace(/\\"/g, '"')  // Fix escaped quotes
            .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
            .trim();               // Remove leading/trailing whitespace

        res.json({ 
            message: sanitizedText,
            timestamp: Date.now()
        });

    } catch (error) {
        console.error('Error processing chat message:', error);
        res.status(500).json({ 
            error: 'Failed to process message',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});