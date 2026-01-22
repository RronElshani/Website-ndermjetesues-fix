const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
    /**
     * Register a new user
     */
    async register(req, res) {
        try {
            const { emri, mbiemri, email, password, role, telefoni } = req.body;

            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const user = await User.create({
                emri,
                mbiemri,
                email,
                password: hashedPassword,
                role: role || 'klient',
                telefoni
            });

            // Generate JWT
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: { user, token }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during registration'
            });
        }
    },

    /**
     * Login user
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Generate JWT
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;

            res.json({
                success: true,
                message: 'Login successful',
                data: { user: userWithoutPassword, token }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during login'
            });
        }
    },

    /**
     * Get current user profile
     */
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    /**
     * Update user profile
     */
    async updateProfile(req, res) {
        try {
            const updates = req.body;
            const user = await User.update(req.user.id, updates);

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: user
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
};

module.exports = authController;
