import React, { useState } from 'react';
import { Plus, Check, Trash, Target } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  createdAt: Date;
}

export function Goals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
  });
  const [showForm, setShowForm] = useState(false);

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      targetDate: newGoal.targetDate,
      completed: false,
      createdAt: new Date(),
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({ title: '', description: '', targetDate: '' });
    setShowForm(false);
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Goals</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Goal
          </button>
        </div>

        {showForm && (
          <form onSubmit={addGoal} className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newGoal.title}
                onChange={e => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Enter goal title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newGoal.description}
                onChange={e => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Enter goal description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={newGoal.targetDate}
                onChange={e => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
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
                Save Goal
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {goals.map(goal => (
            <div
              key={goal.id}
              className={`p-4 rounded-lg ${
                goal.completed
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-gray-50 dark:bg-gray-700/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleGoal(goal.id)}
                    className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border ${
                      goal.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 dark:border-gray-500'
                    } flex items-center justify-center`}
                  >
                    {goal.completed && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <div>
                    <h3 className={`font-medium ${
                      goal.completed
                        ? 'text-green-800 dark:text-green-200 line-through'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {goal.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {goal.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
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