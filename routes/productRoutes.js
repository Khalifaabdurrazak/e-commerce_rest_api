const express = require('express');
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/roleCheck');
const { productValidator } = require('../validators/productValidator');
const { validationResult } = require('express-validator');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'fail', message: errors.array()[0].msg });
  }
  next();
};

router
  .route('/')
  .get(getAllProducts)
  .post(protect, restrictTo('admin'), productValidator, validate, createProduct);

router
  .route('/:id')
  .get(getProduct)
  .patch(protect, restrictTo('admin'), productValidator, validate, updateProduct)
  .delete(protect, restrictTo('admin'), deleteProduct);

module.exports = router;