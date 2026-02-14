-- Analysis cache: keyed by (ingredients_hash, profile_hash)
-- Run in Supabase SQL Editor
-- Backend uses service role; no RLS needed for cache

create table if not exists analysis_cache (
  cache_key text primary key,
  result jsonb not null,
  created_at timestamptz not null default now()
);

-- Optional: index for cleanup of old entries (if you add TTL later)
-- create index idx_analysis_cache_created_at on analysis_cache(created_at);
