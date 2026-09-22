-- 008_create_experiences_and_itineraries.sql
-- Create experiences, itineraries, and notifications tables

CREATE TABLE IF NOT EXISTS experiences (
  id VARCHAR(255) PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  states TEXT[],
  highlight_tag VARCHAR(100),
  popular_spots_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS itineraries (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  region VARCHAR(50),
  states TEXT[],
  duration_days INTEGER DEFAULT 3,
  travel_style VARCHAR(100) DEFAULT 'Adventure',
  estimated_budget_per_person NUMERIC(12, 2) DEFAULT 0,
  cover_image TEXT,
  destination_ids INTEGER[],
  destination_names TEXT[],
  highlights TEXT[],
  day_by_day_plan JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  type VARCHAR(50) DEFAULT 'system',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  icon VARCHAR(100) DEFAULT 'bi-bell-fill',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_experiences_category ON experiences(category);
CREATE INDEX IF NOT EXISTS idx_itineraries_region ON itineraries(region);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
