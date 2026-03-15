
create table public.search_history (
  id uuid primary key default gen_random_uuid(),
  anon_id text not null,
  query text not null,
  response text not null,
  created_at timestamp with time zone default now() not null
);

alter table public.search_history enable row level security;

create policy "Anyone can read their own search history"
  on public.search_history for select
  to anon, authenticated
  using (true);

create policy "Anyone can insert search history"
  on public.search_history for insert
  to anon, authenticated
  with check (true);

create index idx_search_history_anon_id on public.search_history(anon_id);
create index idx_search_history_created_at on public.search_history(created_at desc);
