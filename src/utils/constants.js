export const ORDER_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  READY: 'Ready',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
};

export const ORDER_PRIORITY = {
  NORMAL: 'normal',
  RUSH: 'rush',
  VIP: 'vip',
};

export const USER_ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  STORE_MANAGER: 'Store Manager',
  BARISTA: 'Barista',
  INVENTORY_MANAGER: 'Inventory Manager',
  FINANCE_MANAGER: 'Finance Manager',
};

export const TAX_RATES = {
  D2C: 0.18,   // 18% GST for retail merchandise/products
  KIOSK: 0.05, // 5% GST for F&B items
};
