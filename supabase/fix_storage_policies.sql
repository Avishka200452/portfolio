-- ============================================================
-- FIX STORAGE BUCKETS & RLS POLICIES FOR SUPABASE
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================

-- 1. Ensure all buckets exist and are marked PUBLIC
insert into storage.buckets (id, name, public)
values 
  ('videos', 'videos', true),
  ('photos', 'photos', true),
  ('images', 'images', true)
on conflict (id) do update set public = true;

-- 2. Drop existing policies to avoid name collisions
drop policy if exists "Public read videos" on storage.objects;
drop policy if exists "Public read photos" on storage.objects;
drop policy if exists "Public read images" on storage.objects;
drop policy if exists "Auth upload videos" on storage.objects;
drop policy if exists "Auth upload photos" on storage.objects;
drop policy if exists "Auth upload images" on storage.objects;
drop policy if exists "Auth delete videos" on storage.objects;
drop policy if exists "Auth delete photos" on storage.objects;
drop policy if exists "Auth delete images" on storage.objects;
drop policy if exists "Allow uploads videos" on storage.objects;
drop policy if exists "Allow uploads photos" on storage.objects;
drop policy if exists "Allow uploads images" on storage.objects;
drop policy if exists "Allow updates videos" on storage.objects;
drop policy if exists "Allow updates photos" on storage.objects;
drop policy if exists "Allow updates images" on storage.objects;
drop policy if exists "Allow deletes videos" on storage.objects;
drop policy if exists "Allow deletes photos" on storage.objects;
drop policy if exists "Allow deletes images" on storage.objects;
drop policy if exists "Public Access Videos" on storage.objects;
drop policy if exists "Public Access Photos" on storage.objects;
drop policy if exists "Public Access Images" on storage.objects;

-- 3. Allow anyone to view media publicly
create policy "Public read videos" on storage.objects for select using (bucket_id = 'videos');
create policy "Public read photos" on storage.objects for select using (bucket_id = 'photos');
create policy "Public read images" on storage.objects for select using (bucket_id = 'images');

-- 4. Allow uploading files to the buckets
create policy "Allow uploads videos" on storage.objects for insert with check (bucket_id = 'videos');
create policy "Allow uploads photos" on storage.objects for insert with check (bucket_id = 'photos');
create policy "Allow uploads images" on storage.objects for insert with check (bucket_id = 'images');

-- 5. Allow updating files
create policy "Allow updates videos" on storage.objects for update using (bucket_id = 'videos');
create policy "Allow updates photos" on storage.objects for update using (bucket_id = 'photos');
create policy "Allow updates images" on storage.objects for update using (bucket_id = 'images');

-- 6. Allow deleting files
create policy "Allow deletes videos" on storage.objects for delete using (bucket_id = 'videos');
create policy "Allow deletes photos" on storage.objects for delete using (bucket_id = 'photos');
create policy "Allow deletes images" on storage.objects for delete using (bucket_id = 'images');
