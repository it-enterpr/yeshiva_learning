import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, User, Users, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Book, label: 'Courses' },
    { path: '/progress', icon: User, label: 'Progress' },
    { path: '/rabbi', icon: Users, label: 'Rabbi Panel' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <main className="flex-1 pb-20">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                location.pathname === path
                  ? 'text-blue-500'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}