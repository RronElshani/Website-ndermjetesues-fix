const Pervoja = require('../models/Pervoja');

const pervojaController = {
    /**
     * Create a new experience entry
     */
    async create(req, res) {
        try {
            const { pozicioni, kompania, data_fillimit, data_mbarimit, aktualisht, pershkrimi } = req.body;

            const pervoja = await Pervoja.create({
                user_id: req.user.id,
                pozicioni,
                kompania,
                data_fillimit,
                data_mbarimit,
                aktualisht,
                pershkrimi
            });

            res.status(201).json({
                success: true,
                message: 'Experience added successfully',
                data: pervoja
            });
        } catch (error) {
            console.error('Create pervoja error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error creating experience'
            });
        }
    },

    /**
     * Get all experience entries for current user
     */
    async getMyExperience(req, res) {
        try {
            const pervoja = await Pervoja.findByUserId(req.user.id);

            res.json({
                success: true,
                data: pervoja
            });
        } catch (error) {
            console.error('Get pervoja error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error fetching experience'
            });
        }
    },

    /**
     * Get experience by user ID (public)
     */
    async getByUserId(req, res) {
        try {
            const pervoja = await Pervoja.findByUserId(req.params.userId);

            res.json({
                success: true,
                data: pervoja
            });
        } catch (error) {
            console.error('Get user pervoja error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    /**
     * Update an experience entry
     */
    async update(req, res) {
        try {
            const pervoja = await Pervoja.update(req.params.id, req.user.id, req.body);

            if (!pervoja) {
                return res.status(404).json({
                    success: false,
                    message: 'Experience not found or unauthorized'
                });
            }

            res.json({
                success: true,
                message: 'Experience updated successfully',
                data: pervoja
            });
        } catch (error) {
            console.error('Update pervoja error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    /**
     * Delete an experience entry
     */
    async delete(req, res) {
        try {
            const deleted = await Pervoja.delete(req.params.id, req.user.id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Experience not found or unauthorized'
                });
            }

            res.json({
                success: true,
                message: 'Experience deleted successfully'
            });
        } catch (error) {
            console.error('Delete pervoja error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
};

module.exports = pervojaController;
