-- طالب ميسان: صفوف حالة التطبيق + تخزين ملفات الطباعة + سياسات القراءة/الكتابة
-- شغّل هذا الملف من: Supabase Dashboard → SQL Editor → Run

-- 1) زرع سجلات المحتوى الثابتة داخل جدول orders
insert into public.orders (
  id, student_name, phone, college, stage, delivery_type, delivery_address,
  notes, items, subtotal, delivery_fee, total_price, status
)
values
  ('APP-STATE-MATERIALS',  'SYSTEM', '00000000000', 'جامعة ميسان', '—', 'app_state_materials',     'ملازم الكليات',           'seed', '[]'::jsonb, 0, 0, 0, 'app_state'),
  ('APP-STATE-STATIONERY', 'SYSTEM', '00000000000', 'جامعة ميسان', '—', 'app_state_stationery',    'المستلزمات والقرطاسية',   'seed', '[]'::jsonb, 0, 0, 0, 'app_state'),
  ('APP-STATE-MARKET',     'SYSTEM', '00000000000', 'جامعة ميسان', '—', 'app_state_market',        'سوق المستعمل',            'seed', '[]'::jsonb, 0, 0, 0, 'app_state'),
  ('APP-STATE-PROJECTS',   'SYSTEM', '00000000000', 'جامعة ميسان', '—', 'app_state_projects',      'مشاريع التخرج',           'seed', '[]'::jsonb, 0, 0, 0, 'app_state'),
  ('APP-STATE-EXAMS',      'SYSTEM', '00000000000', 'جامعة ميسان', '—', 'app_state_exams',         'بنك الامتحانات',          'seed', '[]'::jsonb, 0, 0, 0, 'app_state'),
  ('APP-STATE-JOBS',       'SYSTEM', '00000000000', 'جامعة ميسان', '—', 'app_state_jobs',          'الوظائف الطلابية',        'seed', '[]'::jsonb, 0, 0, 0, 'app_state'),
  ('APP-STATE-DISCOUNTS',  'SYSTEM', '00000000000', 'جامعة ميسان', '—', 'app_state_discounts',     'خصومات الهوية',           'seed', '[]'::jsonb, 0, 0, 0, 'app_state'),
  ('APP-STATE-NOTICES',    'SYSTEM', '00000000000', 'جامعة ميسان', '—', 'app_state_announcements', 'لوحة الإعلانات',          'seed', '[]'::jsonb, 0, 0, 0, 'app_state')
on conflict (id) do nothing;

-- 2) سياسات جدول الطلبات (قراءة عامة + إدخال طلبات + تحديث الحالة والمحتوى)
alter table public.orders enable row level security;

drop policy if exists "Public read orders" on public.orders;
create policy "Public read orders"
  on public.orders for select
  using (true);

drop policy if exists "Public insert orders" on public.orders;
create policy "Public insert orders"
  on public.orders for insert
  with check (true);

drop policy if exists "Public update orders" on public.orders;
create policy "Public update orders"
  on public.orders for update
  using (true)
  with check (true);

drop policy if exists "Public delete orders" on public.orders;
create policy "Public delete orders"
  on public.orders for delete
  using (true);

-- 3) مجلد ملفات الطباعة
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'print-files',
  'print-files',
  true,
  26214400,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read print files" on storage.objects;
create policy "Public read print files"
  on storage.objects for select
  using (bucket_id = 'print-files');

drop policy if exists "Anyone can upload print files" on storage.objects;
create policy "Anyone can upload print files"
  on storage.objects for insert
  with check (bucket_id = 'print-files');

-- إن فشل الـ insert أعلاه بسبب صلاحيات storage.buckets، أنشئ المجلد يدوياً:
-- Storage → New bucket → الاسم print-files → Public bucket = ON → حد الحجم 25MB
