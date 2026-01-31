-- =============================================
-- FIKS DATABASE SCHEMA
-- PostgreSQL initialization script
-- =============================================

-- Create extension for UUID generation (optional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    emri VARCHAR(100) NOT NULL,
    mbiemri VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'klient' CHECK (role IN ('klient', 'profesionist', 'admin')),
    telefoni VARCHAR(20),
    pershkrimi TEXT,
    profile_picture VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =============================================
-- SERVICES TABLE (Marketplace listings)
-- =============================================
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    titulli VARCHAR(255) NOT NULL,
    pershkrimi TEXT NOT NULL,
    cmimi DECIMAL(10, 2) NOT NULL,
    kategoria VARCHAR(100) NOT NULL,
    qyteti VARCHAR(100) NOT NULL,
    foto VARCHAR(500),
    aktiv BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for filtering and searching
CREATE INDEX IF NOT EXISTS idx_services_user ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_kategoria ON services(kategoria);
CREATE INDEX IF NOT EXISTS idx_services_qyteti ON services(qyteti);
CREATE INDEX IF NOT EXISTS idx_services_aktiv ON services(aktiv);

-- =============================================
-- PERVOJA TABLE (Work experience for professionals)
-- =============================================
CREATE TABLE IF NOT EXISTS pervoja (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pozicioni VARCHAR(255) NOT NULL,
    kompania VARCHAR(255) NOT NULL,
    data_fillimit DATE NOT NULL,
    data_mbarimit DATE,
    aktualisht BOOLEAN DEFAULT false,
    pershkrimi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pervoja_user ON pervoja(user_id);

-- =============================================
-- REVIEWS TABLE (Service reviews/ratings)
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    komenti TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(service_id, user_id) -- One review per user per service
);

CREATE INDEX IF NOT EXISTS idx_reviews_service ON reviews(service_id);

-- =============================================
-- MESSAGES TABLE (User messaging)
-- =============================================
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mesazhi TEXT NOT NULL,
    lexuar BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);

-- =============================================
-- SITE VISITS TABLE (Analytics tracking)
-- =============================================
CREATE TABLE IF NOT EXISTS site_visits (
    id SERIAL PRIMARY KEY,
    visitor_ip VARCHAR(45),
    page_path VARCHAR(500),
    user_agent TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_visits_date ON site_visits(visited_at);
CREATE INDEX IF NOT EXISTS idx_visits_user ON site_visits(user_id);

-- =============================================
-- SAMPLE SEED DATA (Optional - for development)
-- =============================================

-- Insert admin user (email: elshanirron@gmail.com, password: Arti2001)
INSERT INTO users (emri, mbiemri, email, password, role)
VALUES ('Admin', 'Fiks', 'elshanirron@gmail.com', '$2b$10$7PhoYPOrE4ZeeU8aR3Umxewl9VFaqFdWNOou2.UBUIMRY7KEEP4wO', 'admin')
ON CONFLICT (email) DO NOTHING;

COMMENT ON TABLE users IS 'Stores user accounts - clients, professionals, and admins';
COMMENT ON TABLE services IS 'Marketplace service listings by professionals';
COMMENT ON TABLE pervoja IS 'Work experience entries for professional profiles';
COMMENT ON TABLE reviews IS 'User reviews and ratings for services';
COMMENT ON TABLE messages IS 'Private messages between users';
COMMENT ON TABLE site_visits IS 'Visitor analytics for admin dashboard';
