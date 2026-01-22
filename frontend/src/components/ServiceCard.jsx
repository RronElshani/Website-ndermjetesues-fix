import { Link } from 'react-router-dom';
import './ServiceCard.css';

const ServiceCard = ({ service }) => {
    return (
        <Link to={`/services/${service.id}`} className="service-card">
            <div className="service-card-header">
                <span className="service-category">{service.kategoria}</span>
                <span className="service-city">{service.qyteti}</span>
            </div>

            <h3 className="service-title">{service.titulli}</h3>
            <p className="service-description">{service.pershkrimi}</p>

            <div className="service-footer">
                <div className="service-author">
                    {service.profile_picture ? (
                        <img src={service.profile_picture} alt="" className="author-avatar" />
                    ) : (
                        <div className="author-avatar-placeholder">
                            {service.emri?.[0]}{service.mbiemri?.[0]}
                        </div>
                    )}
                    <span>{service.emri} {service.mbiemri}</span>
                </div>
                <div className="service-price">
                    {service.cmimi} €
                </div>
            </div>
        </Link>
    );
};

export default ServiceCard;
