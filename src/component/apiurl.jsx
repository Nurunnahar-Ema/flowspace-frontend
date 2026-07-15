import axios from 'axios';
import Cookies from 'js-cookie';

const url = window.location.hostname === "127.0.0.1" || 
            window.location.hostname === "localhost" || 
            window.location.hostname === "192.168.0.103"
    ? "http://127.0.0.1:8787" 
    : "https://flowspace.piipra.me";

const api = axios.create({
  baseURL: url,
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    let token = null;

    // ১. রুট অনুযায়ী সঠিক টোকেনটি বাছাই করা (যাতে একটি আরেকটিকে ওভাররাইট না করে)
    if (config.url.includes('/admin/')) {
      token = Cookies.get('admin_auth_token');
    } else if (config.url.includes('/teacher/')) {
      token = Cookies.get('teacher_auth');
    } else {
      // ডিফল্ট হিসেবে স্টুডেন্ট টোকেন
      token = Cookies.get('student_auth');
    }

    // ২. হেডার সেট করা (টোকেন থাকলেই কেবল সেট হবে)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ৫. রেসপন্স ইন্টারসেপ্টর (৪০১ আসলে অটো হ্যান্ডলিং)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // টোকেন নষ্ট বা এক্সপায়ার হলে সেশন ক্লিয়ার করে লগইন পেজে রিডাইরেক্ট করতে পারেন
      // Cookies.remove('admin_auth_token');
      // window.location.href = '/admin/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;