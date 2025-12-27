const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return next(new AppError('Product not found', 404));
    if (product.stock < quantity) return next(new AppError('Not enough stock', 400));

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product');

    res.json({ status: 'success', data: { cart } });
  } catch (err) {
    next(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json({ status: 'success', data: { cart: cart || { items: [] } } });
  } catch (err) {
    next(err);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) return next(new AppError('Cart is empty', 400));

    const items = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Check stock and reduce
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return next(new AppError(`Not enough stock for ${item.product.name}`, 400));
      }
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      status: 'pending', // In real app, set to 'paid' after payment success
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    await order.populate('items.product');

    res.status(201).json({ status: 'success', data: { order } });
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ status: 'success', data: { orders } });
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => { // Admin only
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ status: 'success', data: { orders } });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => { // Admin only
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return next(new AppError('Order not found', 404));

    order.status = status;
    await order.save();

    res.json({ status: 'success', data: { order } });
  } catch (err) {
    next(err);
  }
};