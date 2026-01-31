import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import ExperienceSection from '../components/ExperienceSection';
import './Profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        emri: '',
        mbiemri: '',
        telefoni: '',
        pershkrimi: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                emri: user.emri || '',
                mbiemri: user.mbiemri || '',
                telefoni: user.telefoni || '',
                pershkrimi: user.pershkrimi || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await authAPI.updateProfile(formData);
            updateUser(response.data.data);
            setMessage({ type: 'success', text: 'Profili u përditësua me sukses!' });
            setIsEditing(false);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Gabim gjatë përditësimit'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // For now, create a local URL (in production, upload to server)
        const imageUrl = URL.createObjectURL(file);

        try {
            const response = await authAPI.updateProfile({ profile_picture: imageUrl });
            updateUser(response.data.data);
            setMessage({ type: 'success', text: 'Foto u ndryshua me sukses!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Gabim gjatë ngarkimit të fotos' });
        }
    };

    if (!user) {
        return (
            <div className="profile-page">
                <div className="profile-error">
                    <h2>Ju lutem kyçuni për të parë profilin</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar">
                            {user.profile_picture ? (
                                <img src={user.profile_picture} alt="Profile" />
                            ) : (
                                <div className="avatar-placeholder">
                                    {user.emri?.[0]}{user.mbiemri?.[0]}
                                </div>
                            )}
                            <label className="avatar-upload">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    hidden
                                />
                                <span className="upload-icon">📷</span>
                            </label>
                        </div>
                    </div>
                    <div className="profile-info">
                        <h1>{user.emri} {user.mbiemri}</h1>
                        <span className={`role-badge ${user.role}`}>
                            {user.role === 'profesionist' ? 'Profesionist' : 'Klient'}
                        </span>
                        <p className="profile-email">{user.email}</p>
                    </div>
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`profile-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {/* Profile Form */}
                <div className="profile-section">
                    <div className="section-header">
                        <h2>Informacionet Personale</h2>
                        {!isEditing && (
                            <button
                                className="edit-btn"
                                onClick={() => setIsEditing(true)}
                            >
                                Ndrysho
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Emri</label>
                                <input
                                    type="text"
                                    name="emri"
                                    value={formData.emri}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mbiemri</label>
                                <input
                                    type="text"
                                    name="mbiemri"
                                    value={formData.mbiemri}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Telefoni</label>
                            <input
                                type="tel"
                                name="telefoni"
                                value={formData.telefoni}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="+383 4X XXX XXX"
                            />
                        </div>

                        <div className="form-group">
                            <label>Përshkrimi</label>
                            <textarea
                                name="pershkrimi"
                                value={formData.pershkrimi}
                                onChange={handleChange}
                                disabled={!isEditing}
                                rows={4}
                                placeholder="Shkruani diçka për veten tuaj..."
                            />
                        </div>

                        {isEditing && (
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Anulo
                                </button>
                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={loading}
                                >
                                    {loading ? 'Duke ruajtur...' : 'Ruaj Ndryshimet'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Experience Section - Only for professionals */}
                {user.role === 'profesionist' && (
                    <ExperienceSection userId={user.id} isOwner={true} />
                )}
            </div>
        </div>
    );
};

export default Profile;
