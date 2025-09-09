import { Link, useLocation } from 'react-router-dom';
import { Book, User, Users, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { darkMode } = useTheme();

  const navItems = [
    { path: '/', icon: Book, label: 'Курсы' },
    { path: '/progress', icon: User, label: 'Прогресс' },
    { path: '/rabbi', icon: Users, label: 'Раввин' },
    { path: '/settings', icon: Settings, label: 'Настройки' },
  ];

  const backgroundClass = darkMode
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    : 'bg-gradient-to-br from-blue-50 via-white to-purple-50';

  return (
    <div className={`min-h-screen flex flex-col ${backgroundClass} transition-colors duration-500`}>
      <main className="flex-1 pb-20">
        {children}
      </main>
      
      <nav className={`fixed bottom-0 left-0 right-0 border-t backdrop-blur-lg ${
        darkMode 
          ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-slate-600' 
          : 'bg-white/90 border-gray-200 shadow-lg'
      }`}>
        <div className="flex justify-around items-center py-3">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 ${
                location.pathname === path
                  ? darkMode 
                    ? 'text-blue-400 bg-blue-500/10 shadow-lg'
                    : 'text-blue-600 bg-blue-100 shadow-lg'
                  : darkMode
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1 font-semibold">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}