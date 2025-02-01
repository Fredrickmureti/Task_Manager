import React from 'react';
import { Home, BarChart2, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const location = useLocation();

  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/dashboard', icon: BarChart2, label: 'Dashboard' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:left-0 md:top-0 md:h-screen md:w-64 bg-white dark:bg-gray-800 border-t md:border-r border-gray-200 dark:border-gray-700">
      <div className="flex md:flex-col items-center justify-around md:justify-start p-4 h-full">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center p-2 rounded-lg transition-colors ${
              location.pathname === to
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="hidden md:block ml-3">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}