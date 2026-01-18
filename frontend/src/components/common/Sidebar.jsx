import React, { useState } from 'react';
import {
  User,
  Settings,
  LogOut,
  BookOpen,
  ShoppingCart,
  Plus,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';

export function Sidebar({
  isInstructor,
  currentPage,
  onNavigate,
  onShowLogoutModal,
}) {
  const [open, setOpen] = useState(false);

  const studentItems = [
    { name: 'My Profile', page: 'profile', icon: User },
    { name: 'Enrolled Courses', page: 'enrolled-courses', icon: BookOpen },
    { name: 'Your Cart', page: 'cart', icon: ShoppingCart },
    { name: 'Settings', page: 'settings', icon: Settings },
  ];

  const instructorItems = [
    { name: 'Dashboard', page: 'instructor-dashboard', icon: BarChart3 },
    { name: 'My Courses', page: 'my-courses', icon: BookOpen },
    { name: 'Add Course', page: 'add-course', icon: Plus },
    { name: 'Settings', page: 'settings', icon: Settings },
  ];

  const items = isInstructor ? instructorItems : studentItems;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/50 hover:bg-cyan-600 transition-colors"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 p-6 z-30 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between md:justify-center">
            <h2 className="text-lg font-bold text-cyan-400">Menu</h2>
            <button
              onClick={() => setOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.page
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-slate-700 pt-4">
            <button
              onClick={() => {
                onShowLogoutModal();
                setOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
