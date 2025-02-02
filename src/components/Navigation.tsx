import React, { useState } from 'react';
import { Home, BarChart2, Settings, Menu, X, Target, Timer, Bell, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/dashboard', icon: BarChart2, label: 'Dashboard' },
    { to: '/goals', icon: Target, label: 'Daily Goals' },
    { to: '/activities', icon: Timer, label: 'Activities' },
    { to: '/reminders', icon: Bell, label: 'Reminders' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Navigation Sidebar */}
      <nav
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? 'md:w-64 w-64' : 'w-20'
        } transition-all duration-300 ease-in-out z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg ${
          !isOpen && 'md:translate-x-0 -translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className={`text-xl font-bold text-gray-800 dark:text-white transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'
            }`}>
              {isOpen ? 'TaskMaster Pro' : 'TM'}
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            {links.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors relative group ${
                  location.pathname === to
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
                <span className={`font-medium whitespace-nowrap transition-all duration-300 ${
                  isOpen ? 'opacity-100 w-auto' : 'md:opacity-0 md:w-0 hidden md:block'
                }`}>
                  {label}
                </span>
                
                {/* Tooltip for collapsed state */}
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap">
                    {label}
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Collapse Button (Desktop) */}
          <div className="hidden md:block p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isOpen ? (
                <>
                  <X className="w-5 h-5 mr-2" />
                  <span>Collapse</span>
                </>
              ) : (
                <Menu className="w-5 h-5 mx-auto" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
      />
    </>
  );
}