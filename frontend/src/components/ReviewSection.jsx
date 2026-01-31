import { useState, useEffect } from 'react';
import { reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';
import './ReviewSection.css';

const ReviewSection = ({ serviceId, serviceOwnerId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ average: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ rating: 0, komenti: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Check if user already reviewed
    const hasReviewed = reviews.some(r => r.user_id === user?.id);
    // User can't review their own service
    const isOwner = user?.id === serviceOwnerId;

    useEffect(() => {
        fetchReviews();
    }, [serviceId]);

    const fetchReviews = async () => {
        try {
            const response = await reviewsAPI.getByService(serviceId);
            setReviews(response.data.data.reviews || []);
            setStats(response.data.data.stats || { average: 0, total: 0 });
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.rating === 0) {
            setError('Ju lutem zgjidhni vlerësimin');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await reviewsAPI.create({
                service_id: serviceId,
                rating: formData.rating,
                komenti: formData.komenti
            });
            setFormData({ rating: 0, komenti: '' });
            setShowForm(false);
            fetchReviews();
        } catch (err) {
            setError(err.response?.data?.message || 'Gabim gjatë dërgimit');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!confirm('Jeni të sigurt që dëshironi të fshini këtë vlerësim?')) return;
        try {
            await reviewsAPI.delete(reviewId);
            fetchReviews();
        } catch (error) {
            alert('Gabim gjatë fshirjes');
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('sq-AL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return <div className="reviews-loading">Duke ngarkuar vlerësimet...</div>;
    }

    return (
        <div className="review-section">
            {/* Header with Stats */}
            <div className="review-header">
                <div className="review-stats">
                    <span className="average-rating">{stats.average}</span>
                    <div className="stats-detail">
                        <StarRating rating={Math.round(parseFloat(stats.average))} readonly size="medium" />
                        <span className="total-reviews">{stats.total} vlerësime</span>
                    </div>
                </div>

                {user && !isOwner && !hasReviewed && !showForm && (
                    <button className="add-review-btn" onClick={() => setShowForm(true)}>
                        Shkruaj Vlerësim
                    </button>
                )}
            </div>

            {/* Add Review Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="review-form">
                    <h4>Vlerësoni këtë shërbim</h4>

                    {error && <div className="form-error">{error}</div>}

                    <div className="form-group">
                        <label>Vlerësimi juaj</label>
                        <StarRating
                            rating={formData.rating}
                            onRate={(r) => setFormData({ ...formData, rating: r })}
                            size="large"
                        />
                    </div>

                    <div className="form-group">
                        <label>Komenti (opsional)</label>
                        <textarea
                            value={formData.komenti}
                            onChange={(e) => setFormData({ ...formData, komenti: e.target.value })}
                            placeholder="Përshkruani përvojën tuaj..."
                            rows={3}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                            Anulo
                        </button>
                        <button type="submit" className="submit-btn" disabled={submitting}>
                            {submitting ? 'Duke dërguar...' : 'Dërgo Vlerësimin'}
                        </button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="no-reviews">
                    <p>Asnjë vlerësim ende. Bëhu i pari që vlerëson!</p>
                </div>
            ) : (
                <div className="reviews-list">
                    {reviews.map(review => (
                        <div key={review.id} className="review-item">
                            <div className="review-author">
                                {review.profile_picture ? (
                                    <img src={review.profile_picture} alt="" className="author-avatar" />
                                ) : (
                                    <div className="author-avatar-placeholder">
                                        {review.emri?.[0]}{review.mbiemri?.[0]}
                                    </div>
                                )}
                                <div className="author-info">
                                    <span className="author-name">{review.emri} {review.mbiemri}</span>
                                    <span className="review-date">{formatDate(review.created_at)}</span>
                                </div>
                                {user?.id === review.user_id && (
                                    <button className="delete-review" onClick={() => handleDelete(review.id)}>
                                        Fshi
                                    </button>
                                )}
                            </div>
                            <StarRating rating={review.rating} readonly size="small" />
                            {review.komenti && <p className="review-text">{review.komenti}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
