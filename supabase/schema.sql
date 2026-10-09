-- ============================================================
-- PORTFOLIO DATABASE SCHEMA
-- Paste into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

create table if not exists portfolio_meta (
  id uuid default gen_random_uuid() primary key,
  name text default 'Your Name',
  tagline text default 'Visual Designer & Content Creator',
  bio text default 'Tell your story here...',
  location text,
  email text,
  phone text,
  resume_url text,
  photo_url text,
  updated_at timestamptz default now()
);
insert into portfolio_meta (name) values ('Your Name');

create table if not exists works (
  id uuid default gen_random_uuid() primary key,
  category text not null check (category in ('social_media','video','branding','logo','uiux','photography')),
  title text not null,
  description text,
  image_url text,
  video_url text,
  link text,
  orientation text check (orientation in ('landscape','portrait')),
  social_platform text,
  social_link text,
  stats_views text,
  stats_likes text,
  stats_comments text,
  location text,
  client text,
  tags text[],
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists timeline_items (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('education','experience')),
  title text not null,
  institution text,
  period text,
  description text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists social_links (
  id uuid default gen_random_uuid() primary key,
  platform text not null,
  url text not null,
  icon text,
  sort_order int default 0
);

create table if not exists process_steps (
  id uuid default gen_random_uuid() primary key,
  step_number int not null,
  title text not null,
  description text,
  icon text default '✦'
);

-- RLS
alter table portfolio_meta   enable row level security;
alter table works            enable row level security;
alter table timeline_items   enable row level security;
alter table social_links     enable row level security;
alter table process_steps    enable row level security;

create policy "Public read meta"     on portfolio_meta   for select using (true);
create policy "Public read works"    on works            for select using (true);
create policy "Public read timeline" on timeline_items   for select using (true);
create policy "Public read social"   on social_links     for select using (true);
create policy "Public read process"  on process_steps    for select using (true);

create policy "Auth write meta"     on portfolio_meta   for all using (auth.role() = 'authenticated');
create policy "Auth write works"    on works            for all using (auth.role() = 'authenticated');
create policy "Auth write timeline" on timeline_items   for all using (auth.role() = 'authenticated');
create policy "Auth write social"   on social_links     for all using (auth.role() = 'authenticated');
create policy "Auth write process"  on process_steps    for all using (auth.role() = 'authenticated');

-- Storage
insert into storage.buckets (id, name, public) values ('videos', 'videos', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('photos', 'photos', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict do nothing;

create policy "Public read videos" on storage.objects for select using (bucket_id = 'videos');
create policy "Public read photos" on storage.objects for select using (bucket_id = 'photos');
create policy "Public read images" on storage.objects for select using (bucket_id = 'images');
create policy "Auth upload videos" on storage.objects for insert with check (bucket_id = 'videos' and auth.role() = 'authenticated');
create policy "Auth upload photos" on storage.objects for insert with check (bucket_id = 'photos' and auth.role() = 'authenticated');
create policy "Auth upload images" on storage.objects for insert with check (bucket_id = 'images' and auth.role() = 'authenticated');
create policy "Auth delete videos" on storage.objects for delete using (bucket_id = 'videos' and auth.role() = 'authenticated');
create policy "Auth delete photos" on storage.objects for delete using (bucket_id = 'photos' and auth.role() = 'authenticated');
create policy "Auth delete images" on storage.objects for delete using (bucket_id = 'images' and auth.role() = 'authenticated');
