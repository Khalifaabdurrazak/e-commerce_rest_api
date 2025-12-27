const express = require('express');
const {
  addToCart,
  getCart,
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/roleCheck');

const router = express.Router();

router.use(protect);

router.route('/cart').get(getCart).post(addToCart);
router.post('/checkout', createOrder);
router.get('/myorders', getMyOrders);

// Admin routes
router.get('/admin', restrictTo('admin'), getAllOrders);
router.patch('/:id/status', restrictTo('admin'), updateOrderStatus);

module.exports = router;