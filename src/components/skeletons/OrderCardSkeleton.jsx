import React from 'react';
import Skeleton from '../ui/Skeleton';

export const OrderCardSkeleton = () => {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900 shadow-sm flex flex-col space-y-3 w-full">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-5 w-1/4 rounded-full" />
      </div>
      <div className="space-y-2 py-2">
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-neutral-100 dark:border-neutral-800">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>
    </div>
  );
};

export default OrderCardSkeleton;
