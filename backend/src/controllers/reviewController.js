const Review = require('../models/Review');

const reviewController = {
    /**
     * Create a new review for a service
     */
    async create(req, res) {
        try {
            const { service_id, rating, komenti } = req.body;

            // Validate rating
            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 1 and 5'
                });
            }

            const review = await Review.create({
                service_id,
                user_id: req.user.id,
                rating,
                komenti
            });

            res.status(201).json({
                success: true,
                message: 'Review added successfully',
                data: review
            });
        } catch (error) {
            console.error('Create review error:', error);

            if (error.message.includes('already reviewed')) {
                return res.status(400).json({
                    success: false,
                    message: 'Ju keni lënë tashmë një vlerësim për këtë shërbim'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Server error creating review'
            });
        }
    },

    /**
     * Get all reviews for a service
     */
    async getByService(req, res) {
        try {
            const reviews = await Review.findByServiceId(req.params.serviceId);
            const stats = await Review.getAverageRating(req.params.serviceId);

            res.json({
                success: true,
                data: {
                    reviews,
                    stats
                }
            });
        } catch (error) {
            console.error('Get reviews error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error fetching reviews'
            });
        }
    },

    /**
     * Update a review
     */
    async update(req, res) {
        try {
            const { rating, komenti } = req.body;

            if (rating && (rating < 1 || rating > 5)) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 1 and 5'
                });
            }

            const review = await Review.update(req.params.id, req.user.id, { rating, komenti });

            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: 'Review not found or unauthorized'
                });
            }

            res.json({
                success: true,
                message: 'Review updated successfully',
                data: review
            });
        } catch (error) {
            console.error('Update review error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    /**
     * Delete a review
     */
    async delete(req, res) {
        try {
            const deleted = await Review.delete(req.params.id, req.user.id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Review not found or unauthorized'
                });
            }

            res.json({
                success: true,
                message: 'Review deleted successfully'
            });
        } catch (error) {
            console.error('Delete review error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
};

module.exports = reviewController;
