const pool = require('../config/database');

const Service = {
    /**
     * Create a new service
     */
    async create({ user_id, titulli, pershkrimi, cmimi, kategoria, qyteti }) {
        const query = `
      INSERT INTO services (user_id, titulli, pershkrimi, cmimi, kategoria, qyteti, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;
        const values = [user_id, titulli, pershkrimi, cmimi, kategoria, qyteti];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    /**
     * Find all services with optional filters
     */
    async findAll({ kategoria, qyteti, limit = 20, offset = 0 }) {
        let query = `
      SELECT s.*, u.emri, u.mbiemri, u.profile_picture
      FROM services s
      JOIN users u ON s.user_id = u.id
      WHERE 1=1
    `;
        const values = [];
        let paramCount = 1;

        if (kategoria) {
            query += ` AND s.kategoria = $${paramCount}`;
            values.push(kategoria);
            paramCount++;
        }

        if (qyteti) {
            query += ` AND s.qyteti = $${paramCount}`;
            values.push(qyteti);
            paramCount++;
        }

        query += ` ORDER BY s.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        values.push(limit, offset);

        const result = await pool.query(query, values);
        return result.rows;
    },

    /**
     * Find service by ID
     */
    async findById(id) {
        const query = `
      SELECT s.*, u.emri, u.mbiemri, u.email, u.telefoni, u.profile_picture
      FROM services s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = $1
    `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    /**
     * Find services by user ID
     */
    async findByUserId(userId) {
        const query = 'SELECT * FROM services WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [userId]);
        return result.rows;
    },

    /**
     * Update a service
     */
    async update(id, userId, updates) {
        const allowedFields = ['titulli', 'pershkrimi', 'cmimi', 'kategoria', 'qyteti'];
        const fieldsToUpdate = [];
        const values = [];
        let paramCount = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key) && value !== undefined) {
                fieldsToUpdate.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        }

        if (fieldsToUpdate.length === 0) {
            return this.findById(id);
        }

        values.push(id, userId);
        const query = `
      UPDATE services 
      SET ${fieldsToUpdate.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING *
    `;

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    /**
     * Delete a service
     */
    async delete(id, userId) {
        const query = 'DELETE FROM services WHERE id = $1 AND user_id = $2 RETURNING id';
        const result = await pool.query(query, [id, userId]);
        return result.rows[0];
    },

    /**
     * Advanced search with text, filters, and sorting
     */
    async search({ query: searchQuery, kategoria, qyteti, minPrice, maxPrice, sortBy = 'newest', limit = 20, offset = 0 }) {
        let query = `
            SELECT s.*, u.emri, u.mbiemri, u.profile_picture,
                   COALESCE(AVG(r.rating), 0) as avg_rating,
                   COUNT(r.id) as review_count
            FROM services s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN reviews r ON s.id = r.service_id
            WHERE s.aktiv = true
        `;
        const values = [];
        let paramCount = 1;

        // Text search on title and description
        if (searchQuery && searchQuery.trim()) {
            query += ` AND (s.titulli ILIKE $${paramCount} OR s.pershkrimi ILIKE $${paramCount})`;
            values.push(`%${searchQuery.trim()}%`);
            paramCount++;
        }

        // Category filter
        if (kategoria) {
            query += ` AND s.kategoria = $${paramCount}`;
            values.push(kategoria);
            paramCount++;
        }

        // City filter
        if (qyteti) {
            query += ` AND s.qyteti = $${paramCount}`;
            values.push(qyteti);
            paramCount++;
        }

        // Price range
        if (minPrice !== undefined && minPrice !== null) {
            query += ` AND s.cmimi >= $${paramCount}`;
            values.push(minPrice);
            paramCount++;
        }

        if (maxPrice !== undefined && maxPrice !== null) {
            query += ` AND s.cmimi <= $${paramCount}`;
            values.push(maxPrice);
            paramCount++;
        }

        // Group by for aggregation
        query += ` GROUP BY s.id, u.id`;

        // Sorting
        switch (sortBy) {
            case 'price_low':
                query += ` ORDER BY s.cmimi ASC`;
                break;
            case 'price_high':
                query += ` ORDER BY s.cmimi DESC`;
                break;
            case 'rating':
                query += ` ORDER BY avg_rating DESC`;
                break;
            case 'oldest':
                query += ` ORDER BY s.created_at ASC`;
                break;
            default: // newest
                query += ` ORDER BY s.created_at DESC`;
        }

        query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        values.push(limit, offset);

        const result = await pool.query(query, values);
        return result.rows;
    },

    /**
     * Get unique categories
     */
    async getCategories() {
        const query = 'SELECT DISTINCT kategoria FROM services WHERE aktiv = true ORDER BY kategoria';
        const result = await pool.query(query);
        return result.rows.map(r => r.kategoria);
    },

    /**
     * Get unique cities
     */
    async getCities() {
        const query = 'SELECT DISTINCT qyteti FROM services WHERE aktiv = true ORDER BY qyteti';
        const result = await pool.query(query);
        return result.rows.map(r => r.qyteti);
    },

    /**
     * Search suggestions (autocomplete)
     */
    async getSuggestions(query) {
        if (!query || query.length < 2) return [];

        const sql = `
            SELECT DISTINCT titulli as suggestion, 'service' as type
            FROM services 
            WHERE titulli ILIKE $1 AND aktiv = true
            LIMIT 5
        `;
        const result = await pool.query(sql, [`%${query}%`]);
        return result.rows;
    }
};

module.exports = Service;
