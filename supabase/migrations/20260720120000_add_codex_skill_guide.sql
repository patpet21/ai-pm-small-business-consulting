-- Add the bilingual Codex Skill guide near the existing active member resources.
update public.resources
set sort_order = sort_order + 1,
    updated_at = now()
where sort_order >= 12
  and not exists (
    select 1 from public.resources existing
    where existing.slug = 'create-install-codex-skill'
  );

insert into public.resources (slug, title, description, category, resource_type, status, access_level, is_featured, sort_order)
values (
  'create-install-codex-skill',
  'Create & Install a Codex Skill',
  'A bilingual practical guide for creating, installing, and using Codex skills in a repeatable workflow.',
  'AI & Prompting',
  'Skill Guide',
  'available',
  'free_member',
  false,
  12
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
  ('en', 'English', 'Guide_Create_Install_Codex_Skill_AI_PM_Lab_ENG.pdf', 1),
  ('it', 'Italiano', 'Guida_Creare_Installare_Skill_Codex_AI_PM_Lab_ITA.pdf', 2)
) as guide(language_code, language_label, file_name, sort_order)
where resource.slug = 'create-install-codex-skill'
on conflict (resource_id, language_code, file_name) do update set
  public_url = excluded.public_url,
  sort_order = excluded.sort_order;
