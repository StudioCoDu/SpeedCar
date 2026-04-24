create table if not exists public.player_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text not null,
  best_score integer not null default 0 check (best_score >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists player_profiles_username_lower_idx
  on public.player_profiles (lower(username));

create index if not exists player_profiles_best_score_idx
  on public.player_profiles (best_score desc, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists player_profiles_set_updated_at on public.player_profiles;
create trigger player_profiles_set_updated_at
before update on public.player_profiles
for each row
execute function public.set_updated_at();

alter table public.player_profiles enable row level security;

drop policy if exists "player_profiles_select_all" on public.player_profiles;
create policy "player_profiles_select_all"
on public.player_profiles
for select
using (true);

drop policy if exists "player_profiles_insert_own" on public.player_profiles;
create policy "player_profiles_insert_own"
on public.player_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "player_profiles_update_own" on public.player_profiles;
create policy "player_profiles_update_own"
on public.player_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
