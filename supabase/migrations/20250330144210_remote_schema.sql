create policy "Enable insert for authenticated users only"
on "public"."publishForms"
as permissive
for insert
to authenticated
with check (true);

create policy "Enable read access for all users"
on "public"."publishForms"
as permissive
for select
to public
using (true);
