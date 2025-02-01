import React from 'react';
import { ThemeToggle } from '../components/ThemeToggle';

export function Settings() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Settings
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Theme Preferences
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Toggle between light and dark mode
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}