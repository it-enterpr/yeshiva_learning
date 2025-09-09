import { Link, useLocation } from 'react-router-dom';
import { Book, User, Users, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Book, label: 'Курсы' },
    { path: '/progress', icon: User, label: 'Прогресс' },
    { path: '/rabbi', icon: Users, label: 'Раввин' },
    { path: '/settings', icon: Settings, label: 'Настройки' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <main className="flex-1 pb-20">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-800 to-slate-900 border-t border-slate-600 backdrop-blur-lg">
        <div className="flex justify-around items-center py-3">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 ${
                location.pathname === path
                  ? 'text-blue-400 bg-blue-500/10 shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}