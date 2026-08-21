-- 007_create_indexes_and_spatial.sql
-- Create spatial GIST indexes and performance indexes

-- Spatial index for PostGIS nearby / distance queries
CREATE INDEX IF NOT EXISTS destinations_location_idx 
ON destinations 
USING GIST(geo_location);

-- Filtering & search indexes
CREATE INDEX IF NOT EXISTS idx_destinations_state_id ON destinations(state_id);
CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations(category);
CREATE INDEX IF NOT EXISTS idx_destinations_region ON destinations(region);
CREATE INDEX IF NOT EXISTS idx_destinations_rating ON destinations(rating);
CREATE INDEX IF NOT EXISTS idx_destinations_price ON destinations(price_per_person);
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON destinations(featured);
CREATE INDEX IF NOT EXISTS idx_destinations_google_place_id ON destinations(google_place_id);

-- Relationships indexes
CREATE INDEX IF NOT EXISTS idx_attractions_dest ON attractions(destination_id);
CREATE INDEX IF NOT EXISTS idx_attractions_state ON attractions(state_id);
CREATE INDEX IF NOT EXISTS idx_foods_dest ON foods(destination_id);
CREATE INDEX IF NOT EXISTS idx_foods_state ON foods(state_id);
CREATE INDEX IF NOT EXISTS idx_festivals_state ON festivals(state_id);
CREATE INDEX IF NOT EXISTS idx_trips_user ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_dest_trip ON trip_destinations(trip_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_dest ON reviews(destination_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
