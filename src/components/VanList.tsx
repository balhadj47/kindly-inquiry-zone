
import React, { useState, useEffect } from 'react';
import { Van } from '@/types/van';
import { useVansPagination } from '@/hooks/useVansPagination';
import VanListGrid from './vans/VanListGrid';
import VanListSummary from './vans/VanListSummary';
import VanListPagination from './vans/VanListPagination';
import VanListEmptyState from './vans/VanListEmptyState';
import VanDetailsDialog from './vans/VanDetailsDialog';

interface VanListProps {
  vans: any[];
  totalVans: number;
  searchTerm: string;
  statusFilter: string;
  onAddVan: () => void;
  onEditVan: (van: any) => void;
  onQuickAction: (action: string, van: any) => void;
  onDeleteVan: (van: any) => void;
}

const VanList = React.memo(({ 
  vans, 
  totalVans, 
  searchTerm, 
  statusFilter, 
  onAddVan, 
  onEditVan, 
  onQuickAction,
  onDeleteVan
}: VanListProps) => {
  const [filteredVans, setFilteredVans] = useState(vans);
  const [selectedVan, setSelectedVan] = useState<Van | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  const {
    currentPage,
    totalPages,
    paginatedVans,
    handlePageChange,
  } = useVansPagination({
    filteredVans,
    itemsPerPage: 12,
    searchTerm,
    statusFilter,
  });

  useEffect(() => {
    const filtered = vans.filter((van) => {
      if (searchTerm) {
        return van.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               van.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               van.model?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      if (statusFilter !== 'all') {
        return van.status === statusFilter;
      }
      return true;
    });
    setFilteredVans(filtered);
  }, [vans, searchTerm, statusFilter]);

  const handleVanClick = (van: Van) => {
    setSelectedVan(van);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedVan(null);
  };

  if (vans.length === 0) {
    return (
      <VanListEmptyState
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onAddVan={onAddVan}
      />
    );
  }

  return (
    <div className="space-y-6">
      <VanListSummary
        displayedCount={paginatedVans.length}
        filteredCount={filteredVans.length}
        currentPage={currentPage}
        totalPages={totalPages}
      />
      
      <VanListGrid
        vans={paginatedVans}
        onEditVan={onEditVan}
        onQuickAction={handleVanClick}
        onDeleteVan={onDeleteVan}
      />

      <VanListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <VanDetailsDialog
        van={selectedVan}
        isOpen={isDetailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        onEdit={onEditVan}
      />
    </div>
  );
});

VanList.displayName = 'VanList';

export default VanList;
