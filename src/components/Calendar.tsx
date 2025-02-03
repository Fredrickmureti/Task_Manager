import React, { useState, useContext } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { TaskContext } from '../context/TaskContext';
import type { Task } from '../types';

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { tasks } = useContext(TaskContext);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Calendar</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <span className="text-lg font-medium text-gray-900 dark:text-white">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthDays.map(day => {
          const dayTasks = getTasksForDate(day);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`
                aspect-square p-2 rounded-lg relative
                ${isCurrentMonth ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : 'opacity-50'}
                ${isSelected ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                ${isToday ? 'border-2 border-blue-500' : ''}
              `}
            >
              <span className={`
                text-sm font-medium
                ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}
              `}>
                {format(day, 'd')}
              </span>
              {dayTasks.length > 0 && (
                <div className="absolute bottom-1 right-1 left-1">
                  <div className="flex gap-1 justify-end">
                    {dayTasks.length > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-500 rounded-full">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
          
          <div className="space-y-2">
            {getTasksForDate(selectedDate).map(task => (
              <div
                key={task.id}
                className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`font-medium ${
                      task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'
                    }`}>
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(task.dueDate!), 'h:mm a')}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.priority === 'high' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
            {getTasksForDate(selectedDate).length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No tasks scheduled for this day
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}