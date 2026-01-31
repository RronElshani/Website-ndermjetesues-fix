const pool = require('../config/database');

const SiteVisit = {
    /**
     * Log a page visit
     */
    async logVisit({ ip, path, userAgent, userId = null }) {
        const query = `
            INSERT INTO site_visits (visitor_ip, page_path, user_agent, user_id, visited_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING id
        `;
        const values = [ip, path, userAgent, userId];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    /**
     * Get visitor statistics
     * @param {string} period - 'daily', 'monthly', 'yearly'
     */
    async getStats(period = 'daily') {
        let dateFormat, groupBy, limit;

        switch (period) {
            case 'yearly':
                dateFormat = 'YYYY';
                groupBy = "TO_CHAR(visited_at, 'YYYY')";
                limit = 5;
                break;
            case 'monthly':
                dateFormat = 'YYYY-MM';
                groupBy = "TO_CHAR(visited_at, 'YYYY-MM')";
                limit = 12;
                break;
            case 'daily':
            default:
                dateFormat = 'YYYY-MM-DD';
                groupBy = "TO_CHAR(visited_at, 'YYYY-MM-DD')";
                limit = 30;
                break;
        }

        const query = `
            SELECT 
                ${groupBy} as period,
                COUNT(*) as total_visits,
                COUNT(DISTINCT visitor_ip) as unique_visitors
            FROM site_visits
            GROUP BY ${groupBy}
            ORDER BY period DESC
            LIMIT $1
        `;

        const result = await pool.query(query, [limit]);
        return result.rows.reverse(); // Return in chronological order
    },

    /**
     * Get today's visitor count
     */
    async getTodayCount() {
        const query = `
            SELECT 
                COUNT(*) as total_visits,
                COUNT(DISTINCT visitor_ip) as unique_visitors
            FROM site_visits
            WHERE visited_at >= CURRENT_DATE
        `;
        const result = await pool.query(query);
        return result.rows[0];
    },

    /**
     * Get total visitor count
     */
    async getTotalCount() {
        const query = `
            SELECT 
                COUNT(*) as total_visits,
                COUNT(DISTINCT visitor_ip) as unique_visitors
            FROM site_visits
        `;
        const result = await pool.query(query);
        return result.rows[0];
    }
};

module.exports = SiteVisit;
