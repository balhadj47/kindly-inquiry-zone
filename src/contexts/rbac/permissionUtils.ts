
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

let permissionCache = new Map<string, boolean>();
let currentAuthUser: User | null = null;
let systemGroupsData: SystemGroup[] = [];

export const createPermissionUtils = (users: User[], systemGroups: SystemGroup[]) => {
  console.log('🔧 Creating auth-first permission utils with:', { 
    usersCount: users.length, 
    systemGroupsCount: systemGroups.length,
    systemGroups: systemGroups.map(g => ({ name: g.name, permissions: g.permissions }))
  });
  
  if (systemGroups.length === 0) {
    console.warn('⚠️ Skipping permission utils creation - missing system groups');
    return;
  }

  // Store the current auth user (should be only one)
  currentAuthUser = users.length > 0 ? users[0] : null;
  systemGroupsData = systemGroups;
  permissionCache.clear();
  console.log('✅ Auth-first permission utilities created successfully');
};

export const hasPermission = (userId: string, permission: string): boolean => {
  const cacheKey = `${userId}-${permission}`;
  
  // Check cache first
  if (permissionCache.has(cacheKey)) {
    const result = permissionCache.get(cacheKey)!;
    console.log(`🔐 Cache hit: ${permission} = ${result} for user ${userId}`);
    return result;
  }

  try {
    console.log(`🔐 Checking permission: ${permission} for user ${userId}`);
    
    // Use current auth user instead of looking up in users array
    const user = currentAuthUser;
    if (!user || user.id.toString() !== userId.toString()) {
      console.warn(`⚠️ User not found or mismatch: ${userId}`);
      permissionCache.set(cacheKey, false);
      return false;
    }

    console.log(`👤 Found auth user: ${user.id} with role_id: ${user.role_id}`);

    // For role_id 1 (Administrator), grant all permissions
    if (user.role_id === 1) {
      console.log('🔓 Administrator user detected, granting all permissions:', permission);
      permissionCache.set(cacheKey, true);
      return true;
    }

    // Find the user's role/group by role_id
    const userRole = systemGroupsData.find(role => {
      return parseInt(role.id) === user.role_id;
    });

    if (!userRole) {
      console.warn(`⚠️ Role not found for user ${userId} with role_id ${user.role_id}`);
      console.log('Available roles:', systemGroupsData.map(r => ({ id: r.id, name: r.name })));
      permissionCache.set(cacheKey, false);
      return false;
    }

    console.log(`🎯 Found user role: ${userRole.name} with permissions:`, userRole.permissions);

    // Check if the role has the required permission
    const hasAccess = userRole.permissions.includes(permission);
    
    permissionCache.set(cacheKey, hasAccess);
    console.log(`🔐 Permission check result: ${permission} = ${hasAccess} for user ${userId} (role: ${userRole.name})`);
    
    return hasAccess;
  } catch (error) {
    console.error('❌ Error checking permission:', error);
    permissionCache.set(cacheKey, false);
    return false;
  }
};

export const clearPermissionCache = () => {
  console.log('🧹 Clearing permission cache');
  permissionCache.clear();
};

export const getUserPermissions = (userId: string): string[] => {
  try {
    const user = currentAuthUser;
    if (!user || user.id.toString() !== userId.toString()) return [];

    // Find the user's role/group by role_id
    const userRole = systemGroupsData.find(role => {
      return parseInt(role.id) === user.role_id;
    });

    return userRole?.permissions || [];
  } catch (error) {
    console.error('❌ Error getting user permissions:', error);
    return [];
  }
};
