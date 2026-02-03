const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate Access and Refresh Tokens
 * Access token: Short-lived (15 minutes)
 * Refresh token: Long-lived (7 days)
 */
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
};

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

            // Generate tokens
            const { accessToken, refreshToken } = generateTokens(user);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user,
                    token: accessToken,
                    refreshToken
                }
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

            // Generate tokens
            const { accessToken, refreshToken } = generateTokens(user);

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: userWithoutPassword,
                    token: accessToken,
                    refreshToken
                }
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
     * Refresh access token using refresh token
     */
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Refresh token is required'
                });
            }

            // Verify refresh token
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            // Get user from database
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Generate new tokens
            const tokens = generateTokens(user);

            res.json({
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    token: tokens.accessToken,
                    refreshToken: tokens.refreshToken
                }
            });
        } catch (error) {
            console.error('Refresh token error:', error);

            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid or expired refresh token'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Server error during token refresh'
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
