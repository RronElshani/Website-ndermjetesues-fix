const pool = require('../config/database');

const User = {
    /**
     * Create a new user
     */
    async create({ emri, mbiemri, email, password, role = 'klient', telefoni = null }) {
        const query = `
      INSERT INTO users (emri, mbiemri, email, password, role, telefoni, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id, emri, mbiemri, email, role, telefoni, created_at
    `;
        const values = [emri, mbiemri, email, password, role, telefoni];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    /**
     * Find user by email
     */
    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    /**
     * Find user by ID
     */
    async findById(id) {
        const query = 'SELECT id, emri, mbiemri, email, role, telefoni, pershkrimi, profile_picture, created_at FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    /**
     * Update user profile
     */
    async update(id, updates) {
        const allowedFields = ['emri', 'mbiemri', 'telefoni', 'pershkrimi', 'profile_picture'];
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

        values.push(id);
        const query = `
      UPDATE users 
      SET ${fieldsToUpdate.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING id, emri, mbiemri, email, role, telefoni, pershkrimi, profile_picture, created_at
    `;

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    /**
     * Get all users (for admin)
     */
    async findAll() {
        const query = 'SELECT id, emri, mbiemri, email, role, created_at FROM users ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    }
};

module.exports = User;
