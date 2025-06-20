
import React, { useState } from 'react';
import MissionsLayout from '@/components/missions/MissionsLayout';
import MissionsHeader from '@/components/missions/MissionsHeader';
import MissionsContainer from '@/components/missions/MissionsContainer';
import { useTrip } from '@/contexts/TripContext';
import { useRBAC } from '@/contexts/RBACContext';

const MissionsPage = () => {
  console.log('🎯 MissionsPage: Component is rendering');
  console.log('🎯 MissionsPage: Current URL:', window.location.pathname);
  
  const { trips } = useTrip();
  const { hasPermission } = useRBAC();
  const [isNewMissionDialogOpen, setIsNewMissionDialogOpen] = useState(false);

  const handleNewMissionClick = () => {
    setIsNewMissionDialogOpen(true);
  };

  const canCreateMissions = hasPermission('missions:create');

  console.log('🎯 MissionsPage: Trips loaded:', trips?.length || 0);
  console.log('🎯 MissionsPage: Can create missions:', canCreateMissions);

  return (
    <MissionsLayout>
      <MissionsHeader 
        trips={trips}
        onNewMissionClick={handleNewMissionClick}
        canCreateMissions={canCreateMissions}
      />
      <MissionsContainer 
        isNewMissionDialogOpen={isNewMissionDialogOpen}
        setIsNewMissionDialogOpen={setIsNewMissionDialogOpen}
      />
    </MissionsLayout>
  );
};

export default MissionsPage;
