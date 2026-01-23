import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { servicesAPI } from '../services/api';
import './CreateService.css';

const CreateService = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        titulli: '',
        pershkrimi: '',
        cmimi: '',
        kategoria: '',
        qyteti: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await servicesAPI.create({
                ...formData,
                cmimi: parseFloat(formData.cmimi)
            });
            navigate('/my-services');
        } catch (err) {
            setError(err.response?.data?.message || 'Gabim gjatë krijimit të shërbimit');
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== 'profesionist') {
        return (
            <div className="create-service-page">
                <div className="access-denied">
                    <span className="icon">🔒</span>
                    <h2>Akses i Kufizuar</h2>
                    <p>Vetëm profesionistët mund të krijojnë shërbime</p>
                </div>
            </div>
        );
    }

    return (
        <div className="create-service-page">
            <div className="create-service-container">
                <div className="page-header">
                    <h1>Krijo Shërbim të Ri</h1>
                    <p>Plotësoni detajet e shërbimit tuaj</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="service-form">
                    <div className="form-group">
                        <label htmlFor="titulli">Titulli i Shërbimit *</label>
                        <input
                            type="text"
                            id="titulli"
                            name="titulli"
                            value={formData.titulli}
                            onChange={handleChange}
                            placeholder="p.sh. Riparim tubacionesh"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pershkrimi">Përshkrimi *</label>
                        <textarea
                            id="pershkrimi"
                            name="pershkrimi"
                            value={formData.pershkrimi}
                            onChange={handleChange}
                            placeholder="Përshkruani shërbimin tuaj në detaje..."
                            rows={5}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="kategoria">Kategoria *</label>
                            <select
                                id="kategoria"
                                name="kategoria"
                                value={formData.kategoria}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Zgjidhni kategorinë</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="qyteti">Qyteti *</label>
                            <select
                                id="qyteti"
                                name="qyteti"
                                value={formData.qyteti}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Zgjidhni qytetin</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="cmimi">Çmimi (€) *</label>
                        <input
                            type="number"
                            id="cmimi"
                            name="cmimi"
                            value={formData.cmimi}
                            onChange={handleChange}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                        />
                        <span className="input-hint">Çmimi fillestar ose për orë</span>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate(-1)}
                        >
                            Anulo
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Duke krijuar...' : '✨ Publiko Shërbimin'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateService;
