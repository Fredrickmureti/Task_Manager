import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Save } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Activity {
  id: string;
  type: 'run' | 'walk' | 'cycle';
  distance: number;
  duration: number;
  date: Date;
  route?: google.maps.LatLng[];
}

export function Activities() {
  const [activities, setActivities] = useLocalStorage<Activity[]>('activities', []);
  const [isTracking, setIsTracking] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Partial<Activity>>({
    type: 'run',
    distance: 0,
    duration: 0,
  });
  const [watchId, setWatchId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Start tracking
  const startTracking = () => {
    if (navigator.geolocation) {
      setIsTracking(true);
      setStartTime(new Date());
      
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const newPosition = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );

          setCurrentActivity(prev => ({
            ...prev,
            route: [...(prev.route || []), newPosition],
            distance: calculateDistance(prev.route || [], newPosition),
          }));
        },
        (error) => console.error('Error tracking location:', error),
        { enableHighAccuracy: true }
      );

      setWatchId(id);
    }
  };

  // Stop tracking
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setIsTracking(false);
      setWatchId(null);

      // Save activity
      const activity: Activity = {
        id: Date.now().toString(),
        type: currentActivity.type as 'run',
        distance: currentActivity.distance || 0,
        duration: currentActivity.duration || 0,
        date: new Date(),
        route: currentActivity.route,
      };

      setActivities(prev => [...prev, activity]);
      setCurrentActivity({ type: 'run', distance: 0, duration: 0 });
    }
  };

  // Calculate distance
  const calculateDistance = (route: google.maps.LatLng[], newPosition: google.maps.LatLng): number => {
    if (route.length === 0) return 0;
    const lastPosition = route[route.length - 1];
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      lastPosition,
      newPosition
    );
    return (currentActivity.distance || 0) + distance;
  };

  // Update duration while tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        const duration = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
        setCurrentActivity(prev => ({ ...prev, duration }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Activity Tracker</h2>
        
        {/* Current Activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Distance</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {(currentActivity.distance || 0).toFixed(2)} m
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">Duration</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {new Date(currentActivity.duration * 1000).toISOString().substr(11, 8)}
            </p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">Pace</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {currentActivity.duration && currentActivity.distance
                ? ((currentActivity.duration / 60) / (currentActivity.distance / 1000)).toFixed(2)
                : '0.00'} min/km
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isTracking ? (
            <button
              onClick={startTracking}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Play className="w-5 h-5" />
              Start
            </button>
          ) : (
            <button
              onClick={stopTracking}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Square className="w-5 h-5" />
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Activity History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Activity History</h3>
        <div className="space-y-4">
          {activities.map(activity => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Distance: {(activity.distance / 1000).toFixed(2)} km
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(activity.duration * 1000).toISOString().substr(11, 8)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pace: {((activity.duration / 60) / (activity.distance / 1000)).toFixed(2)} min/km
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}