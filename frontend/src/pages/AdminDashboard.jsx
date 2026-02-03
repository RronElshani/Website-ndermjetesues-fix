import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [visitorData, setVisitorData] = useState([]);
    const [period, setPeriod] = useState('daily');
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Redirect if not admin
        if (user && user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchDashboardData();
    }, [user, navigate]);

    useEffect(() => {
        if (activeTab === 'visitors') {
            fetchVisitorData();
        }
    }, [period, activeTab]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [dashboardRes, usersRes, servicesRes] = await Promise.all([
                adminAPI.getDashboard(),
                adminAPI.getUsers(),
                adminAPI.getServices()
            ]);
            setStats(dashboardRes.data.data);
            setUsers(usersRes.data.data);
            setServices(servicesRes.data.data);
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchVisitorData = async () => {
        try {
            const res = await adminAPI.getVisitors(period);
            setVisitorData(res.data.data);
        } catch (err) {
            console.error('Failed to fetch visitor data:', err);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            return;
        }
        try {
            await adminAPI.deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
            // Refresh stats
            const dashboardRes = await adminAPI.getDashboard();
            setStats(dashboardRes.data.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleDeleteService = async (serviceId, serviceTitle) => {
        if (!window.confirm(`Are you sure you want to delete service "${serviceTitle}"? This action cannot be undone.`)) {
            return;
        }
        try {
            await adminAPI.deleteService(serviceId);
            setServices(services.filter(s => s.id !== serviceId));
            // Refresh stats
            const dashboardRes = await adminAPI.getDashboard();
            setStats(dashboardRes.data.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete service');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('sq-AL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Duke ngarkuar dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard">
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={fetchDashboardData}>Provo përsëri</button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Mirësevini, {user?.emri}!</p>
            </header>

            <nav className="admin-tabs">
                <button
                    className={activeTab === 'overview' ? 'active' : ''}
                    onClick={() => setActiveTab('overview')}
                >
                    Përmbledhje
                </button>
                <button
                    className={activeTab === 'visitors' ? 'active' : ''}
                    onClick={() => setActiveTab('visitors')}
                >
                    Vizitorët
                </button>
                <button
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    Përdoruesit
                </button>
                <button
                    className={activeTab === 'services' ? 'active' : ''}
                    onClick={() => setActiveTab('services')}
                >
                    Shërbimet
                </button>
            </nav>

            {activeTab === 'overview' && stats && (
                <div className="overview-section">
                    <div className="stats-grid">
                        <div className="stat-card users">
                            <div className="stat-info">
                                <h3>Përdorues Gjithsej</h3>
                                <p className="stat-number">{stats.users?.total_users || 0}</p>
                                <div className="stat-breakdown">
                                    <span>{stats.users?.professionals || 0} profesionistë</span>
                                    <span>{stats.users?.clients || 0} klientë</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card services">
                            <div className="stat-info">
                                <h3>Shërbime</h3>
                                <p className="stat-number">{stats.services?.total || 0}</p>
                            </div>
                        </div>

                        <div className="stat-card messages">
                            <div className="stat-info">
                                <h3>Mesazhe</h3>
                                <p className="stat-number">{stats.messages?.total || 0}</p>
                            </div>
                        </div>

                        <div className="stat-card visitors">
                            <div className="stat-info">
                                <h3>Vizita Sot</h3>
                                <p className="stat-number">{stats.visitors?.today?.total_visits || 0}</p>
                                <span className="stat-subtitle">
                                    {stats.visitors?.today?.unique_visitors || 0} unikë
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="quick-stats">
                        <h3>Regjistrimet e fundit</h3>
                        <div className="quick-stats-row">
                            <div className="quick-stat">
                                <span className="label">Sot:</span>
                                <span className="value">{stats.users?.today || 0}</span>
                            </div>
                            <div className="quick-stat">
                                <span className="label">Këtë javë:</span>
                                <span className="value">{stats.users?.this_week || 0}</span>
                            </div>
                            <div className="quick-stat">
                                <span className="label">Këtë muaj:</span>
                                <span className="value">{stats.users?.this_month || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'visitors' && (
                <div className="visitors-section">
                    <div className="period-selector">
                        <button
                            className={period === 'daily' ? 'active' : ''}
                            onClick={() => setPeriod('daily')}
                        >
                            Ditore
                        </button>
                        <button
                            className={period === 'monthly' ? 'active' : ''}
                            onClick={() => setPeriod('monthly')}
                        >
                            Mujore
                        </button>
                        <button
                            className={period === 'yearly' ? 'active' : ''}
                            onClick={() => setPeriod('yearly')}
                        >
                            Vjetore
                        </button>
                    </div>

                    <div className="visitors-chart">
                        {visitorData.length > 0 ? (
                            <div className="chart-container">
                                {visitorData.map((item, index) => {
                                    const maxVisits = Math.max(...visitorData.map(v => parseInt(v.total_visits) || 1));
                                    const height = (parseInt(item.total_visits) / maxVisits) * 100;
                                    return (
                                        <div key={index} className="chart-bar">
                                            <div
                                                className="bar"
                                                style={{ height: `${Math.max(height, 5)}%` }}
                                                title={`${item.total_visits} vizita`}
                                            >
                                                <span className="bar-value">{item.total_visits}</span>
                                            </div>
                                            <span className="bar-label">{item.period}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="no-data">Nuk ka të dhëna për këtë periudhë</p>
                        )}
                    </div>

                    <div className="visitors-summary">
                        <div className="summary-card">
                            <h4>Gjithsej Vizita</h4>
                            <p>{stats?.visitors?.total?.total_visits || 0}</p>
                        </div>
                        <div className="summary-card">
                            <h4>Vizitorë Unikë</h4>
                            <p>{stats?.visitors?.total?.unique_visitors || 0}</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="users-section">
                    <h2>Menaxhimi i Përdoruesve ({users.length})</h2>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Emri</th>
                                    <th>Email</th>
                                    <th>Roli</th>
                                    <th>Regjistruar</th>
                                    <th>Veprime</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} className={u.role === 'admin' ? 'admin-row' : ''}>
                                        <td>{u.id}</td>
                                        <td>{u.emri} {u.mbiemri}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`role-badge ${u.role}`}>
                                                {u.role === 'admin' ? 'Admin' :
                                                    u.role === 'profesionist' ? 'Profesionist' : 'Klient'}
                                            </span>
                                        </td>
                                        <td>{formatDate(u.created_at)}</td>
                                        <td>
                                            {u.role !== 'admin' && u.id !== user.id && (
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteUser(u.id, `${u.emri} ${u.mbiemri}`)}
                                                >
                                                    Fshi
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'services' && (
                <div className="services-section">
                    <h2>Menaxhimi i Shërbimeve ({services.length})</h2>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Titulli</th>
                                    <th>Çmimi</th>
                                    <th>Kategoria</th>
                                    <th>Pronari</th>
                                    <th>Krijuar</th>
                                    <th>Veprime</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map(s => (
                                    <tr key={s.id}>
                                        <td>{s.id}</td>
                                        <td>{s.titulli}</td>
                                        <td>€{s.cmimi}</td>
                                        <td>{s.kategoria}</td>
                                        <td>{s.emri} {s.mbiemri}</td>
                                        <td>{formatDate(s.created_at)}</td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteService(s.id, s.titulli)}
                                            >
                                                Fshi
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
