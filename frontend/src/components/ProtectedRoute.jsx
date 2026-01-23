import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Wrapper for routes that require authentication
 * @param {object} props
 * @param {React.ReactNode} props.children - The component to render if authenticated
 * @param {string[]} props.allowedRoles - Optional array of roles allowed to access this route
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    // Show nothing while checking auth status
    if (loading) {
        return (
            <div className="auth-loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check role-based access
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
