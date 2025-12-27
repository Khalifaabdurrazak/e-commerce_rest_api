const Product = require('../models/Product');
const AppError = require('../utils/AppError');

// Admin only
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ status: 'success', data: { product } });
  } catch (err) {
    next(err);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search, minPrice, maxPrice } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      status: 'success',
      results: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: { products },
    });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError('Product not found', 404));
    res.json({ status: 'success', data: { product } });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return next(new AppError('Product not found', 404));
    res.json({ status: 'success', data: { product } });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return next(new AppError('Product not found', 404));
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};