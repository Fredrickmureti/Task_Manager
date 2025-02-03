import React, { useContext } from 'react';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import { TaskContext } from '../context/TaskContext';

export function StatisticsOverview() {
  const { tasks } = useContext(TaskContext);

  const statistics = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.completed).length,
    overdueTasks: tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
    ).length,
    highPriorityTasks: tasks.filter(task => task.priority === 'high').length,
  };

  const productivityRate = tasks.length > 0
    ? Math.round((statistics.completedTasks / tasks.length) * 100)
    : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: statistics.totalTasks.toString(),
      change: `${statistics.completedTasks} completed`,
      icon: CheckCircle,
      trend: 'up',
    },
    {
      label: 'Productivity Rate',
      value: `${productivityRate}%`,
      change: 'vs last week',
      icon: TrendingUp,
      trend: productivityRate >= 50 ? 'up' : 'down',
    },
    {
      label: 'High Priority',
      value: statistics.highPriorityTasks.toString(),
      change: 'need attention',
      icon: Users,
      trend: statistics.highPriorityTasks > 5 ? 'down' : 'up',
    },
    {
      label: 'Overdue Tasks',
      value: statistics.overdueTasks.toString(),
      change: 'past due date',
      icon: Clock,
      trend: statistics.overdueTasks > 0 ? 'down' : 'up',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                stat.trend === 'up' 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm ${
                stat.trend === 'up'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}