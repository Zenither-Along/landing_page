-- ============================================
-- MRIZO CORNER — Lookbook Schema
-- Run this in Supabase → SQL Editor
-- ============================================

-- 1. Create table
create table public.lookbook_images (
  id             uuid        default gen_random_uuid() primary key,
  storage_path   text        not null unique,
  alt_text       text,
  is_visible     boolean     default true,
  display_order  integer     default 0,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- 2. Enable RLS
alter table public.lookbook_images enable row level security;

-- 3. Public: read only visible images
create policy "Public read visible images"
  on public.lookbook_images
  for select to anon
  using (is_visible = true);

-- 4. Admin: full access (authenticated users)
create policy "Admin full access"
  on public.lookbook_images
  for all to authenticated
  using (true)
  with check (true);

-- 5. Auto-update updated_at on row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_lookbook_images_updated_at
  before update on public.lookbook_images
  for each row execute function public.set_updated_at();

-- ============================================
-- STORAGE (do in Supabase Dashboard UI)
-- ============================================
-- 1. Create bucket named: lookbook
-- 2. Set bucket to PUBLIC
-- 3. Add policies:
--    - anon: SELECT (download) → allow all
--    - authenticated: INSERT, UPDATE, DELETE → allow all
