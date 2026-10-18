create extension if not exists pgcrypto;

create type public.contact_status as enum ('pending', 'accepted', 'rejected');
create type public.message_type as enum ('text', 'image', 'voice', 'file');
create type public.message_status as enum ('sent', 'delivered', 'seen');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  display_name text not null,
  bio text,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9._-]{3,32}$'),
  constraint profiles_display_name_length check (char_length(display_name) between 1 and 80),
  constraint profiles_bio_length check (bio is null or char_length(bio) <= 280)
);

create unique index profiles_username_lower_idx on public.profiles (lower(username));

create table public.account_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  email text not null,
  updated_at timestamptz not null default now(),
  constraint account_profiles_email_format check (position('@' in email) > 1)
);

create unique index account_profiles_email_lower_idx on public.account_profiles (lower(email));

create table public.profile_media (
  id uuid primary key references public.profiles(id) on delete cascade,
  avatar_url text,
  updated_at timestamptz not null default now()
);

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status public.contact_status not null default 'pending',
  intro_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_requests_not_self check (requester_id <> addressee_id),
  constraint contact_requests_intro_length check (intro_message is null or char_length(intro_message) <= 500)
);

create unique index contact_requests_pair_idx on public.contact_requests (
  least(requester_id, addressee_id),
  greatest(requester_id, addressee_id)
);
create index contact_requests_addressee_idx on public.contact_requests (addressee_id, status, created_at desc);
create index contact_requests_requester_idx on public.contact_requests (requester_id, status, created_at desc);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  participant_one_id uuid not null references public.profiles(id) on delete cascade,
  participant_two_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conversations_ordered_participants check (participant_one_id < participant_two_id)
);

create unique index conversations_pair_idx on public.conversations (participant_one_id, participant_two_id);
create index conversations_participant_two_idx on public.conversations (participant_two_id, updated_at desc);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  type public.message_type not null default 'text',
  content text not null default '',
  media_url text,
  media_metadata jsonb not null default '{}'::jsonb,
  is_intro boolean not null default false,
  status public.message_status not null default 'sent',
  created_at timestamptz not null default now(),
  constraint messages_content_length check (char_length(content) <= 4000),
  constraint messages_has_content check (char_length(content) > 0 or media_url is not null)
);

create index messages_conversation_created_idx on public.messages (conversation_id, created_at desc);
create index messages_sender_idx on public.messages (sender_id, created_at desc);
create unique index messages_one_intro_per_conversation_idx on public.messages (conversation_id)
where is_intro;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger account_profiles_set_updated_at before update on public.account_profiles
for each row execute function public.set_updated_at();
create trigger profile_media_set_updated_at before update on public.profile_media
for each row execute function public.set_updated_at();
create trigger contact_requests_set_updated_at before update on public.contact_requests
for each row execute function public.set_updated_at();
create trigger conversations_set_updated_at before update on public.conversations
for each row execute function public.set_updated_at();

create or replace function public.is_conversation_participant(target_conversation_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.conversations
    where id = target_conversation_id
      and auth.uid() in (participant_one_id, participant_two_id)
  );
$$;

create or replace function public.are_accepted_contacts(first_user_id uuid, second_user_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.contact_requests
    where status = 'accepted'
      and least(requester_id, addressee_id) = least(first_user_id, second_user_id)
      and greatest(requester_id, addressee_id) = greatest(first_user_id, second_user_id)
  );
$$;

create or replace function public.validate_message_insert()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  first_user_id uuid;
  second_user_id uuid;
begin
  select participant_one_id, participant_two_id into first_user_id, second_user_id
  from public.conversations where id = new.conversation_id;

  if new.sender_id not in (first_user_id, second_user_id) then
    raise exception 'message sender is not a conversation participant';
  end if;

  if new.is_intro then
    if not exists (
      select 1 from public.contact_requests
      where status = 'pending'
        and requester_id = new.sender_id
        and addressee_id = case when first_user_id = new.sender_id then second_user_id else first_user_id end
        and intro_message is not null
    ) then
      raise exception 'intro message requires a pending contact request';
    end if;
  elsif not public.are_accepted_contacts(first_user_id, second_user_id) then
    raise exception 'messages require accepted contacts';
  end if;

  return new;
end;
$$;

create trigger messages_validate_insert before insert on public.messages
for each row execute function public.validate_message_insert();

alter table public.profiles enable row level security;
alter table public.account_profiles enable row level security;
alter table public.profile_media enable row level security;
alter table public.contact_requests enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy profiles_select_authenticated on public.profiles for select to authenticated using (true);
create policy profiles_insert_self on public.profiles for insert to authenticated with check (id = auth.uid());
create policy profiles_update_self on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_delete_self on public.profiles for delete to authenticated using (id = auth.uid());

create policy account_profiles_select_self on public.account_profiles for select to authenticated using (id = auth.uid());
create policy account_profiles_insert_self on public.account_profiles for insert to authenticated with check (id = auth.uid());
create policy account_profiles_update_self on public.account_profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy account_profiles_delete_self on public.account_profiles for delete to authenticated using (id = auth.uid());

create policy profile_media_select_allowed on public.profile_media
for select to authenticated using (
  profile_media.id = auth.uid()
  or exists (
    select 1 from public.contact_requests as accepted_contact
    where accepted_contact.status = 'accepted'
      and auth.uid() in (accepted_contact.requester_id, accepted_contact.addressee_id)
      and profile_media.id in (accepted_contact.requester_id, accepted_contact.addressee_id)
  )
);
create policy profile_media_insert_self on public.profile_media for insert to authenticated with check (id = auth.uid());
create policy profile_media_update_self on public.profile_media for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy profile_media_delete_self on public.profile_media for delete to authenticated using (id = auth.uid());

create policy contact_requests_select_involved on public.contact_requests for select to authenticated using (auth.uid() in (requester_id, addressee_id));
create policy contact_requests_insert_requester on public.contact_requests for insert to authenticated with check (requester_id = auth.uid());
create policy contact_requests_update_involved on public.contact_requests for update to authenticated using (auth.uid() in (requester_id, addressee_id)) with check (auth.uid() in (requester_id, addressee_id));
create policy contact_requests_delete_involved on public.contact_requests for delete to authenticated using (auth.uid() in (requester_id, addressee_id));

create policy conversations_select_participant on public.conversations for select to authenticated using (auth.uid() in (participant_one_id, participant_two_id));
create policy conversations_insert_participant on public.conversations for insert to authenticated with check (auth.uid() in (participant_one_id, participant_two_id));
create policy conversations_update_participant on public.conversations for update to authenticated using (auth.uid() in (participant_one_id, participant_two_id)) with check (auth.uid() in (participant_one_id, participant_two_id));
create policy conversations_delete_participant on public.conversations for delete to authenticated using (auth.uid() in (participant_one_id, participant_two_id));

create policy messages_select_participant on public.messages for select to authenticated using (public.is_conversation_participant(conversation_id));
create policy messages_insert_sender on public.messages for insert to authenticated with check (sender_id = auth.uid() and public.is_conversation_participant(conversation_id));
create policy messages_update_participant on public.messages for update to authenticated using (public.is_conversation_participant(conversation_id)) with check (public.is_conversation_participant(conversation_id));
create policy messages_delete_sender on public.messages for delete to authenticated using (sender_id = auth.uid());

revoke all on function public.is_conversation_participant(uuid) from public;
revoke all on function public.are_accepted_contacts(uuid, uuid) from public;
revoke all on function public.validate_message_insert() from public;
