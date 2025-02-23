import React, { useState, useEffect, useCallback, useContext } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Plus, Search, Tag, Calendar, Filter, Star } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { TaskContext } from '../context/TaskContext';
import type { Task } from '../types';
import { format } from 'date-fns';

const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Important'];
const priorities = [
  { value: 'low', label: 'Low', color: 'text-gray-500 bg-gray-100' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-500 bg-yellow-100' },
  { value: 'high', label: 'High', color: 'text-red-500 bg-red-100' },
] as const;

export function TaskList() {
  const { tasks, addTask, toggleTask, deleteTask } = useContext(TaskContext);
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [filterPriority, setFilterPriority] = useState<Task['priority'] | ''>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'active'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('createdAt');
  const [starred, setStarred] = useState<string[]>(() => {
    const saved = localStorage.getItem('starredTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const { showNotification } = useNotification();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Save starred tasks to localStorage
  useEffect(() => {
    localStorage.setItem('starredTasks', JSON.stringify(starred));
  }, [starred]);

  // Sort tasks
  const sortTasks = useCallback((tasksToSort: Task[]) => {
    return [...tasksToSort].sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [sortBy]);

  // Filter and sort tasks
  const filteredTasks = React.useMemo(() => {
    let filtered = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || task.category === selectedCategory;
      const matchesPriority = !filterPriority || task.priority === filterPriority;
      const matchesStatus = filterStatus === 'all' 
        ? true 
        : filterStatus === 'completed' 
          ? task.completed 
          : !task.completed;
      
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });

    // Sort tasks
    filtered = sortTasks(filtered);

    // Move starred tasks to top
    return filtered.sort((a, b) => {
      const aStarred = starred.includes(a.id) ? 1 : 0;
      const bStarred = starred.includes(b.id) ? 1 : 0;
      return bStarred - aStarred;
    });
  }, [tasks, searchQuery, selectedCategory, filterPriority, filterStatus, sortTasks, starred]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task: Omit<Task, 'id' | 'createdAt'> = {
      title: newTask,
      completed: false,
      category: selectedCategory || 'Personal',
      priority: selectedPriority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };

    addTask(task);
    setNewTask('');
    setShowNewTaskForm(false);
    showNotification('success', 'Task added successfully!');
  };

  const handleToggleTask = (id: string) => {
    toggleTask(id);
    showNotification('info', 'Task status updated');
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    setStarred(prev => prev.filter(taskId => taskId !== id));
    showNotification('warning', 'Task deleted');
  };

  const toggleStarred = (id: string) => {
    setStarred(prev => 
      prev.includes(id) 
        ? prev.filter(taskId => taskId !== id)
        : [...prev, id]
    );
    showNotification('info', starred.includes(id) ? 'Task unstarred' : 'Task starred');
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex(item => item.id === active.id);
      const newIndex = tasks.findIndex(item => item.id === over.id);
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      // Update tasks through context
      // setTasks(newTasks);
      showNotification('info', 'Task order updated');
    }
  };

  const isTaskOverdue = (task: Task) => {
    return task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  };

  // Check for overdue tasks
  useEffect(() => {
    const checkOverdueTasks = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (!task.completed && task.dueDate && new Date(task.dueDate) < now) {
          showNotification('warning', `Task "${task.title}" is overdue!`);
        }
      });
    };

    const interval = setInterval(checkOverdueTasks, 60000);
    return () => clearInterval(interval);
  }, [tasks, showNotification]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Tasks</h2>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle filters"
          >
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => setShowNewTaskForm(!showNewTaskForm)}
            className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            aria-label="Add new task"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as Task['priority'] | '')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="">All Priorities</option>
                {priorities.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'completed' | 'active')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="all">All Tasks</option>
                <option value="completed">Completed</option>
                <option value="active">Active</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {showNewTaskForm && (
        <form onSubmit={handleAddTask} className="mb-4 space-y-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Task title..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as Task['priority'])}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priorities.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={filteredTasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {filteredTasks.map(task => (
              <SortableItem
                key={task.id}
                id={task.id}
                task={task}
                onToggle={() => handleToggleTask(task.id)}
                onDelete={() => handleDeleteTask(task.id)}
                onStar={() => toggleStarred(task.id)}
                isStarred={starred.includes(task.id)}
                isOverdue={isTaskOverdue(task)}
                priorities={priorities}
              />
            ))}
            {filteredTasks.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No tasks found
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}