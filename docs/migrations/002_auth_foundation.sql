create or replace function public.resolve_username_email(p_username text)
returns table(email text)
language sql
stable
security definer
set search_path = public
as $$
  select account.email
  from public.profiles as profile
  join public.account_profiles as account on account.id = profile.id
  where lower(profile.username) = lower(trim(p_username))
  limit 1;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_username text;
  profile_display_name text;
begin
  profile_username = lower(trim(new.raw_user_meta_data ->> 'username'));
  profile_display_name = trim(new.raw_user_meta_data ->> 'display_name');

  if profile_username is null or profile_username = '' then
    raise exception 'username is required';
  end if;

  if profile_display_name is null or profile_display_name = '' then
    raise exception 'display name is required';
  end if;

  insert into public.profiles (id, username, display_name)
  values (new.id, profile_username, profile_display_name);

  insert into public.account_profiles (id, email)
  values (new.id, lower(trim(new.email)));

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

revoke all on function public.resolve_username_email(text) from public;
grant execute on function public.resolve_username_email(text) to anon, authenticated;
