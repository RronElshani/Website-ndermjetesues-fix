import { useState, useEffect } from 'react';
import { servicesAPI } from '../services/api';
import ServiceCard from '../components/ServiceCard';
import './Marketplace.css';

const Marketplace = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        kategoria: '',
        qyteti: ''
    });

    const categories = [
        'Të gjitha',
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
        'Të gjitha',
        'Prishtinë',
        'Prizren',
        'Pejë',
        'Gjakovë',
        'Ferizaj',
        'Gjilan',
        'Mitrovicë'
    ];

    useEffect(() => {
        fetchServices();
    }, [filters]);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.kategoria && filters.kategoria !== 'Të gjitha') {
                params.kategoria = filters.kategoria;
            }
            if (filters.qyteti && filters.qyteti !== 'Të gjitha') {
                params.qyteti = filters.qyteti;
            }
            const response = await servicesAPI.getAll(params);
            setServices(response.data.data || []);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="marketplace">
            <div className="marketplace-header">
                <h1>Marketplace</h1>
                <p>Gjej profesionistët më të mirë për punën tënde</p>
            </div>

            {/* Filters */}
            <div className="filters">
                <div className="filter-group">
                    <label>Kategoria</label>
                    <select
                        value={filters.kategoria}
                        onChange={(e) => setFilters({ ...filters, kategoria: e.target.value })}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat === 'Të gjitha' ? '' : cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Qyteti</label>
                    <select
                        value={filters.qyteti}
                        onChange={(e) => setFilters({ ...filters, qyteti: e.target.value })}
                    >
                        {cities.map(city => (
                            <option key={city} value={city === 'Të gjitha' ? '' : city}>{city}</option>
                        ))}
                    </select>
                </div>
            </div>

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
                </div>
            ) : (
                <div className="services-grid">
                    {services.map(service => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Marketplace;
