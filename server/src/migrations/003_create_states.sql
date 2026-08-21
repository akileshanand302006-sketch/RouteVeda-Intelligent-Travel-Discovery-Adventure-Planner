-- 003_create_states.sql
-- Create states table for all 28 Indian States & 8 Union Territories

CREATE TABLE IF NOT EXISTS states (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(10) NOT NULL UNIQUE,
  type VARCHAR(50) DEFAULT 'STATE',
  capital VARCHAR(255),
  region VARCHAR(50) NOT NULL,
  description TEXT,
  image_url TEXT,
  banner_image TEXT,
  thumbnail_url TEXT,
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  total_destinations INTEGER DEFAULT 0,
  places_count INTEGER DEFAULT 0,
  top_attractions TEXT[],
  food_specialties TEXT[],
  best_season VARCHAR(255),
  climate VARCHAR(255),
  languages TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
