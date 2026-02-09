/**
 * Loading Skeleton Component
 */

import React from 'react';

export const LoadingSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-72 animate-pulse" />
      ))}
    </div>
  );
};

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="loading-spinner" />
    </div>
  );
};
