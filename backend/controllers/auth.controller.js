const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// helper to generate a JWT for a user
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/register
const register = async (req, res) => {
   
    try {

         const { name, email, password, username } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            username,
            password: hashedPassword,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  const { username, tagline } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, tagline },
      { new: true }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
         const { email } = req.body;
         
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account with that email' });
        }

        // generate a random token and set it to expire in 1 hour
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
        await user.save();

        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await resend.emails.send({
            from: 'To the next version <noreply@yourdomain.com>',
            to: user.email,
            subject: 'Reset your password',
            html: `<p>Click <a href="${resetURL}">here</a> to reset your password. This link expires in 1 hour.</p>`,
        });

        res.json({ message: 'Reset email sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // checks token hasn't expired
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined; // clear the token after use
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, forgotPassword, resetPassword, updateProfile };