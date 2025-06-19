
import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTrip } from '@/contexts/TripContext';
import TripHistoryHeader from './trip-history/TripHistoryHeader';
import TripHistoryFilters from './trip-history/TripHistoryFilters';
import TripHistoryStats from './trip-history/TripHistoryStats';
import TripHistoryList from './trip-history/TripHistoryList';
import TripHistoryOptimizedSkeleton from './trip-history/TripHistoryOptimizedSkeleton';
import TripDetailsDialog from './TripDetailsDialog';
import TripEndDialog from './trip-history/TripEndDialog';
import TripDeleteDialog from './trip-history/TripDeleteDialog';

const TripHistoryOptimized = () => {
  console.log('🗂️ TripHistoryOptimized: Component rendering...');

  // State management
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripToEnd, setTripToEnd] = useState(null);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');

  // Data fetching from context
  const { trips, isLoading, error } = useTrip();
  
  console.log('🗂️ TripHistoryOptimized: Data state:', {
    tripsCount: trips?.length || 0,
    isLoading,
    error,
    hasTrips: Array.isArray(trips)
  });

  // Handlers for dialogs
  const handleOpenTripDetails = (trip) => {
    console.log('🗂️ TripHistoryOptimized: Opening trip details for:', trip?.id);
    setSelectedTrip(trip);
  };
  const handleCloseTripDetails = () => {
    console.log('🗂️ TripHistoryOptimized: Closing trip details');
    setSelectedTrip(null);
  };
  const handleOpenTripEndDialog = (trip) => {
    console.log('🗂️ TripHistoryOptimized: Opening end dialog for:', trip?.id);
    setTripToEnd(trip);
  };
  const handleCloseTripEndDialog = () => {
    console.log('🗂️ TripHistoryOptimized: Closing end dialog');
    setTripToEnd(null);
  };
  const handleOpenTripDeleteDialog = (trip) => {
    console.log('🗂️ TripHistoryOptimized: Opening delete dialog for:', trip?.id);
    setTripToDelete(trip);
  };
  const handleCloseTripDeleteDialog = () => {
    console.log('🗂️ TripHistoryOptimized: Closing delete dialog');
    setTripToDelete(null);
  };

  // Filtering trips based on search term and active tab
  const filteredTrips = useMemo(() => {
    console.log('🗂️ TripHistoryOptimized: Filtering trips...');
    
    if (!Array.isArray(trips)) {
      console.warn('🗂️ TripHistoryOptimized: trips is not an array:', trips);
      return [];
    }

    return trips.filter((trip) => {
      if (!trip) {
        console.warn('🗂️ TripHistoryOptimized: Found null/undefined trip');
        return false;
      }

      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm =
        (trip.company || '').toLowerCase().includes(searchTermLower) ||
        (trip.notes || '').toLowerCase().includes(searchTermLower);

      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'active' && !trip.endDate) ||
        (activeTab === 'completed' && trip.endDate);

      return matchesSearchTerm && matchesTab;
    });
  }, [trips, searchTerm, activeTab]);

  // Sorting trips
  const sortedTrips = useMemo(() => {
    console.log('🗂️ TripHistoryOptimized: Sorting trips...');
    
    if (!Array.isArray(filteredTrips)) {
      console.warn('🗂️ TripHistoryOptimized: filteredTrips is not an array:', filteredTrips);
      return [];
    }

    const sorted = [...filteredTrips].sort((a, b) => {
      if (!a || !b) {
        console.warn('🗂️ TripHistoryOptimized: Found null trips in sorting');
        return 0;
      }

      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortOrder === 'asc' ? -1 : 1;
      if (bValue == null) return sortOrder === 'asc' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      } else {
        return sortOrder === 'asc' 
          ? String(aValue).localeCompare(String(bValue)) 
          : String(bValue).localeCompare(String(aValue));
      }
    });
    
    console.log('🗂️ TripHistoryOptimized: Sorted trips count:', sorted.length);
    return sorted;
  }, [filteredTrips, sortBy, sortOrder]);

  const totalDistance = useMemo(() => {
    if (!Array.isArray(trips)) return 0;
    
    return trips.reduce((sum, trip) => {
      if (!trip) return sum;
      const startKm = trip.startKm || 0;
      const endKm = trip.endKm || 0;
      return sum + (endKm > startKm ? endKm - startKm : 0);
    }, 0);
  }, [trips]);

  const totalTrips = Array.isArray(trips) ? trips.length : 0;
  const activeTripsCount = Array.isArray(trips) ? trips.filter(trip => trip && !trip.endDate).length : 0;
  const completedTripsCount = Array.isArray(trips) ? trips.filter(trip => trip && trip.endDate).length : 0;

  console.log('🗂️ TripHistoryOptimized: Render state:', {
    totalTrips,
    activeTripsCount,
    completedTripsCount,
    filteredCount: sortedTrips.length
  });

  if (isLoading) {
    console.log('🗂️ TripHistoryOptimized: Showing loading skeleton');
    return <TripHistoryOptimizedSkeleton />;
  }

  if (error) {
    console.error('🗂️ TripHistoryOptimized: Showing error state:', error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">Impossible de charger l'historique des voyages</p>
          <Button onClick={() => window.location.reload()}>
            Actualiser la page
          </Button>
        </div>
      </div>
    );
  }

  console.log('🗂️ TripHistoryOptimized: Rendering main content');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <TripHistoryHeader />
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un voyage
        </Button>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher par entreprise ou destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <TripHistoryStats trips={sortedTrips} />

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Voyages ({sortedTrips.length})
        </h2>
        <div className="space-y-4">
          {sortedTrips.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun voyage trouvé</p>
            </div>
          ) : (
            sortedTrips.map((trip) => {
              if (!trip) {
                console.warn('🗂️ TripHistoryOptimized: Skipping null trip in render');
                return null;
              }
              
              return (
                <div
                  key={trip.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer"
                  onClick={() => handleOpenTripDetails(trip)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{trip.company || 'Entreprise inconnue'}</h3>
                      <p className="text-sm text-gray-600">{trip.notes || 'Aucune note'}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {trip.timestamp ? new Date(trip.timestamp).toLocaleDateString() : 'Date inconnue'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <TripDetailsDialog
        trip={selectedTrip}
        isOpen={!!selectedTrip}
        onClose={handleCloseTripDetails}
      />

      <TripEndDialog
        trip={tripToEnd}
        isOpen={!!tripToEnd}
        onClose={handleCloseTripEndDialog}
      />

      <TripDeleteDialog
        trip={tripToDelete}
        isOpen={!!tripToDelete}
        onClose={handleCloseTripDeleteDialog}
        onConfirm={() => {
          console.log('🗂️ TripHistoryOptimized: Deleting trip:', tripToDelete);
          handleCloseTripDeleteDialog();
        }}
      />
    </div>
  );
};

export default TripHistoryOptimized;
