import React, { createContext, useState, useEffect } from 'react';
import type { Task } from '../types';

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
}

export const TaskContext = createContext<TaskContextType>({
  tasks: [],
  setTasks: () => {},
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  toggleTask: () => {},
});

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const completed = !task.completed;
        return { 
          ...task, 
          completed, 
          completedAt: completed ? new Date() : undefined 
        };
      }
      return task;
    }));
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      setTasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
    }}>
      {children}
    </TaskContext.Provider>
  );
}