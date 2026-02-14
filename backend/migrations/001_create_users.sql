-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: Supabase Auth provides auth.users. This migration prepares the schema.
-- If you need a custom public.users table for app-specific metadata, add it here.
-- For FoodFinder.AI, we use auth.users.id directly as user_id in user_profiles.
