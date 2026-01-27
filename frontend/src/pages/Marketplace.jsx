import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchAPI } from '../services/api';
import ServiceCard from '../components/ServiceCard';
import SearchBar from '../components/SearchBar';
import StarRating from '../components/StarRating';
import './Marketplace.css';

const Marketplace = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        q: searchParams.get('q') || '',
        kategoria: searchParams.get('kategoria') || '',
        qyteti: searchParams.get('qyteti') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sortBy: searchParams.get('sortBy') || 'newest'
    });
    const [showFilters, setShowFilters] = useState(false);

    const categories = [
        'Hidraulik',
        'Elektricist',
        'Pastrim',
        'Riparime',
        'Lyerje',
        'Kopshtari',
        'Transport',
        'Tjetër'
    ];

    const cities = [
        'Prishtinë',
        'Prizren',
        'Pejë',
        'Gjakovë',
        'Ferizaj',
        'Gjilan',
        'Mitrovicë'
    ];

    const sortOptions = [
        { value: 'newest', label: 'Më të rejat' },
        { value: 'oldest', label: 'Më të vjetrat' },
        { value: 'price_low', label: 'Çmimi: Ulët → Lartë' },
        { value: 'price_high', label: 'Çmimi: Lartë → Ulët' },
        { value: 'rating', label: 'Vlerësimi më i lartë' }
    ];

    useEffect(() => {
        fetchServices();
        updateURL();
    }, [filters]);

    const updateURL = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        setSearchParams(params);
    };

    const fetchServices = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.q) params.q = filters.q;
            if (filters.kategoria) params.kategoria = filters.kategoria;
            if (filters.qyteti) params.qyteti = filters.qyteti;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            if (filters.sortBy) params.sortBy = filters.sortBy;

            const response = await searchAPI.search(params);
            setServices(response.data.data || []);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        setFilters({ ...filters, q: query });
    };

    const clearFilters = () => {
        setFilters({
            q: '',
            kategoria: '',
            qyteti: '',
            minPrice: '',
            maxPrice: '',
            sortBy: 'newest'
        });
    };

    const activeFiltersCount = [
        filters.kategoria,
        filters.qyteti,
        filters.minPrice,
        filters.maxPrice
    ].filter(Boolean).length;

    return (
        <div className="marketplace">
            <div className="marketplace-header">
                <h1>Marketplace</h1>
                <p>Gjej profesionistët më të mirë për punën tënde</p>
            </div>

            {/* Search Bar */}
            <div className="search-section">
                <SearchBar initialValue={filters.q} onSearch={handleSearch} />
            </div>

            {/* Filter Controls */}
            <div className="filter-controls">
                <button
                    className={`filter-toggle ${showFilters ? 'active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    ⚙️ Filtrat {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </button>

                <div className="sort-control">
                    <label>Rendit sipas:</label>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    >
                        {sortOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Expandable Filters Panel */}
            {showFilters && (
                <div className="filters-panel">
                    <div className="filter-group">
                        <label>Kategoria</label>
                        <select
                            value={filters.kategoria}
                            onChange={(e) => setFilters({ ...filters, kategoria: e.target.value })}
                        >
                            <option value="">Të gjitha</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Qyteti</label>
                        <select
                            value={filters.qyteti}
                            onChange={(e) => setFilters({ ...filters, qyteti: e.target.value })}
                        >
                            <option value="">Të gjitha</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Çmimi Min (€)</label>
                        <input
                            type="number"
                            value={filters.minPrice}
                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                            placeholder="0"
                            min="0"
                        />
                    </div>

                    <div className="filter-group">
                        <label>Çmimi Max (€)</label>
                        <input
                            type="number"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                            placeholder="1000"
                            min="0"
                        />
                    </div>

                    {activeFiltersCount > 0 && (
                        <button className="clear-filters" onClick={clearFilters}>
                            ✕ Pastro Filtrat
                        </button>
                    )}
                </div>
            )}

            {/* Results Count */}
            {!loading && (
                <div className="results-count">
                    {services.length} shërbime u gjetën
                </div>
            )}

            {/* Services Grid */}
            {loading ? (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Duke ngarkuar shërbimet...</p>
                </div>
            ) : services.length === 0 ? (
                <div className="no-results">
                    <span className="no-results-icon">🔍</span>
                    <h3>Asnjë shërbim i gjetur</h3>
                    <p>Provoni të ndryshoni filtrat ose kërkoni diçka tjetër</p>
                    {activeFiltersCount > 0 && (
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            Pastro Filtrat
                        </button>
                    )}
                </div>
            ) : (
                <div className="services-grid">
                    {services.map(service => (
                        <div key={service.id} className="service-card-wrapper">
                            <ServiceCard service={service} />
                            {parseFloat(service.avg_rating) > 0 && (
                                <div className="service-rating-badge">
                                    <StarRating rating={Math.round(parseFloat(service.avg_rating))} readonly size="small" />
                                    <span>({service.review_count})</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Marketplace;
