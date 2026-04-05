const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Route files
const auth = require('./routes/authRoutes');
const users = require('./routes/userRoutes');
const records = require('./routes/recordRoutes');
const dashboard = require('./routes/dashboardRoutes');

const app = express();

// Set up JSON body parser first
app.use(express.json());

// Set security headers
app.use(helmet());

// Sanitize data (prevent NoSQL injection)
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/records', records);
app.use('/api/dashboard', dashboard);

// Error Handler Middleware
app.use(errorHandler);

module.exports = app; // For testing

// Automatically run listening if not heavily imported via jest
if (require.main === module || !process.env.TESTING) {
    // Connect to database
    connectDB();

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
        console.log(`Error: ${err.message}`);
        // Close server & exit process
        server.close(() => process.exit(1));
    });
}
