import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const AppDataContext = createContext(null);

const CLOUD_RECORDS = {
  materials:     { id: 'APP-STATE-MATERIALS',  deliveryType: 'app_state_materials',      label: 'ملازم الكليات' },
  stationery:    { id: 'APP-STATE-STATIONERY', deliveryType: 'app_state_stationery',     label: 'المستلزمات والقرطاسية' },
  market:        { id: 'APP-STATE-MARKET',     deliveryType: 'app_state_market',         label: 'سوق المستعمل' },
  projects:      { id: 'APP-STATE-PROJECTS',   deliveryType: 'app_state_projects',       label: 'مشاريع التخرج' },
  exams:         { id: 'APP-STATE-EXAMS',      deliveryType: 'app_state_exams',          label: 'بنك الامتحانات' },
  jobs:          { id: 'APP-STATE-JOBS',       deliveryType: 'app_state_jobs',           label: 'الوظائف الطلابية' },
  discounts:     { id: 'APP-STATE-DISCOUNTS',  deliveryType: 'app_state_discounts',      label: 'خصومات الهوية' },
  announcements: { id: 'APP-STATE-NOTICES',    deliveryType: 'app_state_announcements',  label: 'لوحة الإعلانات' },
};

function parseItems(items) {
  if (Array.isArray(items)) return items.filter(Boolean);
  if (typeof items === 'string') {
    try {
      return parseItems(JSON.parse(items));
    } catch {
      return [];
    }
  }
  if (items && typeof items === 'object') {
    if (items.id || items.title) return [items];
    return Object.values(items).filter((x) => x && typeof x === 'object');
  }
  return [];
}

function examFromRow(row) {
  const fromItems = parseItems(row.items)[0];
  if (fromItems && (fromItems.title || fromItems.fileUrl)) {
    return { ...fromItems, id: fromItems.id || row.id };
  }
  try {
    const fromNotes = JSON.parse(row.notes || '');
    if (fromNotes && fromNotes.title) return { ...fromNotes, id: fromNotes.id || row.id };
  } catch {
    /* notes is plain text */
  }
  if (!row.student_name || row.student_name === 'SYSTEM') return null;
  return {
    id: row.id,
    title: row.student_name,
    college: row.college,
    stage: row.stage,
    fileUrl: row.delivery_address || '',
    fileName: row.notes || '',
    year: '',
    downloadsCount: 0,
    rating: 5.0,
  };
}

function mergedState(rows, deliveryType, recordId) {
  const matches = rows.filter((o) => o.id === recordId || o.delivery_type === deliveryType);
  const byId = new Map();
  for (const rec of matches) {
    for (const item of parseItems(rec.items)) {
      const key = item?.id || item?.title;
      if (key) byId.set(key, item);
    }
  }
  return Array.from(byId.values());
}

export function AppDataProvider({ children }) {
  const [materials, setMaterials] = useState([]);
  const [stationery, setStationery] = useState([]);
  const [usedMarket, setUsedMarket] = useState([]);
  const [pastProjects, setPastProjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [cloudOrders, setCloudOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [syncStatus, setSyncStatus] = useState(null);

  function statePayload(rec, items = []) {
    return {
      student_name: 'SYSTEM',
      phone: '00000000000',
      college: 'جامعة ميسان',
      stage: '—',
      delivery_type: rec.deliveryType,
      delivery_address: rec.label,
      notes: 'آخر تحديث: ' + new Date().toISOString(),
      items,
      subtotal: 0,
      delivery_fee: 0,
      total_price: 0,
      status: 'app_state',
    };
  }

  const fetchCloudData = useCallback(async (options = { showLoading: true }) => {
    if (options.showLoading) setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Cloud fetch error:', error);
        setSyncStatus({
          type: 'error',
          message: 'تعذر تحميل البيانات من السحابة: ' + (error.message || 'خطأ غير معروف'),
        });
        return;
      }

      if (!data) return;

      let rows = data;
      const missing = Object.values(CLOUD_RECORDS).filter(
        (rec) => !rows.some((o) => o.id === rec.id || o.delivery_type === rec.deliveryType)
      );
      if (missing.length) {
        const seed = await supabase.from('orders').insert(
          missing.map((rec) => ({ id: rec.id, ...statePayload(rec) }))
        );
        if (seed.error) {
          await supabase.from('orders').insert(
            missing.map((rec) => ({
              id: crypto.randomUUID ? crypto.randomUUID() : rec.id + '-' + Date.now(),
              ...statePayload(rec),
            }))
          );
        }
        const { data: seeded } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (seeded) rows = seeded;
      }

      const isCatalog = (type) => type === 'catalog_exam' || type?.startsWith('catalog_');
      const actualOrders = rows.filter(
        (o) =>
          !o.delivery_type?.startsWith('app_state_') &&
          !isCatalog(o.delivery_type) &&
          o.delivery_type !== 'student_profile' &&
          o.status !== 'app_state' &&
          o.status !== 'student_profile'
      );
      setCloudOrders(actualOrders);

      setMaterials(mergedState(rows, CLOUD_RECORDS.materials.deliveryType, CLOUD_RECORDS.materials.id));
      setStationery(mergedState(rows, CLOUD_RECORDS.stationery.deliveryType, CLOUD_RECORDS.stationery.id));
      setUsedMarket(mergedState(rows, CLOUD_RECORDS.market.deliveryType, CLOUD_RECORDS.market.id));
      setPastProjects(mergedState(rows, CLOUD_RECORDS.projects.deliveryType, CLOUD_RECORDS.projects.id));
      setJobs(mergedState(rows, CLOUD_RECORDS.jobs.deliveryType, CLOUD_RECORDS.jobs.id));
      setDiscounts(mergedState(rows, CLOUD_RECORDS.discounts.deliveryType, CLOUD_RECORDS.discounts.id));
      setAnnouncements(mergedState(rows, CLOUD_RECORDS.announcements.deliveryType, CLOUD_RECORDS.announcements.id));

      const catalogExams = rows
        .filter((o) => o.delivery_type === 'catalog_exam' && o.status !== 'catalog_removed')
        .map(examFromRow)
        .filter(Boolean);
      const blobExams = mergedState(rows, CLOUD_RECORDS.exams.deliveryType, CLOUD_RECORDS.exams.id);
      const examMap = new Map();
      for (const exam of [...blobExams, ...catalogExams]) {
        if (exam?.id) examMap.set(exam.id, exam);
        else if (exam?.title) examMap.set(exam.title, exam);
      }
      setExams(Array.from(examMap.values()));
    } catch (e) {
      console.error('Error loading cloud data:', e);
      setSyncStatus({
        type: 'error',
        message: 'تعذر الاتصال بالسحابة. تحقق من الإنترنت ومفاتيح Supabase.',
      });
    } finally {
      if (options.showLoading) setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    fetchCloudData();

    const channel = supabase
      .channel('app_state_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchCloudData({ showLoading: false });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [fetchCloudData]);

  async function syncToCloud(recordKey, updatedList) {
    const rec = CLOUD_RECORDS[recordKey];
    if (!rec) {
      setSyncStatus({ type: 'error', message: 'سجل السحابة غير معروف.' });
      return false;
    }

    const payload = statePayload(rec, updatedList);

    try {
      const upserted = await supabase
        .from('orders')
        .upsert({ id: rec.id, ...payload }, { onConflict: 'id' })
        .select('id');

      const patched = await supabase
        .from('orders')
        .update({ items: updatedList, notes: payload.notes })
        .eq('delivery_type', rec.deliveryType)
        .select('id');

      const saved = (upserted.data && upserted.data.length) || (patched.data && patched.data.length);
      if (!saved) {
        const snapshotId = crypto.randomUUID ? crypto.randomUUID() : rec.id + '-' + Date.now();
        const inserted = await supabase
          .from('orders')
          .insert({ id: snapshotId, ...payload })
          .select('id');

        if (inserted.error || !inserted.data?.length) {
          console.error('Cloud sync error:', rec.id, upserted.error || patched.error || inserted.error);
          setSyncStatus({
            type: 'error',
            message:
              'فشل الحفظ في السحابة: ' +
              (inserted.error?.message || upserted.error?.message || patched.error?.message || 'شغّل supabase/setup.sql'),
          });
          return false;
        }
      }

      setSyncStatus({ type: 'success', message: 'تم النشر للجميع على السحابة' });
      await fetchCloudData({ showLoading: false });
      return true;
    } catch (err) {
      console.error('Failed to sync to cloud:', rec.id, err);
      setSyncStatus({
        type: 'error',
        message: 'فشل الاتصال بالسحابة أثناء الحفظ.',
      });
      return false;
    }
  }

  async function mutateList(setter, recordKey, updater) {
    let snapshot;
    let next;
    setter((current) => {
      snapshot = current;
      next = updater(current);
      return next;
    });

    setSyncStatus({ type: 'saving', message: 'جاري الحفظ في السحابة...' });
    const ok = await syncToCloud(recordKey, next);
    if (!ok) {
      setter(snapshot);
      return false;
    }
    return true;
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (!error) {
        setCloudOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
        return true;
      }
      setSyncStatus({ type: 'error', message: 'تعذر تحديث حالة الطلب.' });
      return false;
    } catch (e) {
      console.error('Error updating order:', e);
      return false;
    }
  }

  async function addExam(item) {
    const exam = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'EX-' + Date.now(),
      downloadsCount: 0,
      rating: 5.0,
      ...item,
    };

    setSyncStatus({ type: 'saving', message: 'جاري نشر الامتحان للطلبة...' });

    const row = {
      id: exam.id,
      student_name: exam.title,
      phone: '00000000000',
      college: exam.college || 'جامعة ميسان',
      stage: exam.stage || '—',
      delivery_type: 'catalog_exam',
      delivery_address: exam.fileUrl || '',
      notes: JSON.stringify(exam),
      items: [exam],
      subtotal: 0,
      delivery_fee: 0,
      total_price: 0,
      status: 'catalog',
    };

    let { error } = await supabase.from('orders').insert(row).select('id');
    if (error) {
      const retry = await supabase
        .from('orders')
        .insert({ ...row, id: crypto.randomUUID ? crypto.randomUUID() : 'EX-' + Date.now() })
        .select('id');
      error = retry.error;
    }

    if (error) {
      setSyncStatus({ type: 'error', message: 'فشل نشر الامتحان: ' + error.message });
      return false;
    }

    setExams((prev) => [exam, ...prev]);
    await syncToCloud('exams', [exam, ...exams.filter((e) => e.id !== exam.id)]);
    setSyncStatus({ type: 'success', message: 'تم نشر الامتحان لكل الأجهزة' });
    await fetchCloudData({ showLoading: false });
    return true;
  }

  async function deleteExam(id) {
    await supabase.from('orders').delete().eq('id', id);
    await supabase.from('orders').update({ status: 'catalog_removed' }).eq('id', id);
    return mutateList(
      setExams,
      'exams',
      (prev) => prev.filter((e) => e.id !== id)
    );
  }

  const addMaterial = (item) => mutateList(setMaterials, 'materials', (prev) => [{ id: 'MAT-' + Date.now(), downloads: 0, rating: 5.0, ...item }, ...prev]);
  const deleteMaterial = (id) => mutateList(setMaterials, 'materials', (prev) => prev.filter((m) => m.id !== id));

  const addStationery = (item) => mutateList(setStationery, 'stationery', (prev) => [{ id: 'ST-' + Date.now(), ...item }, ...prev]);
  const deleteStationery = (id) => mutateList(setStationery, 'stationery', (prev) => prev.filter((s) => s.id !== id));

  const addMarketItem = (item) => mutateList(setUsedMarket, 'market', (prev) => [{ id: 'UM-' + Date.now(), time: 'الآن', verified: true, ...item }, ...prev]);
  const deleteMarketItem = (id) => mutateList(setUsedMarket, 'market', (prev) => prev.filter((m) => m.id !== id));

  const addProject = (item) => mutateList(setPastProjects, 'projects', (prev) => [{ id: 'GP-' + Date.now(), downloads: 0, ...item }, ...prev]);
  const deleteProject = (id) => mutateList(setPastProjects, 'projects', (prev) => prev.filter((p) => p.id !== id));

  const addJob = (item) => mutateList(setJobs, 'jobs', (prev) => [{ id: 'JOB-' + Date.now(), ...item }, ...prev]);
  const deleteJob = (id) => mutateList(setJobs, 'jobs', (prev) => prev.filter((j) => j.id !== id));

  const addDiscount = (item) => mutateList(setDiscounts, 'discounts', (prev) => [{ id: 'D-' + Date.now(), ...item }, ...prev]);
  const deleteDiscount = (id) => mutateList(setDiscounts, 'discounts', (prev) => prev.filter((d) => d.id !== id));

  const addAnnouncement = (item) => mutateList(setAnnouncements, 'announcements', (prev) => [{ id: 'NOT-' + Date.now(), time: 'الآن', ...item }, ...prev]);
  const deleteAnnouncement = (id) => mutateList(setAnnouncements, 'announcements', (prev) => prev.filter((a) => a.id !== id));

  return (
    <AppDataContext.Provider value={{
      materials,
      stationery,
      usedMarket,
      pastProjects,
      exams,
      jobs,
      discounts,
      announcements,
      cloudOrders,
      loadingOrders,
      syncStatus,
      fetchCloudOrders: fetchCloudData,
      updateOrderStatus,

      addMaterial, deleteMaterial,
      addStationery, deleteStationery,
      addMarketItem, deleteMarketItem,
      addProject, deleteProject,
      addExam, deleteExam,
      addJob, deleteJob,
      addDiscount, deleteDiscount,
      addAnnouncement, deleteAnnouncement,
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used within an AppDataProvider');
  return context;
}
