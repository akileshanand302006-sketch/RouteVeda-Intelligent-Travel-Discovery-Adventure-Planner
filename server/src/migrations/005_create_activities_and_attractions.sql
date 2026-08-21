-- 005_create_activities_and_attractions.sql
-- Create activities, attractions, destination_activities, foods, and festivals tables

CREATE TABLE IF NOT EXISTS activities (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  duration VARCHAR(100),
  price NUMERIC(10, 2) DEFAULT 0,
  difficulty VARCHAR(50) DEFAULT 'Moderate',
  rating NUMERIC(3, 2) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  min_age INTEGER DEFAULT 0,
  location VARCHAR(255),
  icon VARCHAR(100),
  image_url TEXT,
  includes TEXT[],
  what_to_bring TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS destination_activities (
  destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
  activity_id VARCHAR(255) REFERENCES activities(id) ON DELETE CASCADE,
  PRIMARY KEY (destination_id, activity_id)
);

CREATE TABLE IF NOT EXISTS attractions (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  destination_id INTEGER REFERENCES destinations(id) ON DELETE SET NULL,
  destination_name VARCHAR(255),
  state_id VARCHAR(100),
  state_name VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  description TEXT,
  image TEXT,
  rating NUMERIC(3, 2) DEFAULT 4.5,
  entry_fee VARCHAR(100),
  timings VARCHAR(100),
  highlights TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS foods (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  destination_id INTEGER REFERENCES destinations(id) ON DELETE SET NULL,
  state_id VARCHAR(100),
  state_name VARCHAR(255),
  category VARCHAR(100),
  description TEXT,
  is_veg BOOLEAN DEFAULT TRUE,
  price_range VARCHAR(50),
  must_try_at TEXT[],
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS festivals (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  state_id VARCHAR(100),
  state_name VARCHAR(255),
  month VARCHAR(50),
  duration VARCHAR(50),
  description TEXT,
  significance TEXT,
  highlights TEXT[],
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
