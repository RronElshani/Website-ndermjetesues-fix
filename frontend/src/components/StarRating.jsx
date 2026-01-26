import './StarRating.css';

const StarRating = ({ rating, onRate, size = 'medium', readonly = false }) => {
    const stars = [1, 2, 3, 4, 5];

    const handleClick = (value) => {
        if (!readonly && onRate) {
            onRate(value);
        }
    };

    return (
        <div className={`star-rating ${size} ${readonly ? 'readonly' : 'interactive'}`}>
            {stars.map((star) => (
                <span
                    key={star}
                    className={`star ${star <= rating ? 'filled' : 'empty'}`}
                    onClick={() => handleClick(star)}
                    role={readonly ? 'img' : 'button'}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                >
                    {star <= rating ? '★' : '☆'}
                </span>
            ))}
        </div>
    );
};

export default StarRating;
