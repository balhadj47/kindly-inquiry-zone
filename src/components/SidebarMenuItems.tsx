import { useMemo } from 'react';
import { 
  Calendar, 
  Building2, 
  Database, 
  Car,
  Users,
  PlusCircle,
  History,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRBAC } from '@/contexts/RBACContext';
import { getRoleNameFromId } from '@/utils/roleUtils';

export const useSidebarMenuItems = () => {
  const { t } = useLanguage();
  const { hasPermission, currentUser, roles, loading } = useRBAC();

  // Memoize menu items definition
  const menuItems = useMemo(() => [
    {
      title: t.dashboard,
      href: '/dashboard',
      icon: Database,
      permission: 'dashboard:read',
      badge: null,
    },
    {
      title: t.companies,
      href: '/companies',
      icon: Building2,
      permission: 'companies:read',
      badge: null,
    },
    {
      title: 'Camionnettes',
      href: '/vans',
      icon: Car,
      permission: 'vans:read',
      badge: null,
    },
    {
      title: t.users,
      href: '/users',
      icon: Users,
      permission: 'users:read',
      badge: null,
    },
    {
      title: 'Enregistrer une Mission',
      href: '/trip-logger',
      icon: PlusCircle,
      permission: 'trips:create',
      badge: null,
    },
    {
      title: 'Historique des Missions',
      href: '/trip-history',
      icon: History,
      permission: 'trips:read',
      badge: null,
    },
  ], [t]);

  // Filter menu items based on permissions
  const filteredMenuItems = useMemo(() => {
    console.log('=== SIDEBAR MENU DEBUG ===');
    console.log('Loading state:', loading);
    console.log('Current user:', currentUser?.id, currentUser?.role_id);
    console.log('Roles loaded:', roles.length);
    console.log('Available roles:', roles.map(r => ({ name: r.name, permissions: r.permissions })));
    
    // Add detailed permission checking for each menu item
    console.log('=== PERMISSION CHECKS ===');
    menuItems.forEach(item => {
      const hasAccess = hasPermission(item.permission);
      console.log(`Menu: "${item.title}" (${item.permission}) = ${hasAccess}`);
    });
    
    // If still loading, show limited items to avoid confusion
    if (loading || !currentUser) {
      console.log('Still loading or no user, showing dashboard only');
      return menuItems.filter(item => item.permission === 'dashboard:read');
    }

    // If no roles loaded yet, show limited items
    if (roles.length === 0) {
      console.log('No roles loaded yet, showing dashboard only');
      return menuItems.filter(item => item.permission === 'dashboard:read');
    }

    // Filter items based on permissions
    const filtered = menuItems.filter(item => {
      const hasPermissionForItem = hasPermission(item.permission);
      console.log(`Final filter: "${item.title}" (${item.permission}): ${hasPermissionForItem}`);
      return hasPermissionForItem;
    });

    console.log('Final filtered menu items:', filtered.map(item => `${item.title} (${item.href})`));
    console.log('=== END SIDEBAR MENU DEBUG ===');
    
    return filtered;
  }, [menuItems, hasPermission, currentUser, roles, loading]);

  return filteredMenuItems;
};
