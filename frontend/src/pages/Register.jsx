import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        emri: '',
        mbiemri: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'klient',
        telefoni: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Fjalëkalimet nuk përputhen');
            setLoading(false);
            return;
        }

        try {
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Gabim gjatë regjistrimit. Provoni përsëri.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container auth-container-wide">
                <div className="auth-header">
                    <h1>Krijo llogarinë</h1>
                    <p>Regjistrohuni për të filluar të përdorni platformën</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="emri">Emri</label>
                            <input
                                type="text"
                                id="emri"
                                name="emri"
                                value={formData.emri}
                                onChange={handleChange}
                                placeholder="Emri juaj"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="mbiemri">Mbiemri</label>
                            <input
                                type="text"
                                id="mbiemri"
                                name="mbiemri"
                                value={formData.mbiemri}
                                onChange={handleChange}
                                placeholder="Mbiemri juaj"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@shembull.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefoni">Telefoni (opsional)</label>
                        <input
                            type="tel"
                            id="telefoni"
                            name="telefoni"
                            value={formData.telefoni}
                            onChange={handleChange}
                            placeholder="+383 4X XXX XXX"
                        />
                    </div>

                    <div className="form-group">
                        <label>Lloji i llogarisë</label>
                        <div className="role-selector">
                            <button
                                type="button"
                                className={`role-btn ${formData.role === 'klient' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, role: 'klient' })}
                            >
                                <span className="role-icon">👤</span>
                                <span>Klient</span>
                                <small>Kërkoj shërbime</small>
                            </button>
                            <button
                                type="button"
                                className={`role-btn ${formData.role === 'profesionist' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, role: 'profesionist' })}
                            >
                                <span className="role-icon">🔧</span>
                                <span>Profesionist</span>
                                <small>Ofroj shërbime</small>
                            </button>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="password">Fjalëkalimi</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimumi 6 karaktere"
                                minLength={6}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Konfirmo fjalëkalimin</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Përsërit fjalëkalimin"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Duke regjistruar...' : 'Regjistrohu'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Keni llogari? <Link to="/login">Hyni këtu</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
