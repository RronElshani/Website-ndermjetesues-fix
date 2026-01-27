const Service = require('../models/Service');

const searchController = {
    /**
     * Search services with filters
     */
    async search(req, res) {
        try {
            const {
                q: query,
                kategoria,
                qyteti,
                minPrice,
                maxPrice,
                sortBy,
                page = 1,
                limit = 20
            } = req.query;

            const offset = (parseInt(page) - 1) * parseInt(limit);

            const services = await Service.search({
                query,
                kategoria,
                qyteti,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                sortBy,
                limit: parseInt(limit),
                offset
            });

            res.json({
                success: true,
                data: services,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    hasMore: services.length === parseInt(limit)
                }
            });
        } catch (error) {
            console.error('Search error:', error);
            res.status(500).json({
                success: false,
                message: 'Search failed'
            });
        }
    },

    /**
     * Get autocomplete suggestions
     */
    async suggestions(req, res) {
        try {
            const { q } = req.query;
            const suggestions = await Service.getSuggestions(q);

            res.json({
                success: true,
                data: suggestions
            });
        } catch (error) {
            console.error('Suggestions error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get suggestions'
            });
        }
    },

    /**
     * Get filter options (categories and cities)
     */
    async filters(req, res) {
        try {
            const [categories, cities] = await Promise.all([
                Service.getCategories(),
                Service.getCities()
            ]);

            res.json({
                success: true,
                data: {
                    categories,
                    cities
                }
            });
        } catch (error) {
            console.error('Filters error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get filters'
            });
        }
    }
};

module.exports = searchController;
