import React from 'react';
import { Clock, TrendingUp, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Task } from '../types';

export function TaskMetrics() {
  const [tasks] = useLocalStorage<Task[]>('tasks', []);

  const getMetrics = () => {
    const now = new Date();
    const thisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14);

    const thisWeekTasks = tasks.filter(task => new Date(task.createdAt) >= thisWeek);
    const lastWeekTasks = tasks.filter(task => {
      const date = new Date(task.createdAt);
      return date >= lastWeek && date < thisWeek;
    });

    const completionRate = tasks.length > 0
      ? (tasks.filter(task => task.completed).length / tasks.length) * 100
      : 0;

    const weeklyGrowth = lastWeekTasks.length > 0
      ? ((thisWeekTasks.length - lastWeekTasks.length) / lastWeekTasks.length) * 100
      : 0;

    const avgCompletionTime = tasks
      .filter(task => task.completed)
      .reduce((acc, task) => {
        const completionTime = new Date(task.completedAt || new Date()).getTime() - new Date(task.createdAt).getTime();
        return acc + completionTime;
      }, 0) / (tasks.filter(task => task.completed).length || 1);

    return {
      completionRate: Math.round(completionRate),
      weeklyGrowth: Math.round(weeklyGrowth),
      avgCompletionTime: Math.round(avgCompletionTime / (1000 * 60 * 60 * 24)), // Convert to days
      overdueTasks: tasks.filter(task => task.dueDate && new Date(task.dueDate) < now && !task.completed).length,
    };
  };

  const metrics = getMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {metrics.completionRate}%
            </p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${metrics.completionRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Weekly Growth</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {metrics.weeklyGrowth}%
            </p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {metrics.weeklyGrowth >= 0 ? 'Increase' : 'Decrease'} from last week
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Completion Time</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {metrics.avgCompletionTime} days
            </p>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
            <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Average time to complete tasks
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Overdue Tasks</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {metrics.overdueTasks}
            </p>
          </div>
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
            <AlertOctagon className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Tasks past due date
        </p>
      </div>
    </div>
  );
}