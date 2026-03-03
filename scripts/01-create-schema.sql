-- Create candidates table
CREATE TABLE IF NOT EXISTS public.candidates (
  id SERIAL PRIMARY KEY,
  candidate_id INTEGER UNIQUE NOT NULL,
  name_np TEXT NOT NULL,
  name_en TEXT,
  party_np TEXT NOT NULL,
  party_en TEXT,
  age INTEGER,
  gender TEXT,
  province_np TEXT NOT NULL,
  province_en TEXT,
  district_np TEXT,
  education_bucket TEXT,
  institution_norm TEXT,
  dob_bs_raw TEXT,
  constituency_no_hamro INTEGER,
  url_hamropatro TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_candidates_party ON public.candidates(party_np);
CREATE INDEX IF NOT EXISTS idx_candidates_age ON public.candidates(age);
CREATE INDEX IF NOT EXISTS idx_candidates_gender ON public.candidates(gender);
CREATE INDEX IF NOT EXISTS idx_candidates_province ON public.candidates(province_np);
CREATE INDEX IF NOT EXISTS idx_candidates_education ON public.candidates(education_bucket);

-- Create full-text search index on names
CREATE INDEX IF NOT EXISTS idx_candidates_name_trgm ON public.candidates USING GIN (name_np gin_trgm_ops);

-- Create party_stats table for cached statistics
CREATE TABLE IF NOT EXISTS public.party_stats (
  id SERIAL PRIMARY KEY,
  party_np TEXT UNIQUE NOT NULL,
  party_en TEXT,
  total_candidates INTEGER DEFAULT 0,
  avg_age DECIMAL(5, 2),
  female_count INTEGER DEFAULT 0,
  female_percentage DECIMAL(5, 2),
  male_count INTEGER DEFAULT 0,
  education_distribution JSONB,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create province_stats table for cached statistics
CREATE TABLE IF NOT EXISTS public.province_stats (
  id SERIAL PRIMARY KEY,
  province_np TEXT UNIQUE NOT NULL,
  province_en TEXT,
  total_candidates INTEGER DEFAULT 0,
  candidates_by_party JSONB,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create search_logs table for analytics (optional)
CREATE TABLE IF NOT EXISTS public.search_logs (
  id SERIAL PRIMARY KEY,
  query TEXT,
  filters JSONB,
  result_count INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable trigram extension for full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
