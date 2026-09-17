-- thebuildsystem · Supabase schema
-- Run this once in your project's SQL Editor (Supabase dashboard → SQL Editor → New query).

-- One row per client, linked 1:1 to the built-in auth.users table.
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  plan text,                -- e.g. 'solo', 'coaching_6mo', 'coaching_12mo'
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Each signed-in client can see and edit only their own row.
create policy "Users can view their own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Automatically create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
