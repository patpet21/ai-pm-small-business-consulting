-- Add the bilingual RIFORMA Method guide to the free Resource Library.
insert into public.resources (slug, title, description, category, resource_type, status, access_level, is_featured, sort_order)
values (
  'riforma-method',
  'The RIFORMA Method',
  'A practical bilingual guide to structure AI-assisted work with a clear repeatable method.',
  'AI & Prompting',
  'Method Guide',
  'available',
  'free_member',
  false,
  21
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
  ('en', 'English', 'The_RIFORMA_Method_AI_PM_Lab.pdf', 1),
  ('it', 'Italiano', 'Il_Metodo_RIFORMA_AI_PM_Lab_ITA.pdf', 2)
) as guide(language_code, language_label, file_name, sort_order)
where resource.slug = 'riforma-method'
on conflict (resource_id, language_code, file_name) do update set
  public_url = excluded.public_url,
  sort_order = excluded.sort_order;
