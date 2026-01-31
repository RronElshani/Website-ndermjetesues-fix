import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">🔧</span>
                    <span className="logo-text">Fiks</span>
                </Link>

                <div className="navbar-links">
                    <Link to="/marketplace" className="nav-link">Marketplace</Link>

                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-link admin-link">Admin</Link>
                            )}
                            {user.role === 'profesionist' && (
                                <Link to="/my-services" className="nav-link">Shërbimet e Mia</Link>
                            )}
                            <Link to="/profile" className="nav-link profile-link">
                                {user.profile_picture ? (
                                    <img src={user.profile_picture} alt="Profile" className="nav-avatar" />
                                ) : (
                                    <div className="nav-avatar-placeholder">
                                        {user.emri?.[0]}{user.mbiemri?.[0]}
                                    </div>
                                )}
                                <span>{user.emri}</span>
                            </Link>
                            <button onClick={handleLogout} className="nav-button logout-btn">
                                Dil
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Hyr</Link>
                            <Link to="/register" className="nav-button primary-btn">Regjistrohu</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
