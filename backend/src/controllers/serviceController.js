const Service = require('../models/Service');

const serviceController = {
    /**
     * Create a new service
     */
    async create(req, res) {
        try {
            const { titulli, pershkrimi, cmimi, kategoria, qyteti } = req.body;

            const service = await Service.create({
                user_id: req.user.id,
                titulli,
                pershkrimi,
                cmimi,
                kategoria,
                qyteti
            });

            res.status(201).json({
                success: true,
                message: 'Service created successfully',
                data: service
            });
        } catch (error) {
            console.error('Create service error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error creating service'
            });
        }
    },

    /**
     * Get all services with filters
     */
    async getAll(req, res) {
        try {
            const { kategoria, qyteti, limit, offset } = req.query;

            const services = await Service.findAll({
                kategoria,
                qyteti,
                limit: parseInt(limit) || 20,
                offset: parseInt(offset) || 0
            });

            res.json({
                success: true,
                data: services
            });
        } catch (error) {
            console.error('Get services error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error fetching services'
            });
        }
    },

    /**
     * Get service by ID
     */
    async getById(req, res) {
        try {
            const service = await Service.findById(req.params.id);

            if (!service) {
                return res.status(404).json({
                    success: false,
                    message: 'Service not found'
                });
            }

            res.json({
                success: true,
                data: service
            });
        } catch (error) {
            console.error('Get service error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    /**
     * Get current user's services
     */
    async getMyServices(req, res) {
        try {
            const services = await Service.findByUserId(req.user.id);

            res.json({
                success: true,
                data: services
            });
        } catch (error) {
            console.error('Get my services error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    /**
     * Update a service
     */
    async update(req, res) {
        try {
            const service = await Service.update(req.params.id, req.user.id, req.body);

            if (!service) {
                return res.status(404).json({
                    success: false,
                    message: 'Service not found or unauthorized'
                });
            }

            res.json({
                success: true,
                message: 'Service updated successfully',
                data: service
            });
        } catch (error) {
            console.error('Update service error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    /**
     * Delete a service
     */
    async delete(req, res) {
        try {
            const deleted = await Service.delete(req.params.id, req.user.id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Service not found or unauthorized'
                });
            }

            res.json({
                success: true,
                message: 'Service deleted successfully'
            });
        } catch (error) {
            console.error('Delete service error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
};

module.exports = serviceController;
