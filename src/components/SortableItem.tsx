import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, Trash, Tag, Calendar, AlertTriangle, GripVertical } from 'lucide-react';
import type { Task } from '../types';

interface SortableItemProps {
  id: string;
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  isOverdue: boolean;
  priorities: {
    value: Task['priority'];
    label: string;
    color: string;
  }[];
}

export function SortableItem({ id, task, onToggle, onDelete, isOverdue, priorities }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 rounded-lg transform transition-all duration-200 hover:scale-[1.02] ${
        isOverdue
          ? 'bg-red-50 dark:bg-red-900/20'
          : 'bg-gray-50 dark:bg-gray-700/50'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <button
          className="touch-none hidden sm:block"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
        </button>
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-5 h-5 rounded-full border ${
            task.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 dark:border-gray-500'
          } flex items-center justify-center transition-colors`}
        >
          {task.completed && <Check className="w-3 h-3 text-white" />}
        </button>
        <div className="min-w-0">
          <span className={`block truncate ${
            task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'
          }`}>
            {task.title}
          </span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">{task.category}</span>
            </div>
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className={`text-xs ${
                  isOverdue
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
            <span className={`text-xs ${priorities.find(p => p.value === task.priority)?.color}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        {isOverdue && (
          <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />
        )}
        <button
          onClick={onDelete}
          className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}