// Permission list mapped to roles
const ROLE_PERMISSIONS = {
  'Super Admin': ['all'],
  'Admin': ['all'],
  'Store Manager': ['dashboard', 'orders', 'inventory', 'recipes'],
  'Barista': ['kds'],
  'Inventory Manager': ['inventory'],
  'Finance Manager': ['financials', 'analytics'],
};

/**
 * Check if a given role has permission to access a specific feature/resource
 * @param {string} role
 * @param {string} permission
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  if (!role) return false;

  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;

  if (permissions.includes('all')) return true;
  return permissions.includes(permission);
};
