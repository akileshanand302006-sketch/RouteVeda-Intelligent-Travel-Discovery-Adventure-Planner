-- 006_create_trips_and_wishlists.sql
-- Create trips, trip_destinations, trip_activities, wishlists, reviews, and recently_viewed tables

CREATE TABLE IF NOT EXISTS trips (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  number_of_travelers INTEGER DEFAULT 1,
  travel_style VARCHAR(100) DEFAULT 'Adventure',
  budget NUMERIC(12, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Planning',
  itinerary JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trip_destinations (
  id VARCHAR(255) PRIMARY KEY,
  trip_id VARCHAR(255) REFERENCES trips(id) ON DELETE CASCADE,
  destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
  destination_name VARCHAR(255),
  visit_order INTEGER DEFAULT 1,
  days_allocated INTEGER DEFAULT 1,
  estimated_cost NUMERIC(10, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trip_activities (
  id VARCHAR(255) PRIMARY KEY,
  trip_id VARCHAR(255) REFERENCES trips(id) ON DELETE CASCADE,
  activity_id VARCHAR(255),
  activity_name VARCHAR(255),
  day_number INTEGER DEFAULT 1,
  cost NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wishlists (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, destination_id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
  user_name VARCHAR(255),
  user_avatar TEXT,
  rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  title VARCHAR(255),
  comment TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recently_viewed (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, destination_id)
);
