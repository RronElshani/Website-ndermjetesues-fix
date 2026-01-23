import { useState, useEffect } from 'react';
import { pervojaAPI } from '../services/api';
import './ExperienceSection.css';

const ExperienceSection = ({ userId, isOwner }) => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        pozicioni: '',
        kompania: '',
        data_fillimit: '',
        data_mbarimit: '',
        aktualisht: false,
        pershkrimi: ''
    });

    useEffect(() => {
        fetchExperiences();
    }, [userId]);

    const fetchExperiences = async () => {
        try {
            const response = isOwner
                ? await pervojaAPI.getMy()
                : await pervojaAPI.getByUser(userId);
            setExperiences(response.data.data || []);
        } catch (error) {
            console.error('Error fetching experiences:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            pozicioni: '',
            kompania: '',
            data_fillimit: '',
            data_mbarimit: '',
            aktualisht: false,
            pershkrimi: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await pervojaAPI.update(editingId, formData);
            } else {
                await pervojaAPI.create(formData);
            }
            fetchExperiences();
            resetForm();
        } catch (error) {
            alert('Gabim gjatë ruajtjes');
        }
    };

    const handleEdit = (exp) => {
        setFormData({
            pozicioni: exp.pozicioni,
            kompania: exp.kompania,
            data_fillimit: exp.data_fillimit?.split('T')[0] || '',
            data_mbarimit: exp.data_mbarimit?.split('T')[0] || '',
            aktualisht: exp.aktualisht,
            pershkrimi: exp.pershkrimi || ''
        });
        setEditingId(exp.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Jeni të sigurt?')) return;
        try {
            await pervojaAPI.delete(id);
            setExperiences(experiences.filter(e => e.id !== id));
        } catch (error) {
            alert('Gabim gjatë fshirjes');
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('sq-AL', { month: 'short', year: 'numeric' });
    };

    if (loading) {
        return <div className="experience-loading">Duke ngarkuar...</div>;
    }

    return (
        <div className="experience-section">
            <div className="section-header">
                <h2>💼 Përvoja Profesionale</h2>
                {isOwner && !showForm && (
                    <button className="add-exp-btn" onClick={() => setShowForm(true)}>
                        + Shto
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {showForm && isOwner && (
                <form onSubmit={handleSubmit} className="exp-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Pozicioni *</label>
                            <input
                                type="text"
                                value={formData.pozicioni}
                                onChange={(e) => setFormData({ ...formData, pozicioni: e.target.value })}
                                placeholder="p.sh. Hidraulik"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Kompania *</label>
                            <input
                                type="text"
                                value={formData.kompania}
                                onChange={(e) => setFormData({ ...formData, kompania: e.target.value })}
                                placeholder="p.sh. Fiks SH.P.K"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Data Fillimit *</label>
                            <input
                                type="date"
                                value={formData.data_fillimit}
                                onChange={(e) => setFormData({ ...formData, data_fillimit: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Data Mbarimit</label>
                            <input
                                type="date"
                                value={formData.data_mbarimit}
                                onChange={(e) => setFormData({ ...formData, data_mbarimit: e.target.value })}
                                disabled={formData.aktualisht}
                            />
                        </div>
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.aktualisht}
                                onChange={(e) => setFormData({ ...formData, aktualisht: e.target.checked, data_mbarimit: '' })}
                            />
                            Aktualisht punoj këtu
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Përshkrimi</label>
                        <textarea
                            value={formData.pershkrimi}
                            onChange={(e) => setFormData({ ...formData, pershkrimi: e.target.value })}
                            placeholder="Përshkruani përgjegjësitë tuaja..."
                            rows={3}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={resetForm}>
                            Anulo
                        </button>
                        <button type="submit" className="save-btn">
                            {editingId ? 'Përditëso' : 'Ruaj'}
                        </button>
                    </div>
                </form>
            )}

            {/* Experience List */}
            {experiences.length === 0 ? (
                <div className="no-experience">
                    <p>{isOwner ? 'Nuk keni shtuar asnjë përvojë ende' : 'Asnjë përvojë e regjistruar'}</p>
                </div>
            ) : (
                <div className="experience-list">
                    {experiences.map(exp => (
                        <div key={exp.id} className="experience-item">
                            <div className="exp-timeline">
                                <div className="timeline-dot"></div>
                                <div className="timeline-line"></div>
                            </div>
                            <div className="exp-content">
                                <div className="exp-header">
                                    <div>
                                        <h3>{exp.pozicioni}</h3>
                                        <p className="exp-company">{exp.kompania}</p>
                                    </div>
                                    {isOwner && (
                                        <div className="exp-actions">
                                            <button onClick={() => handleEdit(exp)}>✏️</button>
                                            <button onClick={() => handleDelete(exp.id)}>🗑️</button>
                                        </div>
                                    )}
                                </div>
                                <p className="exp-dates">
                                    {formatDate(exp.data_fillimit)} - {exp.aktualisht ? 'Aktualisht' : formatDate(exp.data_mbarimit)}
                                </p>
                                {exp.pershkrimi && <p className="exp-desc">{exp.pershkrimi}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExperienceSection;
