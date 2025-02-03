import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { TaskProvider } from './context/TaskContext';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Goals } from './pages/Goals';
import { Activities } from './pages/Activities';
import { Reminders } from './pages/Reminders';
import { Settings } from './pages/Settings';
import { Calendar } from './components/Calendar';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <NotificationProvider>
          <TaskProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
              <Navigation />
              <main className="md:ml-64 pb-16 md:pb-0">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/goals" element={<Goals />} />
                  <Route path="/activities" element={<Activities />} />
                  <Route path="/reminders" element={<Reminders />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/calendar" element={<Calendar />} />
                </Routes>
              </main>
            </div>
          </TaskProvider>
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;