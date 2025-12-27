const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });

    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      data: { user: { id: user._id, name, email, role: user.role } },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user._id);

    res.json({
      status: 'success',
      token,
      data: { user: { id: user._id, name: user.name, email, role: user.role } },
    });
  } catch (err) {
    next(err);
  }
};