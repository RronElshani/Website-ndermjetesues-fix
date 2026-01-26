const pool = require('../config/database');

const Review = {
    /**
     * Create a new review
     */
    async create({ service_id, user_id, rating, komenti }) {
        // Check if user already reviewed this service
        const existingReview = await this.findByUserAndService(user_id, service_id);
        if (existingReview) {
            throw new Error('You have already reviewed this service');
        }

        const query = `
      INSERT INTO reviews (service_id, user_id, rating, komenti, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `;
        const values = [service_id, user_id, rating, komenti];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    /**
     * Find reviews by service ID with user info
     */
    async findByServiceId(serviceId) {
        const query = `
      SELECT r.*, u.emri, u.mbiemri, u.profile_picture
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.service_id = $1
      ORDER BY r.created_at DESC
    `;
        const result = await pool.query(query, [serviceId]);
        return result.rows;
    },

    /**
     * Find review by user and service (to check if already reviewed)
     */
    async findByUserAndService(userId, serviceId) {
        const query = 'SELECT * FROM reviews WHERE user_id = $1 AND service_id = $2';
        const result = await pool.query(query, [userId, serviceId]);
        return result.rows[0];
    },

    /**
     * Get average rating for a service
     */
    async getAverageRating(serviceId) {
        const query = `
      SELECT 
        COALESCE(AVG(rating), 0) as average,
        COUNT(*) as total
      FROM reviews 
      WHERE service_id = $1
    `;
        const result = await pool.query(query, [serviceId]);
        return {
            average: parseFloat(result.rows[0].average).toFixed(1),
            total: parseInt(result.rows[0].total)
        };
    },

    /**
     * Update a review
     */
    async update(id, userId, { rating, komenti }) {
        const query = `
      UPDATE reviews 
      SET rating = COALESCE($1, rating), 
          komenti = COALESCE($2, komenti)
      WHERE id = $3 AND user_id = $4
      RETURNING *
    `;
        const result = await pool.query(query, [rating, komenti, id, userId]);
        return result.rows[0];
    },

    /**
     * Delete a review
     */
    async delete(id, userId) {
        const query = 'DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING id';
        const result = await pool.query(query, [id, userId]);
        return result.rows[0];
    }
};

module.exports = Review;
