
import React, { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRBAC } from '@/contexts/RBACContext';
import { useVans } from '@/hooks/useVans';
import { useCompanies } from '@/hooks/useCompanies';
import { useTrip } from '@/contexts/TripContext';
import { RefreshButton } from '@/components/ui/refresh-button';
import EnhancedStatsGrid from './dashboard/EnhancedStatsGrid';
import EnhancedChartsSection from './dashboard/EnhancedChartsSection';
import QuickActions from './dashboard/QuickActions';
import { calculateDashboardStats, createChartData } from './dashboard/DashboardStats';

const DashboardLoadingSkeleton = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stats Grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[250px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { users } = useRBAC();
  const { vans, isLoading: vansLoading, refetch: refetchVans } = useVans();
  const { companies, refetch: refetchCompanies } = useCompanies();
  const { trips } = useTrip();

  // Single refresh effect - only run once when component mounts
  useEffect(() => {
    console.log('📊 Dashboard component mounted, initial data load');
    // Let React Query handle the initial fetch - no manual refresh needed
  }, []); // Empty dependency array - only run once

  const handleRefresh = async () => {
    console.log('📊 Manual refresh triggered');
    await Promise.all([
      refetchVans?.(),
      refetchCompanies?.()
    ]);
  };

  const isLoading = vansLoading;

  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }

  const stats = calculateDashboardStats(users, vans, companies, trips);
  const chartData = createChartData(companies, trips);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-sm sm:text-base text-gray-500">Bienvenue! Voici un aperçu de votre flotte.</p>
        </div>
        <RefreshButton onRefresh={handleRefresh} />
      </div>

      <EnhancedStatsGrid stats={stats} />
      <QuickActions />
      <EnhancedChartsSection chartData={chartData} />
    </div>
  );
};

export default Dashboard;
