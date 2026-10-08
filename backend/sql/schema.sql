-- =============================================================================
-- Hariputhran Enterprises - Production Database Schema
-- Generated from active database introspection.
-- Dependency order: admins -> password_resets, services, home_recent_works,
--                   service_requests, contact_messages, site_section_settings
-- =============================================================================

-- 1. Admins table
CREATE TABLE IF NOT EXISTS admins (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_admins_email_unique ON admins (LOWER(email));

-- 2. Password Resets table
CREATE TABLE IF NOT EXISTS password_resets (
    id BIGSERIAL PRIMARY KEY,
    admin_id BIGINT NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_resets_token_hash ON password_resets (token_hash);

-- 3. Services table
CREATE TABLE IF NOT EXISTS services (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    button_label VARCHAR(100) NOT NULL DEFAULT 'REQUEST A QUOTE',
    button_link VARCHAR(255) NOT NULL DEFAULT '/contact',
    icon_key VARCHAR(100) DEFAULT NULL,
    image_data BYTEA DEFAULT NULL,
    image_mime VARCHAR(50) DEFAULT NULL,
    image_updated_at TIMESTAMPTZ DEFAULT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_sort ON services (sort_order, id);

-- 4. Home Recent Works (Fixed 4 cards)
CREATE TABLE IF NOT EXISTS home_recent_works (
    id SMALLINT PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    location VARCHAR(120) NOT NULL,
    image_data BYTEA DEFAULT NULL,
    image_mime VARCHAR(50) DEFAULT NULL,
    image_updated_at TIMESTAMPTZ DEFAULT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 5. Service Requests table
CREATE TABLE IF NOT EXISTS service_requests (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT DEFAULT NULL,
    service_name VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(50) NOT NULL,
    message TEXT DEFAULT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    admin_notes TEXT DEFAULT NULL,
    confirmation_sent_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_requests_created ON service_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests (status);
CREATE INDEX IF NOT EXISTS idx_service_requests_unread ON service_requests (is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_service_requests_email ON service_requests (LOWER(customer_email), created_at DESC);

-- 6. Contact Messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGSERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    subject VARCHAR(255) DEFAULT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    admin_notes TEXT DEFAULT NULL,
    confirmation_sent_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages (status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_unread ON contact_messages (is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages (LOWER(customer_email), created_at DESC);

-- 7. Site Section Settings table (Master section toggles)
CREATE TABLE IF NOT EXISTS site_section_settings (
    section_key VARCHAR(100) PRIMARY KEY,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

