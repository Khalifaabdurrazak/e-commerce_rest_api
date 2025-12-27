const { body } = require('express-validator');

const productValidator = [
  body('name').notEmpty(),
  body('description').notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('category').notEmpty(),
  body('stock').isInt({ min: 0 }),
  body('images').optional().isArray(),
];

module.exports = { productValidator };