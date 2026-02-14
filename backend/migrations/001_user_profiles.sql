-- User profiles for dietary preferences (allergies, restrictions, etc.)
-- Run in Supabase SQL Editor

create table if not exists user_profiles (
  user_id uuid primary key,
  allergies jsonb not null default '[]'::jsonb,
  dietary_restrictions jsonb not null default '[]'::jsonb,
  health_conditions jsonb not null default '[]'::jsonb,
  health_goals jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS: users can only read/write their own profile
alter table user_profiles enable row level security;

create policy "Users can read own profile"
  on user_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on user_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on user_profiles for update
  using (auth.uid() = user_id);

-- Service role bypasses RLS for backend operations
