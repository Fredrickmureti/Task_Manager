import React, { useEffect, useRef, useState } from 'react';
import { Link as Line, Calendar } from 'lucide-react';
import type { ChartData } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { format, subDays, eachDayOfInterval } from 'date-fns';

const timeRanges = ['1W', '1M', '3M', '6M', '1Y'];

export function Chart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedRange, setSelectedRange] = useState('1W');
  const [isHovering, setIsHovering] = useState(false);
  const [hoverData, setHoverData] = useState<{ x: number; y: number; data: ChartData | null }>({
    x: 0,
    y: 0,
    data: null,
  });
  
  const [tasks] = useLocalStorage('tasks', []);

  const getChartData = () => {
    const days = {
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
    }[selectedRange];

    const dateRange = eachDayOfInterval({
      start: subDays(new Date(), days - 1),
      end: new Date(),
    });

    return dateRange.map(date => {
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return format(taskDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });

      return {
        label: format(date, 'MMM d'),
        value: dayTasks.length,
        completed: dayTasks.filter(t => t.completed).length,
      };
    });
  };

  const data = getChartData();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawChart = () => {
      const width = canvas.width;
      const height = canvas.height;
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw chart background with gradient
      const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(padding, padding, chartWidth, chartHeight);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(156, 163, 175, 0.2)';
      ctx.beginPath();
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight * i) / 5;
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
      }
      ctx.stroke();

      // Draw data lines
      const maxValue = Math.max(...data.map(d => d.value));
      const scale = chartHeight / (maxValue || 1);

      // Draw total tasks line
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      data.forEach((point, index) => {
        const x = padding + (chartWidth * index) / (data.length - 1);
        const y = padding + chartHeight - (chartHeight * point.value) / (maxValue || 1);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw completed tasks line
      ctx.strokeStyle = '#10B981';
      ctx.beginPath();
      data.forEach((point, index) => {
        const x = padding + (chartWidth * index) / (data.length - 1);
        const y = padding + chartHeight - (chartHeight * point.completed) / (maxValue || 1);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw points
      data.forEach((point, index) => {
        const x = padding + (chartWidth * index) / (data.length - 1);
        
        // Total tasks point
        const y1 = padding + chartHeight - (chartHeight * point.value) / (maxValue || 1);
        ctx.beginPath();
        ctx.arc(x, y1, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#3B82F6';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Completed tasks point
        const y2 = padding + chartHeight - (chartHeight * point.completed) / (maxValue || 1);
        ctx.beginPath();
        ctx.arc(x, y2, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#10B981';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw labels
        if (index % Math.ceil(data.length / 7) === 0) {
          ctx.fillStyle = '#6B7280';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(point.label, x, height - padding / 2);
        }
      });

      // Draw hover tooltip
      if (isHovering && hoverData.data) {
        const tooltipPadding = 8;
        const tooltipWidth = 120;
        const tooltipHeight = 60;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.roundRect(
          hoverData.x - tooltipWidth / 2,
          hoverData.y - tooltipHeight - 10,
          tooltipWidth,
          tooltipHeight,
          4
        );
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          hoverData.data.label,
          hoverData.x,
          hoverData.y - tooltipHeight + tooltipPadding + 4
        );
        ctx.fillText(
          `Total: ${hoverData.data.value}`,
          hoverData.x,
          hoverData.y - tooltipHeight + tooltipPadding + 24
        );
        ctx.fillText(
          `Completed: ${hoverData.data.completed}`,
          hoverData.x,
          hoverData.y - tooltipHeight + tooltipPadding + 44
        );
      }
    };

    drawChart();
    
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawChart();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const padding = 40;
      const chartWidth = canvas.width - padding * 2;
      
      const dataIndex = Math.round(((x - padding) / chartWidth) * (data.length - 1));
      
      if (dataIndex >= 0 && dataIndex < data.length) {
        setIsHovering(true);
        setHoverData({
          x,
          y,
          data: data[dataIndex],
        });
        drawChart();
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      drawChart();
    };

    handleResize();
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [data, isHovering, hoverData]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Task Analytics</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <Calendar className="w-4 h-4" />
            <span>Last updated {format(new Date(), 'MMM d, yyyy')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {timeRanges.map(range => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1 rounded-lg text-sm ${
                selectedRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              } transition-colors`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Completed Tasks</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-64"
      />
    </div>
  );
}