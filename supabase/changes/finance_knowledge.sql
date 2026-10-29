create table public.finance_knowledge (
 id text primary key check (id ~ '^[a-z0-9-]{3,60}$'),
 category text not null check (category in ('loan','savings_account','demat','credit_card','insurance','other')),
 title text not null check (length(title) between 3 and 180),
 source_url text not null check (source_url like 'https://%'),
 status text not null check (status in ('verified','review_due')),
 facts jsonb not null default '{}'::jsonb,
 excerpt text not null default '' check (length(excerpt)<=2000),
 content_hash text,
 revision integer not null default 0 check (revision>=0),
 checked_at timestamptz,
 last_attempt_at timestamptz not null default now(),
 issue text check (length(issue)<=180)
);
alter table public.finance_knowledge enable row level security;
revoke all on table public.finance_knowledge from anon,authenticated;
grant select (id,category,title,source_url,status,facts,excerpt,revision,checked_at,last_attempt_at) on public.finance_knowledge to anon,authenticated;
grant all on public.finance_knowledge to service_role;
create policy finance_public_read on public.finance_knowledge for select to anon,authenticated using (true);
comment on table public.finance_knowledge is 'Official public source observations only; never private chat, applicant data, credentials, approval or personal quotes.';
