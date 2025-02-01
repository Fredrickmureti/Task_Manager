import React, { useEffect } from 'react';
import { X, Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export type NotificationType = 'success' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
}

export function Notification({ type, message, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = icons[type];

  const colors = {
    success: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200',
  };

  return (
    <div className={`fixed bottom-4 right-4 max-w-sm w-full ${colors[type]} rounded-lg p-4 shadow-lg transform animate-slide-up`}>
      <div className="flex items-start">
        <Icon className="w-5 h-5 mt-0.5" />
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}