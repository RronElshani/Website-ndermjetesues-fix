const pool = require('../config/database');

const Message = {
    /**
     * Send a new message
     */
    async create({ sender_id, receiver_id, mesazhi }) {
        const query = `
      INSERT INTO messages (sender_id, receiver_id, mesazhi, lexuar, created_at)
      VALUES ($1, $2, $3, false, NOW())
      RETURNING *
    `;
        const values = [sender_id, receiver_id, mesazhi];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    /**
     * Get all conversations for a user
     * Returns the latest message from each conversation with other user's info
     */
    async getConversations(userId) {
        const query = `
      WITH conversation_partners AS (
        SELECT DISTINCT
          CASE 
            WHEN sender_id = $1 THEN receiver_id 
            ELSE sender_id 
          END AS partner_id
        FROM messages
        WHERE sender_id = $1 OR receiver_id = $1
      ),
      latest_messages AS (
        SELECT DISTINCT ON (
          CASE 
            WHEN sender_id = $1 THEN receiver_id 
            ELSE sender_id 
          END
        )
          m.*,
          CASE 
            WHEN sender_id = $1 THEN receiver_id 
            ELSE sender_id 
          END AS partner_id
        FROM messages m
        WHERE sender_id = $1 OR receiver_id = $1
        ORDER BY partner_id, created_at DESC
      ),
      unread_counts AS (
        SELECT sender_id, COUNT(*) as unread
        FROM messages
        WHERE receiver_id = $1 AND lexuar = false
        GROUP BY sender_id
      )
      SELECT 
        lm.*,
        u.emri,
        u.mbiemri,
        u.profile_picture,
        COALESCE(uc.unread, 0) as unread_count
      FROM latest_messages lm
      JOIN users u ON lm.partner_id = u.id
      LEFT JOIN unread_counts uc ON lm.partner_id = uc.sender_id
      ORDER BY lm.created_at DESC
    `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    },

    /**
     * Get messages between two users
     */
    async getMessages(userId, otherUserId) {
        const query = `
      SELECT m.*, 
        s.emri as sender_emri, 
        s.mbiemri as sender_mbiemri,
        s.profile_picture as sender_profile_picture
      FROM messages m
      JOIN users s ON m.sender_id = s.id
      WHERE (m.sender_id = $1 AND m.receiver_id = $2)
         OR (m.sender_id = $2 AND m.receiver_id = $1)
      ORDER BY m.created_at ASC
    `;
        const result = await pool.query(query, [userId, otherUserId]);
        return result.rows;
    },

    /**
     * Mark all messages from a user as read
     */
    async markAsRead(userId, senderId) {
        const query = `
      UPDATE messages 
      SET lexuar = true
      WHERE receiver_id = $1 AND sender_id = $2 AND lexuar = false
      RETURNING id
    `;
        const result = await pool.query(query, [userId, senderId]);
        return result.rowCount;
    },

    /**
     * Get unread message count for a user
     */
    async getUnreadCount(userId) {
        const query = `
      SELECT COUNT(*) as count
      FROM messages 
      WHERE receiver_id = $1 AND lexuar = false
    `;
        const result = await pool.query(query, [userId]);
        return parseInt(result.rows[0].count);
    },

    /**
     * Get a single message by ID
     */
    async findById(id) {
        const query = 'SELECT * FROM messages WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = Message;
