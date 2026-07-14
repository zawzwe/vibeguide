drop trigger if exists on_auth_user_created_trial_credits on auth.users;
drop function if exists public.handle_new_user_trial_credits();

create function public.handle_new_user_trial_credits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.credits (user_id, balance, updated_at)
  values (new.id, 2, now())
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created_trial_credits
after insert on auth.users
for each row
execute function public.handle_new_user_trial_credits();

insert into public.credits (user_id, balance, updated_at)
select u.id, 2, now()
from auth.users u
left join public.credits c on c.user_id = u.id
where c.user_id is null;
