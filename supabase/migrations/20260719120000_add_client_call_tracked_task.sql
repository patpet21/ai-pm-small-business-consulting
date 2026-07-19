-- Add the bilingual Client Call to Tracked Task guide near the existing active member resources.
update public.resources
set sort_order = sort_order + 1,
    updated_at = now()
where sort_order >= 11
  and not exists (
    select 1 from public.resources existing
    where existing.slug = 'client-call-to-tracked-task'
  );

insert into public.resources (slug, title, description, category, resource_type, status, access_level, is_featured, sort_order)
values (
  'client-call-to-tracked-task',
  'From Client Call to Tracked Task',
  'Turn client call notes into clear tracked tasks with owners, deadlines, status, and next actions.',
  'Professional Communication',
  'Workflow Guide',
  'available',
  'free_member',
  false,
  11
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  category = excluded.category,
  resource_type = excluded.resource_type,
  status = excluded.status,
  access_level = excluded.access_level,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.resource_files (resource_id, language_code, language_label, file_name, public_url, sort_order)
select resource.id, guide.language_code, guide.language_label, guide.file_name, '/downloads/' || guide.file_name, guide.sort_order
from public.resources resource
cross join (values
  ('en', 'English', 'From_Client_Call_to_Tracked_Task_AI_PM_Lab_EN.pdf', 1),
  ('it', 'Italiano', 'Dalla_Chiamata_al_Task_Tracciato_AI_PM_Lab_ITA.pdf', 2)
) as guide(language_code, language_label, file_name, sort_order)
where resource.slug = 'client-call-to-tracked-task'
on conflict (resource_id, language_code, file_name) do update set
  public_url = excluded.public_url,
  sort_order = excluded.sort_order;
