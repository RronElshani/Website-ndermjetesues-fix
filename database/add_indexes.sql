-- =============================================
-- DATABASE INDEXES FOR PERFORMANCE OPTIMIZATION
-- Run this script in PostgreSQL
-- =============================================

-- USERS TABLE INDEXES
-- Index on email for fast login lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index on role for filtering users by role
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- SERVICES TABLE INDEXES
-- Index on user_id for fetching user's services
CREATE INDEX IF NOT EXISTS idx_services_user ON services(user_id);

-- Index on category for filtering by category
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- Index on city for location filtering
CREATE INDEX IF NOT EXISTS idx_services_city ON services(city);

-- Composite index for common search patterns
CREATE INDEX IF NOT EXISTS idx_services_category_city ON services(category, city);

-- Index on created_at for sorting by newest
CREATE INDEX IF NOT EXISTS idx_services_created ON services(created_at DESC);

-- MESSAGES TABLE INDEXES
-- Index on sender_id for fetching sent messages
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);

-- Index on receiver_id for fetching received messages
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);

-- Composite index for conversation lookups
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(sender_id, receiver_id);

-- Index on created_at for message ordering
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- Index on lexuar (read status) for unread count
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(receiver_id, lexuar) WHERE lexuar = false;

-- REVIEWS TABLE INDEXES
-- Index on service_id for fetching service reviews
CREATE INDEX IF NOT EXISTS idx_reviews_service ON reviews(service_id);

-- Index on user_id for fetching user's reviews
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

-- PERVOJA (EXPERIENCE) TABLE INDEXES
-- Index on user_id for fetching user's experience
CREATE INDEX IF NOT EXISTS idx_pervoja_user ON pervoja(user_id);

-- SITE_VISITS TABLE INDEXES (if exists)
-- Index on visit_date for analytics queries
CREATE INDEX IF NOT EXISTS idx_visits_date ON site_visits(visit_date);

-- =============================================
-- VERIFY INDEXES CREATED
-- =============================================
-- Run: \di to list all indexes
