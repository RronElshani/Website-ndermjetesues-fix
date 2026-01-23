const pool = require('../config/database');

const Pervoja = {
    /**
     * Create a new experience entry
     */
    async create({ user_id, pozicioni, kompania, data_fillimit, data_mbarimit, aktualisht, pershkrimi }) {
        const query = `
      INSERT INTO pervoja (user_id, pozicioni, kompania, data_fillimit, data_mbarimit, aktualisht, pershkrimi, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;
        const values = [user_id, pozicioni, kompania, data_fillimit, data_mbarimit || null, aktualisht || false, pershkrimi];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    /**
     * Find all experience entries for a user
     */
    async findByUserId(userId) {
        const query = 'SELECT * FROM pervoja WHERE user_id = $1 ORDER BY data_fillimit DESC';
        const result = await pool.query(query, [userId]);
        return result.rows;
    },

    /**
     * Update an experience entry
     */
    async update(id, userId, updates) {
        const allowedFields = ['pozicioni', 'kompania', 'data_fillimit', 'data_mbarimit', 'aktualisht', 'pershkrimi'];
        const fieldsToUpdate = [];
        const values = [];
        let paramCount = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key)) {
                fieldsToUpdate.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        }

        if (fieldsToUpdate.length === 0) {
            return null;
        }

        values.push(id, userId);
        const query = `
      UPDATE pervoja 
      SET ${fieldsToUpdate.join(', ')}
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING *
    `;

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    /**
     * Delete an experience entry
     */
    async delete(id, userId) {
        const query = 'DELETE FROM pervoja WHERE id = $1 AND user_id = $2 RETURNING id';
        const result = await pool.query(query, [id, userId]);
        return result.rows[0];
    }
};

module.exports = Pervoja;
