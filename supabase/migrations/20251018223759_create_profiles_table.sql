-- Create enum types for profile option fields. Wrap in DO blocks so the migration
-- stays idempotent when re-applied locally.
do $$
begin
  create type public.profile_family_composition as enum (
    'single',
    'couple',
    'young_children',
    'teens',
    'multi_generation'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.profile_health_priority as enum (
    'balanced',
    'low_carb',
    'high_protein',
    'low_salt'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.profile_cooking_skill as enum (
    'beginner',
    'intermediate',
    'advanced'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.profile_deli_usage as enum (
    'rarely',
    'weekly',
    'frequent',
    'daily'
  );
exception
  when duplicate_object then null;
end
$$;

-- Ensure a reusable trigger helper exists so updated_at is maintained automatically.
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Main profiles table holding user-specific configuration for meal planning.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  family_composition public.profile_family_composition,
  allergies text,
  health_priority public.profile_health_priority,
  cooking_skill public.profile_cooking_skill,
  deli_usage public.profile_deli_usage,
  memo text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.profiles is
  'Stores per-user meal planning preferences such as family composition and dietary notes.';
comment on column public.profiles.family_composition is
  'Household composition used to scale menu suggestions.';
comment on column public.profiles.allergies is
  'Comma separated list of allergy ingredients or items to avoid.';
comment on column public.profiles.health_priority is
  'Primary health focus influencing recipe recommendations.';
comment on column public.profiles.cooking_skill is
  'Self-reported cooking confidence level, shaping recipe difficulty.';
comment on column public.profiles.deli_usage is
  'Frequency of using prepared deli or ready-made dishes.';
comment on column public.profiles.memo is
  'Free-form memo for additional preferences or notes.';

-- Keep updated_at fresh on every row update.
drop trigger if exists set_public_profiles_updated_at on public.profiles;
create trigger set_public_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- Row Level Security aligned with Supabase best practices.
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

drop policy if exists "Users can delete own profile" on public.profiles;
create policy "Users can delete own profile"
  on public.profiles
  for delete
  using (auth.uid() = id);
