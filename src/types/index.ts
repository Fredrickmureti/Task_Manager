export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
  position?: number;
}

export interface ChartData {
  label: string;
  value: number;
  completed: number;
}

export type Theme = 'light' | 'dark';

export type NotificationType = 'success' | 'warning' | 'info';

export interface Statistics {
  totalTasks: number;
  completedTasks: number;
  activeProjects: number;
  productivity: number;
}