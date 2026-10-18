-- Persist per-user read state and provide a free-tier-safe retention function.
create table if not exists public.conversation_read_states (
  user_id uuid not null references public.profiles(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (user_id, conversation_id)
);

alter table public.conversation_read_states enable row level security;

drop policy if exists conversation_read_states_select_self on public.conversation_read_states;
create policy conversation_read_states_select_self on public.conversation_read_states
for select to authenticated using (user_id = auth.uid());

drop policy if exists conversation_read_states_insert_self on public.conversation_read_states;
create policy conversation_read_states_insert_self on public.conversation_read_states
for insert to authenticated with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.conversations
    where id = conversation_id
      and auth.uid() in (participant_one_id, participant_two_id)
  )
);

drop policy if exists conversation_read_states_update_self on public.conversation_read_states;
create policy conversation_read_states_update_self on public.conversation_read_states
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.retain_last_five_messages()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  delete from public.messages
  where id in (
    select id
    from (
      select id,
        row_number() over (
          partition by conversation_id
          order by created_at desc, id desc
        ) as message_number
      from public.messages
    ) ranked
    where message_number > 5
  );

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.retain_last_five_messages() from public;
