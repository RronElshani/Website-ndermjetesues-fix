const User = require('../models/User');
const SiteVisit = require('../models/SiteVisit');
const pool = require('../config/database');

const adminController = {
    /**
     * Get dashboard overview statistics
     * GET /api/admin/dashboard
     */
    async getDashboardStats(req, res) {
        try {
            // Get user stats
            const userStats = await User.getRegistrationStats();

            // Get visitor stats
            const todayVisits = await SiteVisit.getTodayCount();
            const totalVisits = await SiteVisit.getTotalCount();

            // Get service count
            const serviceResult = await pool.query('SELECT COUNT(*) as count FROM services');
            const serviceCount = parseInt(serviceResult.rows[0].count);

            // Get message count
            const messageResult = await pool.query('SELECT COUNT(*) as count FROM messages');
            const messageCount = parseInt(messageResult.rows[0].count);

            res.json({
                success: true,
                data: {
                    users: userStats,
                    services: { total: serviceCount },
                    messages: { total: messageCount },
                    visitors: {
                        today: todayVisits,
                        total: totalVisits
                    }
                }
            });
        } catch (error) {
            console.error('Dashboard stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch dashboard stats'
            });
        }
    },

    /**
     * Get detailed visitor analytics
     * GET /api/admin/visitors?period=daily|monthly|yearly
     */
    async getVisitorStats(req, res) {
        try {
            const { period = 'daily' } = req.query;
            const stats = await SiteVisit.getStats(period);

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Visitor stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch visitor stats'
            });
        }
    },

    /**
     * Get all users for admin management
     * GET /api/admin/users
     */
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch users'
            });
        }
    },

    /**
     * Delete a user (admin only)
     * DELETE /api/admin/users/:id
     */
    async deleteUser(req, res) {
        try {
            const userId = parseInt(req.params.id);

            // Prevent admin from deleting themselves
            if (userId === req.user.id) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete your own account'
                });
            }

            // Check if user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Prevent deleting other admins
            if (user.role === 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Cannot delete admin accounts'
                });
            }

            const deleted = await User.delete(userId);

            if (deleted) {
                res.json({
                    success: true,
                    message: 'User deleted successfully'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to delete user'
                });
            }
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete user'
            });
        }
    },

    /**
     * Delete any service (admin only)
     * DELETE /api/admin/services/:id
     */
    async deleteAnyService(req, res) {
        try {
            const serviceId = parseInt(req.params.id);

            // Check if service exists
            const serviceResult = await pool.query(
                'SELECT id FROM services WHERE id = $1',
                [serviceId]
            );

            if (serviceResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Service not found'
                });
            }

            // Delete the service
            await pool.query('DELETE FROM services WHERE id = $1', [serviceId]);

            res.json({
                success: true,
                message: 'Service deleted successfully'
            });
        } catch (error) {
            console.error('Delete service error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete service'
            });
        }
    },

    /**
     * Get all services for admin management
     * GET /api/admin/services
     */
    async getAllServices(req, res) {
        try {
            const result = await pool.query(`
                SELECT s.*, u.emri, u.mbiemri, u.email as user_email
                FROM services s
                JOIN users u ON s.user_id = u.id
                ORDER BY s.created_at DESC
            `);

            res.json({
                success: true,
                data: result.rows
            });
        } catch (error) {
            console.error('Get all services error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch services'
            });
        }
    }
};

module.exports = adminController;
