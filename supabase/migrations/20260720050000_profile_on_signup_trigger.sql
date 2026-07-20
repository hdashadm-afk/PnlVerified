-- Fixes signup: supabase.auth.signUp() does not establish a session until the user
-- confirms their email (mailer_autoconfirm is off on this project), so a client-side
-- insert into public.profiles right after signUp() runs unauthenticated and fails the
-- `id = auth.uid()` RLS check. Standard Supabase fix: create the profile from a
-- SECURITY DEFINER trigger on auth.users, which runs with elevated privileges
-- regardless of session state, reading full_name/role from signup metadata.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'accounting_head')
  );
  return new;
end;
$function$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
