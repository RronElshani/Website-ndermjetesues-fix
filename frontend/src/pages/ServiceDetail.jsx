import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ServiceDetail.css';

const ServiceDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchService();
    }, [id]);

    const fetchService = async () => {
        try {
            const response = await servicesAPI.getById(id);
            setService(response.data.data);
        } catch (err) {
            setError('Shërbimi nuk u gjet');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="service-detail-page">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Duke ngarkuar...</p>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="service-detail-page">
                <div className="error-state">
                    <span className="error-icon">😕</span>
                    <h2>{error || 'Shërbimi nuk u gjet'}</h2>
                    <Link to="/marketplace" className="back-link">
                        ← Kthehu te Marketplace
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="service-detail-page">
            <div className="service-detail-container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/marketplace">Marketplace</Link>
                    <span>/</span>
                    <span>{service.kategoria}</span>
                </nav>

                <div className="service-detail-grid">
                    {/* Main Content */}
                    <div className="service-main">
                        <div className="service-header-detail">
                            <div className="service-badges">
                                <span className="category-badge">{service.kategoria}</span>
                                <span className="city-badge">📍 {service.qyteti}</span>
                            </div>
                            <h1>{service.titulli}</h1>
                            <div className="service-price-large">
                                {service.cmimi} €
                            </div>
                        </div>

                        <div className="service-description-section">
                            <h2>Përshkrimi</h2>
                            <p>{service.pershkrimi}</p>
                        </div>
                    </div>

                    {/* Sidebar - Provider Info */}
                    <aside className="service-sidebar">
                        <div className="provider-card">
                            <div className="provider-header">
                                {service.profile_picture ? (
                                    <img
                                        src={service.profile_picture}
                                        alt={service.emri}
                                        className="provider-avatar"
                                    />
                                ) : (
                                    <div className="provider-avatar-placeholder">
                                        {service.emri?.[0]}{service.mbiemri?.[0]}
                                    </div>
                                )}
                                <div className="provider-info">
                                    <h3>{service.emri} {service.mbiemri}</h3>
                                    <span className="provider-role">🔧 Profesionist</span>
                                </div>
                            </div>

                            {user ? (
                                <div className="contact-section">
                                    {service.telefoni && (
                                        <a href={`tel:${service.telefoni}`} className="contact-btn phone">
                                            📞 {service.telefoni}
                                        </a>
                                    )}
                                    {service.email && (
                                        <a href={`mailto:${service.email}`} className="contact-btn email">
                                            ✉️ Dërgo Email
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <div className="login-prompt">
                                    <p>Kyçuni për të parë kontaktin</p>
                                    <Link to="/login" className="login-btn">
                                        Kyçu
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="service-meta">
                            <div className="meta-item">
                                <span className="meta-label">Publikuar</span>
                                <span className="meta-value">
                                    {new Date(service.created_at).toLocaleDateString('sq-AL')}
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
