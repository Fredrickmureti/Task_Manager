import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to <span className="text-blue-600 dark:text-blue-400">Dashboard</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          A modern, responsive dashboard built with React and Tailwind CSS.
          Experience seamless navigation, real-time updates, and beautiful visualizations.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}