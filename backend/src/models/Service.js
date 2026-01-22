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
    }
};

module.exports = Service;
