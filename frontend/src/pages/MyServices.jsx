import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { servicesAPI } from '../services/api';
import './MyServices.css';

const MyServices = () => {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyServices();
    }, []);

    const fetchMyServices = async () => {
        try {
            const response = await servicesAPI.getMyServices();
            setServices(response.data.data || []);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Jeni të sigurt që dëshironi të fshini këtë shërbim?')) return;

        try {
            await servicesAPI.delete(id);
            setServices(services.filter(s => s.id !== id));
        } catch (error) {
            alert('Gabim gjatë fshirjes së shërbimit');
        }
    };

    if (!user || user.role !== 'profesionist') {
        return (
            <div className="my-services-page">
                <div className="access-denied">
                    <span className="icon">🔒</span>
                    <h2>Akses i Kufizuar</h2>
                    <p>Kjo faqe është vetëm për profesionistë</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-services-page">
            <div className="my-services-container">
                <div className="page-header">
                    <div className="header-content">
                        <h1>Shërbimet e Mia</h1>
                        <p>Menaxhoni shërbimet tuaja</p>
                    </div>
                    <Link to="/services/create" className="add-btn">
                        ➕ Shto Shërbim
                    </Link>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Duke ngarkuar shërbimet...</p>
                    </div>
                ) : services.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📦</span>
                        <h2>Asnjë shërbim ende</h2>
                        <p>Filloni duke shtuar shërbimin tuaj të parë</p>
                        <Link to="/services/create" className="create-first-btn">
                            ✨ Krijo Shërbimin e Parë
                        </Link>
                    </div>
                ) : (
                    <div className="services-list">
                        {services.map(service => (
                            <div key={service.id} className="service-item">
                                <div className="service-info">
                                    <div className="service-badges">
                                        <span className="category-badge">{service.kategoria}</span>
                                        <span className="city-badge">📍 {service.qyteti}</span>
                                    </div>
                                    <h3>{service.titulli}</h3>
                                    <p className="service-desc">{service.pershkrimi}</p>
                                    <div className="service-footer">
                                        <span className="service-price">{service.cmimi} €</span>
                                        <span className="service-date">
                                            Krijuar: {new Date(service.created_at).toLocaleDateString('sq-AL')}
                                        </span>
                                    </div>
                                </div>
                                <div className="service-actions">
                                    <Link to={`/services/${service.id}`} className="action-btn view">
                                        👁️ Shiko
                                    </Link>
                                    <button
                                        className="action-btn delete"
                                        onClick={() => handleDelete(service.id)}
                                    >
                                        🗑️ Fshi
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyServices;
