import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Gjej profesionistët më të mirë
                        <span className="gradient-text"> për çdo punë</span>
                    </h1>
                    <p className="hero-subtitle">
                        Platforma që lidh klientët me profesionistët e verifikuar.
                        Hidraulik, elektricist, pastrues, dhe shumë më tepër.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/marketplace" className="btn btn-primary">
                            Shiko Shërbimet
                        </Link>
                        {!user && (
                            <Link to="/register" className="btn btn-secondary">
                                Bëhu Profesionist
                            </Link>
                        )}
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="floating-card card-1">🔧 Hidraulik</div>
                    <div className="floating-card card-2">⚡ Elektricist</div>
                    <div className="floating-card card-3">🧹 Pastrim</div>
                    <div className="floating-card card-4">🔨 Riparime</div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2 className="section-title">Si funksionon?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Kërko</h3>
                        <p>Gjej shërbimin që të nevojitet sipas kategorisë dhe qytetit</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📞</div>
                        <h3>Kontakto</h3>
                        <p>Lidhu direkt me profesionistin dhe diskuto detajet</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">✅</div>
                        <h3>Përfundo</h3>
                        <p>Merr shërbimin dhe lër një vlerësim për të ndihmuar të tjerët</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="cta-content">
                    <h2>Je profesionist?</h2>
                    <p>Regjistrohu dhe fillo të marrësh kërkesa nga klientët sot!</p>
                    <Link to="/register" className="btn btn-primary btn-large">
                        Fillo Tani - Falas
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
