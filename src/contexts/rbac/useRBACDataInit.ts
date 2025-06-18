
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loadUsers, loadRoles } from './dataLoaders';
import { createPermissionUtils } from './permissionUtils';
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

interface RBACState {
  currentUser: User | null;
  users: User[];
  roles: SystemGroup[];
  loading: boolean;
}

interface RBACActions {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setRoles: React.Dispatch<React.SetStateAction<SystemGroup[]>>;
  setLoading: (loading: boolean) => void;
  setCurrentUser: (user: User | null) => void;
}

export const useRBACDataInit = (state: RBACState, actions: RBACActions) => {
  const { loading, users, roles } = state;
  const { setUsers, setRoles, setLoading, setCurrentUser } = actions;
  const { user: authUser } = useAuth();

  useEffect(() => {
    const initializeData = async () => {
      if (!authUser) {
        console.log('🔄 No auth user, skipping RBAC initialization');
        setLoading(false);
        return;
      }

      try {
        console.log('🚀 Starting RBAC initialization for user:', authUser.email);
        setLoading(true);

        // Load data in parallel for better performance
        const [systemGroupsData, usersData] = await Promise.all([
          loadRoles(),
          loadUsers()
        ]);

        console.log('✅ Data loaded - System groups:', systemGroupsData.length, 'Users:', usersData.length);

        // Set data immediately
        setRoles(systemGroupsData);
        setUsers(usersData);

        // Find and set current user
        if (usersData.length > 0) {
          const currentUserData = usersData.find(u => u.email === authUser.email);
          if (currentUserData) {
            console.log('✅ Current user found:', currentUserData.email, 'Role:', currentUserData.systemGroup);
            setCurrentUser(currentUserData);
          } else {
            console.warn('⚠️ User not found in database:', authUser.email);
            // Create a basic user object if not found in database
            const basicUser: User = {
              id: authUser.id,
              name: authUser.email.split('@')[0],
              email: authUser.email,
              phone: '',
              systemGroup: 'Employee', // Default role
              status: 'Active',
              createdAt: new Date().toISOString(),
              get role() { return this.systemGroup; }
            };
            setCurrentUser(basicUser);
            console.log('✅ Created basic user with Employee role');
          }
        }

        // Create permission utilities
        if (systemGroupsData.length > 0) {
          console.log('🔧 Creating permission utilities...');
          createPermissionUtils(usersData, systemGroupsData);
          console.log('✅ Permission utilities ready');
        }

      } catch (error) {
        console.error('❌ RBAC initialization failed:', error);
        // Don't leave the system in loading state on error
      } finally {
        setLoading(false);
        console.log('✅ RBAC initialization complete');
      }
    };

    // Only initialize once when auth user is available
    if (authUser && loading) {
      initializeData();
    }
  }, [authUser?.email, authUser?.id]); // Simplified dependencies

  // Don't re-run permission utils creation on every change
  useEffect(() => {
    if (!loading && roles.length > 0 && users.length > 0) {
      console.log('🔄 Updating permission utilities after data change...');
      try {
        createPermissionUtils(users, roles);
        console.log('✅ Permission utilities updated');
      } catch (error) {
        console.error('❌ Error updating permission utilities:', error);
      }
    }
  }, [roles.length, users.length, loading]); // Only trigger on length changes
};
