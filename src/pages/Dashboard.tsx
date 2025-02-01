import React from 'react';
import { TaskList } from '../components/TaskList';
import { Chart } from '../components/Chart';
import { StatisticsOverview } from '../components/StatisticsOverview';
import { TaskMetrics } from '../components/TaskMetrics';

export function Dashboard() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Welcome back! Here's your overview.
        </div>
      </div>
      
      <TaskMetrics />
      <StatisticsOverview />
      
      <div className="grid md:grid-cols-2 gap-6">
        <TaskList />
        <Chart />
      </div>
    </div>
  );
}