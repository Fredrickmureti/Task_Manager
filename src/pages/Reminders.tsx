import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash, Calendar } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNotification } from '../context/NotificationContext';

interface Reminder {
  id: string;
  title: string;
  description: string;
  datetime: string;
  completed: boolean;
  createdAt: Date;
}

export function Reminders() {
  const [reminders, setReminders] = useLocalStorage<Reminder[]>('reminders', []);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    datetime: '',
  });
  const [showForm, setShowForm] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      reminders.forEach(reminder => {
        if (!reminder.completed) {
          const reminderTime = new Date(reminder.datetime);
          if (reminderTime <= now) {
            showNotification('info', `Reminder: ${reminder.title}`);
            setReminders(prev =>
              prev.map(r =>
                r.id === reminder.id ? { ...r, completed: true } : r
              )
            );
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders, showNotification]);

  const addReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.title.trim() || !newReminder.datetime) return;

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      description: newReminder.description,
      datetime: newReminder.datetime,
      completed: false,
      createdAt: new Date(),
    };

    setReminders(prev => [...prev, reminder]);
    setNewReminder({ title: '', description: '', datetime: '' });
    setShowForm(false);
    showNotification('success', 'Reminder set successfully!');
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    showNotification('warning', 'Reminder deleted');
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reminders</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Reminder
          </button>
        </div>

        {showForm && (
          <form onSubmit={addReminder} className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newReminder.title}
                onChange={e => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Enter reminder title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newReminder.description}
                onChange={e => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Enter reminder description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={newReminder.datetime}
                onChange={e => setNewReminder(prev => ({ ...prev, datetime: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Set Reminder
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {reminders.map(reminder => (
            <div
              key={reminder.id}
              className={`p-4 rounded-lg ${
                reminder.completed
                  ? 'bg-gray-50 dark:bg-gray-700/50'
                  : 'bg-blue-50 dark:bg-blue-900/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Bell className={`w-5 h-5 mt-1 ${
                    reminder.completed
                      ? 'text-gray-400'
                      : 'text-blue-500 dark:text-blue-400'
                  }`} />
                  <div>
                    <h3 className={`font-medium ${
                      reminder.completed
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {reminder.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {reminder.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(reminder.datetime).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}