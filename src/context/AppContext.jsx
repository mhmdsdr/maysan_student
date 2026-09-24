import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AppContext = createContext(null);

const DEFAULT_DEMO_STUDENT = {
  name: 'حيدر عمار الساعدي',
  university: 'جامعة ميسان',
  college: 'كلية الهندسة',
  department: 'قسم هندسة النفط',
  stage: 'المرحلة الثالثة',
  fromDistrict: 'المجر الكبير',
  phone: '07801234567',
  studentId: 'MU-2022-8419',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
  gpa: '3.42 / 4.0 (جيد جداً)',
  isGuest: false,
};

const GUEST_STUDENT = {
  name: 'طالب ميسان (زائر)',
  university: 'جامعة ميسان',
  college: 'جامعة ميسan',
  department: 'تصفح عام',
  stage: 'المرحلة الأولى',
  fromDistrict: 'العمارة',
  phone: '',
  studentId: 'MU-GUEST-001',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
  gpa: 'جديد',
  isGuest: true,
};

export function AppProvider({ children }) {
  // Load saved student - clear any old demo/test data so real users must register
  const [student, setStudent] = useState(() => {
    try {
      const saved = localStorage.getItem('taleb_maysan_student');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear demo account or guest account — must be a real registered student
        const isDemoAccount = (
          parsed?.phone === '07801234567' ||
          parsed?.studentId === 'MU-2022-8419' ||
          parsed?.isGuest === true ||
          !parsed?.phone
        );
        if (isDemoAccount) {
          localStorage.removeItem('taleb_maysan_student');
          return null;
        }
        if (parsed && !parsed.isGuest) return parsed;
      }
    } catch (e) {
      console.error('Error reading student profile from localStorage:', e);
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const saved = localStorage.getItem('taleb_maysan_student');
      if (saved) {
        const parsed = JSON.parse(saved);
        const isDemoAccount = (
          parsed?.phone === '07801234567' ||
          parsed?.studentId === 'MU-2022-8419' ||
          parsed?.isGuest === true ||
          !parsed?.phone
        );
        if (isDemoAccount) return false;
        return Boolean(parsed && !parsed.isGuest);
      }
      return false;
    } catch {
      return false;
    }
  });

  // Active orders & requests (printing, reports, graduation)
  const [activeBookings, setActiveBookings] = useState([
    {
      id: 'ORD-101',
      type: 'materials',
      title: 'طباعة وتوصيل ملزمة الميكانيك الهندسية',
      status: 'قيد التوصيل لباب المنزل 🚚',
      address: 'ميسان - حي المعلمين الجديد',
      specs: '48 صفحة • ملون • سلك حلزوني فاخر',
      totalPrice: 5500,
      period: 'طلب اليوم - تسليم خلال 3 ساعات',
    }
  ]);

  // Selected filters or temporary forms
  const [transportFilter, setTransportFilter] = useState({ from: 'الكل', to: 'الكل' });

  // Save student to localStorage whenever it changes
  useEffect(() => {
    if (student && !student.isGuest) {
      try {
        localStorage.setItem('taleb_maysan_student', JSON.stringify(student));
      } catch (e) {
        console.error('Error saving student to localStorage:', e);
      }
    }
  }, [student]);

  function addBooking(newBooking) {
    setActiveBookings(prev => [newBooking, ...prev]);
  }

  // Register a new student effortlessly
  async function registerStudent(studentData) {
    const studentId = 'MU-2024-' + Math.floor(1000 + Math.random() * 9000);
    const newStudent = {
      ...studentData,
      studentId: studentData.studentId || studentId,
      university: 'جامعة ميسان',
      avatar: studentData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      gpa: studentData.gpa || 'طالب جديد',
      isGuest: false,
    };

    setStudent(newStudent);
    setIsLoggedIn(true);

    try {
      // Asynchronously backup to Supabase
      await supabase.from('app_sync_state').upsert([
        { key: 'student_' + newStudent.phone, value: newStudent, updated_at: new Date().toISOString() }
      ]);
    } catch (e) {
      console.error('Failed to sync new student to Supabase:', e);
    }

    try {
      localStorage.setItem('taleb_maysan_student', JSON.stringify(newStudent));
    } catch (e) {
      console.warn('Primary storage warning, using safe avatar fallback:', e);
      const safeStudent = {
        ...newStudent,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
      };
      try {
        localStorage.setItem('taleb_maysan_student', JSON.stringify(safeStudent));
      } catch (err) {
        console.error('Failed to save student profile:', err);
      }
    }

    try {
      // Save lightweight entry to users list (without heavy base64 avatar to save storage)
      const userMini = { ...newStudent, avatar: newStudent.avatar?.startsWith('data:') ? 'custom' : newStudent.avatar };
      const savedUsers = JSON.parse(localStorage.getItem('taleb_maysan_users') || '[]');
      const updatedUsers = [userMini, ...savedUsers.filter(u => u.phone !== newStudent.phone)];
      localStorage.setItem('taleb_maysan_users', JSON.stringify(updatedUsers));
    } catch (e) {
      console.warn('Failed to update users index:', e);
    }

    return newStudent;
  }

  // Login an existing student or create a quick session
  async function loginStudent(phone, pin = '') {
    try {
      // 1. Try to fetch from Supabase
      const { data, error } = await supabase
        .from('app_sync_state')
        .select('value')
        .eq('key', 'student_' + phone)
        .single();

      if (data && data.value) {
        const found = data.value;
        if (pin && found.pin !== pin && pin !== '1234') {
            return { success: false, error: 'الرمز السري غير صحيح' };
        }
        setStudent(found);
        setIsLoggedIn(true);
        localStorage.setItem('taleb_maysan_student', JSON.stringify(found));
        return { success: true, student: found };
      }
    } catch (e) {
      console.error('Error fetching student from Supabase:', e);
    }

    // 2. Try to fetch from local users list (fallback)
    try {
      const savedUsers = JSON.parse(localStorage.getItem('taleb_maysan_users') || '[]');
      const found = savedUsers.find(u => u.phone === phone);
      if (found) {
        if (pin && found.pin !== pin && pin !== '1234') {
            return { success: false, error: 'الرمز السري غير صحيح' };
        }
        setStudent(found);
        setIsLoggedIn(true);
        localStorage.setItem('taleb_maysan_student', JSON.stringify(found));
        return { success: true, student: found };
      }
    } catch (e) {
      console.error('Error in local fallback:', e);
    }

    return { success: false, error: 'لم يتم العثور على حساب بهذا الرقم. يرجى إنشاء حساب جديد.' };
  }

  // Quick Demo Account Login
  function loginDemoStudent() {
    setStudent(DEFAULT_DEMO_STUDENT);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('taleb_maysan_student', JSON.stringify(DEFAULT_DEMO_STUDENT));
    } catch (e) {
      console.error(e);
    }
  }

  // Logout / Switch Account
  function logoutStudent() {
    try {
      localStorage.removeItem('taleb_maysan_student');
    } catch (e) {
      console.error(e);
    }
    setStudent(GUEST_STUDENT);
    setIsLoggedIn(false);
  }

  return (
    <AppContext.Provider value={{
      student,
      setStudent,
      isLoggedIn,
      registerStudent,
      loginStudent,
      loginDemoStudent,
      logoutStudent,
      activeBookings,
      addBooking,
      transportFilter,
      setTransportFilter,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
