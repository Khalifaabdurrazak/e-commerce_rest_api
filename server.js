require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests
});
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const errorHandler = require('./middleware/errorHandler');

connectDB();

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', limiter);

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Add this near the top, after your routes but before errorHandler
app.get('/', (req, res) => {
  res.json({
    message: 'E-Commerce API is running! 🚀',
    documentation: 'Check /api/products, /api/auth/register, etc.',
    endpoints: {
      auth: '/api/auth/register, /api/auth/login',
      products: '/api/products',
      orders: '/api/orders/... (protected)'
    }
  });
});