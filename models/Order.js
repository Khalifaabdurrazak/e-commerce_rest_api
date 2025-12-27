const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
  }],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);