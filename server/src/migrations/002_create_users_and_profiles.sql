-- 002_create_users_and_profiles.sql
-- Create users, profiles, and user preferences tables

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  traveler_type VARCHAR(100) DEFAULT 'Explorer',
  bio TEXT,
  phone VARCHAR(50),
  location VARCHAR(255),
  joined_date DATE DEFAULT CURRENT_DATE,
  trips_created INTEGER DEFAULT 0,
  destinations_visited INTEGER DEFAULT 0,
  favorite_category VARCHAR(100) DEFAULT 'Adventure',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_preferences (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(50) DEFAULT 'dark',
  travel_style VARCHAR(100) DEFAULT 'Adventure',
  preferred_destination_type VARCHAR(100) DEFAULT 'All',
  currency VARCHAR(10) DEFAULT 'INR',
  notifications JSONB DEFAULT '{"tripReminders": true, "budgetAlerts": true, "recommendations": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
