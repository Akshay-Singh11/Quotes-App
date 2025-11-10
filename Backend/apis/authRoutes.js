const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

const signToken = (user) => {
  const payload = { id: user._id, role: user.role };
  const secret = process.env.JWT_SECRET || 'dev_secret_key';
  const options = { expiresIn: '7d' };
  return jwt.sign(payload, secret, options);
};

router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    const token = signToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, preferences: user.preferences, favorites: user.favorites }
    });
  } catch (e) {
    console.error('Register error', e);
    res.status(500).json({ message: 'Failed to register' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, preferences: user.preferences, favorites: user.favorites } });
  } catch (e) {
    console.error('Login error', e);
    res.status(500).json({ message: 'Failed to login' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role, preferences: user.preferences, favorites: user.favorites });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

module.exports = router;

