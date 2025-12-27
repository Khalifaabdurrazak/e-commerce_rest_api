const express = require('express');
const { register, login } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { validationResult } = require('express-validator');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'fail', message: errors.array()[0].msg });
  }
  next();
};

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

module.exports = router;