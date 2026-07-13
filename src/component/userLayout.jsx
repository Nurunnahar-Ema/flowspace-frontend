import  { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export const UserLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setOpen(!open);

  const sidebarItems = [
    { key: '/admin/dashboard', label: 'ড্যাশবোর্ড', icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
      </svg>
    )},
    { key: '/admin/courses', label: 'কোর্স', icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M4 19.5A2.5 2.5 0 006.5 22h11a2.5 2.5 0 002.5-2.5V6H4v13.5zM20 4h-4l-2-2h-4l-2 2H4v2h16V4z"/>
      </svg>
    )},
    { key: '/admin/studentInfo', label: 'স্টুডেন্ট প্রোফাইল', icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
      </svg>
    )},
    { key: '/admin/profile', label: 'এডমিন প্রোফাইল', icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M6 4h12v2H6V4zm0 4h12v2H6V8zm0 4h12v2H6v-2zm0 4h12v2H6v-2z"/>
      </svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Header */}
      <header className="fixed top-0 w-full h-16 bg-white shadow-sm flex items-center justify-between px-5 z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded hover:bg-slate-100 transition"
          >
            {/* Menu Icon */}
            <svg className="h-6 w-6 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M3 6h18M3 12h18M3 18h18"/>
            </svg>
          </button>
          <img 
            src="https://piipra.me/logo%20(4).png" 
            alt="Logo" 
            className="h-8 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          />
        </div>
        <div>
          <div 
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white cursor-pointer"
            onClick={() => navigate('/admin/profile')}
          >
            {/* User Icon */}
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
            </svg>
          </div>
        </div>
      </header>

      {/* Sidebar Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 font-bold border-b">মেনুবার</div>
        <nav className="flex flex-col p-2">
          {sidebarItems.map(item => (
            <button
              key={item.key}
              onClick={() => { navigate(item.key); setOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-left transition 
                ${location.pathname === item.key ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-slate-100 text-slate-700'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overlay for Drawer */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/30 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Content */}
      <main className="flex-1 mt-16 p-6">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
