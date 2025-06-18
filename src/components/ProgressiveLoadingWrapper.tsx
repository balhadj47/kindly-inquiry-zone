import React from 'react';
import { useProgressiveLoadingContext } from '@/contexts/ProgressiveLoadingContext';
import TripHistoryOptimizedSkeleton from './trip-history/TripHistoryOptimizedSkeleton';

interface ProgressiveLoadingWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProgressiveLoadingWrapper: React.FC<ProgressiveLoadingWrapperProps> = ({ 
  children, 
  fallback = <TripHistoryOptimizedSkeleton /> 
}) => {
  console.log('🔧 ProgressiveLoadingWrapper: Rendering...');
  
  let coreDataLoaded = false;
  let isInitializing = true;
  let error = null;
  
  try {
    const context = useProgressiveLoadingContext();
    coreDataLoaded = context.coreDataLoaded;
    isInitializing = context.isInitializing;
    error = context.error;
    
    console.log('🔧 ProgressiveLoadingWrapper: Context state', {
      coreDataLoaded,
      isInitializing,
      error
    });
  } catch (contextError) {
    console.warn('🔧 ProgressiveLoadingWrapper: Context not available, falling back to loading', contextError);
    // Keep default values (loading state)
  }

  // Show error state
  if (error) {
    console.log('🔧 ProgressiveLoadingWrapper: Showing error state');
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Actualiser
          </button>
        </div>
      </div>
    );
  }

  // Show loading skeleton while core data is loading
  if (isInitializing || !coreDataLoaded) {
    console.log('🔧 ProgressiveLoadingWrapper: Showing loading state');
    return <>{fallback}</>;
  }

  // Render children when core data is ready
  console.log('🔧 ProgressiveLoadingWrapper: Rendering children');
  return <>{children}</>;
};

export default ProgressiveLoadingWrapper;
