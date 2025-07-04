
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, Shield, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  uniqueStatuses: string[];
  uniqueRoles: string[];
  filteredCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  uniqueStatuses,
  uniqueRoles,
  filteredCount,
  totalCount,
  hasActiveFilters,
  clearFilters,
}) => {
  const isMobile = useIsMobile();
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Add comprehensive safety checks and default values
  const safeUniqueStatuses = Array.isArray(uniqueStatuses) ? uniqueStatuses.filter(Boolean) : [];
  const safeUniqueRoles = Array.isArray(uniqueRoles) ? uniqueRoles.filter(Boolean) : [];
  const safeFilteredCount = typeof filteredCount === 'number' && !isNaN(filteredCount) ? filteredCount : 0;
  const safeTotalCount = typeof totalCount === 'number' && !isNaN(totalCount) ? totalCount : 0;
  const safeSearchTerm = typeof searchTerm === 'string' ? searchTerm : '';

  // Safe handlers with error catching
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSearchTerm(e.target.value || '');
    } catch (error) {
      console.error('Error updating search term:', error);
    }
  };

  const handleStatusChange = (value: string) => {
    try {
      setStatusFilter(value || 'all');
    } catch (error) {
      console.error('Error updating status filter:', error);
    }
  };

  const handleRoleChange = (value: string) => {
    try {
      setRoleFilter(value || 'all');
    } catch (error) {
      console.error('Error updating role filter:', error);
    }
  };

  const handleClearFilters = () => {
    try {
      clearFilters();
      if (isMobile) {
        setFiltersExpanded(false);
      }
    } catch (error) {
      console.error('Error clearing filters:', error);
    }
  };

  console.log('UserFilters - Rendering with safe data:', {
    searchTerm: safeSearchTerm,
    statusFilter,
    roleFilter,
    uniqueStatuses: safeUniqueStatuses.length,
    uniqueRoles: safeUniqueRoles.length,
    filteredCount: safeFilteredCount,
    totalCount: safeTotalCount,
    isMobile
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search Bar - Always visible */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, email, ou numéro de permis..."
              value={safeSearchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>

          {/* Mobile: Collapsible filters */}
          {isMobile ? (
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filtres</span>
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      {[statusFilter !== 'all', roleFilter !== 'all'].filter(Boolean).length}
                    </Badge>
                  )}
                </div>
                {filtersExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>

              {filtersExpanded && (
                <div className="space-y-3">
                  <Select value={statusFilter || 'all'} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <Shield className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="all">Tous les Statuts</SelectItem>
                      {safeUniqueStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={roleFilter || 'all'} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <Shield className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filtrer par rôle" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="all">Tous les Rôles</SelectItem>
                      {safeUniqueRoles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {hasActiveFilters && (
                    <Button variant="outline" onClick={handleClearFilters} className="w-full flex items-center justify-center space-x-2">
                      <X className="h-4 w-4" />
                      <span>Effacer les Filtres</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Desktop: Horizontal filters */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={statusFilter || 'all'} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="all">Tous les Statuts</SelectItem>
                  {safeUniqueStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={roleFilter || 'all'} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <Shield className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="all">Tous les Rôles</SelectItem>
                  {safeUniqueRoles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="outline" onClick={handleClearFilters} className="flex items-center space-x-2">
                  <X className="h-4 w-4" />
                  <span>Effacer les Filtres</span>
                </Button>
              )}
            </div>
          )}

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-600 space-y-2 sm:space-y-0">
            <span>
              Affichage de {safeFilteredCount} sur {safeTotalCount} utilisateurs
              {hasActiveFilters && ` (filtré)`}
            </span>
            {hasActiveFilters && !isMobile && (
              <div className="flex items-center space-x-2 flex-wrap">
                <span>Filtres actifs:</span>
                {safeSearchTerm && <Badge variant="secondary">Recherche: "{safeSearchTerm.substring(0, 20)}{safeSearchTerm.length > 20 ? '...' : ''}"</Badge>}
                {statusFilter !== 'all' && <Badge variant="secondary">Statut: {statusFilter}</Badge>}
                {roleFilter !== 'all' && <Badge variant="secondary">Rôle: {roleFilter}</Badge>}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserFilters;
