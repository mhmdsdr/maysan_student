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
  function registerStudent(studentData) {
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
      localStorage.setItem('taleb_maysan_student', JSON.stringify(newStudent));
      // Also save to all registered users list
      const savedUsers = JSON.parse(localStorage.getItem('taleb_maysan_users') || '[]');
      const updatedUsers = [newStudent, ...savedUsers.filter(u => u.phone !== newStudent.phone)];
      localStorage.setItem('taleb_maysan_users', JSON.stringify(updatedUsers));

      // Asynchronously backup to Supabase
      supabase.from('app_sync_state').upsert([
        { key: 'student_' + newStudent.phone, value: newStudent, updated_at: new Date().toISOString() }
      ]).then(() => {}).catch(() => {});
    } catch (e) {
      console.error('Error saving new student:', e);
    }

    return newStudent;
  }

  // Login an existing student or create a quick session
  function loginStudent(phone, pin = '') {
    try {
      const savedUsers = JSON.parse(localStorage.getItem('taleb_maysan_users') || '[]');
      const found = savedUsers.find(u => u.phone === phone);
      if (found) {
        setStudent(found);
        setIsLoggedIn(true);
        localStorage.setItem('taleb_maysan_student', JSON.stringify(found));
        return { success: true, student: found };
      }
    } catch (e) {
      console.error('Error in loginStudent:', e);
    }

    // If not found in local, create a fast ready profile with this phone so student isn't blocked
    const quickStudent = {
      name: 'طالب ميسان',
      university: 'جامعة ميسan',
      college: 'كلية الهندسة',
      department: 'عام',
      stage: 'المرحلة الأولى',
      fromDistrict: 'العمارة',
      phone: phone,
      studentId: 'MU-2024-' + Math.floor(1000 + Math.random() * 9000),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      gpa: 'طالب جامعي',
      isGuest: false,
    };

    setStudent(quickStudent);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('taleb_maysan_student', JSON.stringify(quickStudent));
    } catch (e) {
      console.error(e);
    }
    return { success: true, student: quickStudent };
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
