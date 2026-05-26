/* ============================================
   MOCK DATA — Digital Coffee Platform
   Comprehensive realistic data for all interfaces
   ============================================ */

// ── Products ──
export const products = [
  {
    id: 'prod-001',
    title: 'Strong Chilled Coffee Core',
    description: 'High-intensity extract pulled from selected premium estate beans. Bold, clean, and slow-brewed to perfection. Perfect for high-energy mornings.',
    shortDescription: 'High-intensity extract bottle. Bold and clean.',
    price: 240,
    originalPrice: 290,
    category: 'Chilled Coffee Core',
    tags: ['bestseller', 'recommended'],
    rating: 4.9,
    reviewCount: 312,
    imageUrl: '/images/products/cold-brew.png',
    images: [
      '/images/products/cold-brew.png'
    ],
    variants: [
      { id: 'v1', name: 'Single Bottle (300ml)', price: 240 },
      { id: 'v2', name: '2 Bottle Combo Pack', price: 450 },
      { id: 'v3', name: '4 Bottle Combo Pack', price: 850 },
      { id: 'v4', name: '6 Bottle Combo Pack', price: 1200 }
    ],
    inStock: true,
    stockQty: 85,
  },
  {
    id: 'prod-002',
    title: 'Balanced Chilled Coffee Core',
    description: 'Smooth and refined. Our signature balanced cold brew concentrate features high-density caramel and chocolate tones with zero acidity.',
    shortDescription: 'Smooth and refined classic cold brew bottle.',
    price: 220,
    originalPrice: null,
    category: 'Chilled Coffee Core',
    tags: ['popular'],
    rating: 4.8,
    reviewCount: 198,
    imageUrl: '/images/products/iced-coffee.png',
    images: [
      '/images/products/iced-coffee.png'
    ],
    variants: [
      { id: 'v1', name: 'Single Bottle (300ml)', price: 220 },
      { id: 'v2', name: '2 Bottle Combo Pack', price: 400 },
      { id: 'v3', name: '4 Bottle Combo Pack', price: 750 },
      { id: 'v4', name: '6 Bottle Combo Pack', price: 1100 }
    ],
    inStock: true,
    stockQty: 60,
  },
  {
    id: 'prod-003',
    title: 'Subtle Notes Chilled Coffee',
    description: 'A light, bright, and fruity cup highlighting premium floral and citrus tones sourced ethically from high-altitude estates.',
    shortDescription: 'Light and fruity specialty chilled coffee.',
    price: 200,
    originalPrice: 220,
    category: 'Chilled Coffee Core',
    tags: [],
    rating: 4.7,
    reviewCount: 94,
    imageUrl: '/images/products/espresso.png',
    images: [
      '/images/products/espresso.png'
    ],
    variants: [
      { id: 'v1', name: 'Single Bottle (300ml)', price: 200 },
      { id: 'v2', name: '2 Bottle Combo Pack', price: 380 },
      { id: 'v3', name: '4 Bottle Combo Pack', price: 700 }
    ],
    inStock: true,
    stockQty: 40,
  },
  {
    id: 'prod-004',
    title: 'South Indian Filter Coffee',
    description: 'Authentic 70:30 chicory espresso extract. Intensely aromatic, rich, and designed for a perfect traditional frothy milk pour.',
    shortDescription: 'Traditional 70:30 chicory filter coffee extract.',
    price: 180,
    originalPrice: null,
    category: 'Chilled Coffee Core',
    tags: ['new', 'recommended'],
    rating: 4.9,
    reviewCount: 420,
    imageUrl: '/images/products/filter-coffee.png',
    images: [
      '/images/products/filter-coffee.png'
    ],
    variants: [
      { id: 'v1', name: 'Single Bottle (300ml)', price: 180 },
      { id: 'v2', name: '2 Bottle Combo Pack', price: 340 }
    ],
    inStock: true,
    stockQty: 95,
  },
  {
    id: 'prod-005',
    title: 'Professional Measured Pourer',
    description: 'Food-grade stainless steel pourer designed to dispense cold brew concentrates down to the exact milliliter.',
    shortDescription: 'dispenser for exact recipe measurement.',
    price: 299,
    originalPrice: null,
    category: 'Accessories',
    tags: [],
    rating: 4.6,
    reviewCount: 45,
    imageUrl: '/images/products/cappuccino.png',
    images: [
      '/images/products/cappuccino.png'
    ],
    variants: [
      { id: 'v1', name: 'Standard Steel', price: 299 }
    ],
    inStock: true,
    stockQty: 120,
  },
  {
    id: 'prod-006',
    title: 'Premium Shaker Glass',
    description: 'Heavyweight glass & leak-proof steel shaker. Perfect for aerating cold coffee and creating standard frothy lattes at home.',
    shortDescription: 'Coffee shaker to aerate and foam your brews.',
    price: 699,
    originalPrice: 850,
    category: 'Accessories',
    tags: ['popular'],
    rating: 4.8,
    reviewCount: 88,
    imageUrl: '/images/products/matcha-latte.png',
    images: [
      '/images/products/matcha-latte.png'
    ],
    variants: [
      { id: 'v1', name: 'Standard Shaker', price: 699 }
    ],
    inStock: true,
    stockQty: 48,
  },
  {
    id: 'prod-007',
    title: 'Digital Coffee Embroidered Cap',
    description: 'Premium organic cotton embroidered baseball cap. High quality stitching featuring Digital Coffee typography.',
    shortDescription: 'Organic cotton branded baseball cap.',
    price: 499,
    originalPrice: null,
    category: 'Merchandise',
    tags: ['new'],
    rating: 4.5,
    reviewCount: 37,
    imageUrl: '/images/products/cap.png',
    images: [
      '/images/products/cap.png'
    ],
    variants: [
      { id: 'v1', name: 'Universal Size', price: 499 }
    ],
    inStock: true,
    stockQty: 30,
  },
  {
    id: 'prod-008',
    title: 'Premium Cotton Oversized T-Shirt',
    description: '100% heavy organic cotton oversized tee. Features premium minimal branding and maximum breathability.',
    shortDescription: 'Organic cotton branded oversized t-shirt.',
    price: 999,
    originalPrice: 1299,
    category: 'Merchandise',
    tags: [],
    rating: 4.4,
    reviewCount: 52,
    imageUrl: '/images/products/tshirt.png',
    images: [
      '/images/products/tshirt.png'
    ],
    variants: [
      { id: 'v1', name: 'Medium (M)', price: 999 },
      { id: 'v2', name: 'Large (L)', price: 999 }
    ],
    inStock: true,
    stockQty: 25,
  },
];

export const categories = ['All', 'Chilled Coffee Core', 'Accessories', 'Merchandise'];

// ── Kiosk Menu Items ──
export const kioskMenu = [
  { id: 'k1', name: 'Strong Blend', price: 240, category: 'Chilled Coffee Core', image: '/images/products/cold-brew.png', popular: true },
  { id: 'k2', name: 'Balanced Blend', price: 220, category: 'Chilled Coffee Core', image: '/images/products/iced-coffee.png', popular: true },
  { id: 'k3', name: 'Subtle Notes', price: 200, category: 'Chilled Coffee Core', image: '/images/products/espresso.png', popular: false },
  { id: 'k4', name: 'South Indian Filter', price: 180, category: 'Chilled Coffee Core', image: '/images/products/filter-coffee.png', popular: true },
];

// ── Customization Options ──
export const customizationOptions = {
  bases: [
    { id: 'b1', name: 'Espresso', price: 100, icon: '☕' },
    { id: 'b2', name: 'Cold Brew', price: 120, icon: '🧊' },
    { id: 'b3', name: 'Matcha', price: 150, icon: '🍵' },
  ],
  milks: [
    { id: 'm1', name: 'Dairy Milk', price: 0, icon: '🥛', tag: 'Most Preferred' },
    { id: 'm2', name: 'Oat Milk', price: 50, icon: '🌾', tag: 'Recommended' },
    { id: 'm3', name: 'Almond Milk', price: 50, icon: '🌰' },
    { id: 'm4', name: 'Water', price: 0, icon: '💧' },
  ],
  syrups: [
    { id: 's1', name: 'Jaggery', price: 30, icon: '🍯', tag: 'Recommended' },
    { id: 's2', name: 'Sugar', price: 0, icon: '🍬' },
    { id: 's3', name: 'Honey', price: 40, icon: '🐝', tag: 'Most Preferred' },
    { id: 's4', name: 'Condensed Milk', price: 50, icon: '🥛' },
    { id: 's5', name: 'Cinnamon Infused Sugar Syrup', price: 40, icon: '✨' },
  ],
  toppings: [
    { id: 't1', name: 'Jaggery Powder', price: 15, icon: '🪵' },
    { id: 't2', name: 'Milk Cream', price: 25, icon: '🍨', tag: 'Most Preferred' },
    { id: 't3', name: 'Dark Chocolate', price: 20, icon: '🍫' },
    { id: 't4', name: 'Cinnamon Powder', price: 10, icon: '✨' },
    { id: 't5', name: 'Basil Leaves', price: 10, icon: '🌿' },
    { id: 't6', name: 'Mint Leaves', price: 10, icon: '🍃' },
    { id: 't7', name: 'Ginger Slices', price: 15, icon: '🫚' },
    { id: 't8', name: 'Rose Petals', price: 20, icon: '🌹' },
  ],
  cupSizes: [
    { id: 'cs1', name: 'Small', label: 'S', ml: '250ml', priceModifier: 0 },
    { id: 'cs2', name: 'Standard', label: 'STD', ml: '360ml', priceModifier: 30 },
  ],
  temperatures: ['Hot', 'Iced'],
  sweetnessLevels: ['No Sugar', 'Light', 'Regular', 'Extra Sweet'],
  iceLevels: ['No Ice', 'Less Ice', 'Regular', 'Extra Ice'],
};

// ── Ingredient Compatibility Rules ──
export const compatibilityRules = [
  { base: 'Cold Brew', disabledMilks: [], disabledSyrups: [], notes: 'No hot milk' },
  { base: 'Matcha', forcedMilk: 'Oat Milk', disabledMilks: ['Whole Milk', 'Soy Milk'], disabledSyrups: ['Mocha'], notes: 'Best with oat milk' },
  { base: 'Chai', disabledMilks: ['Coconut Milk'], disabledSyrups: ['Peppermint'], notes: 'Traditional pairing' },
];

// ── Orders ──
export const orders = [
  { id: 'ORD-1001', customer: 'Rahul Sharma', email: 'rahul@gmail.com', items: [{ name: 'Dark Roast (M)', qty: 2, price: 999 }], total: 1998, status: 'Pending', source: 'D2C', time: '2 mins ago', createdAt: '2026-05-21T14:30:00Z', paymentMethod: 'UPI', address: '123 MG Road, Bengaluru' },
  { id: 'ORD-1002', customer: 'Priya Patel', email: 'priya@gmail.com', items: [{ name: 'Vanilla Cold Brew (L)', qty: 1, price: 1199 }, { name: 'Hazelnut Dream', qty: 1, price: 1099 }], total: 2298, status: 'In Progress', source: 'Kiosk', time: '5 mins ago', createdAt: '2026-05-21T14:25:00Z', paymentMethod: 'Card', address: 'Store #2 - Koramangala' },
  { id: 'ORD-1003', customer: 'Amit Kumar', email: 'amit@gmail.com', items: [{ name: 'Espresso Blend 500g', qty: 1, price: 1499 }], total: 1499, status: 'Completed', source: 'D2C', time: '1 hour ago', createdAt: '2026-05-21T13:30:00Z', paymentMethod: 'UPI', address: '45 Indiranagar, Bengaluru' },
  { id: 'ORD-1004', customer: 'Sneha Reddy', email: 'sneha@gmail.com', items: [{ name: 'Mocha Magic (M)', qty: 3, price: 1149 }], total: 3447, status: 'Completed', source: 'D2C', time: '3 hours ago', createdAt: '2026-05-21T11:30:00Z', paymentMethod: 'Wallet', address: '78 HSR Layout, Bengaluru' },
  { id: 'ORD-1005', customer: 'Vikram Singh', email: 'vikram@gmail.com', items: [{ name: 'Cappuccino (L)', qty: 1, price: 250 }], total: 250, status: 'Ready', source: 'Kiosk', time: '8 mins ago', createdAt: '2026-05-21T14:22:00Z', paymentMethod: 'Card', address: 'Store #1 - HSR' },
  { id: 'ORD-1006', customer: 'Ananya Gupta', email: 'ananya@gmail.com', items: [{ name: 'Matcha Latte Kit', qty: 1, price: 1499 }], total: 1499, status: 'Cancelled', source: 'D2C', time: '1 day ago', createdAt: '2026-05-20T10:00:00Z', paymentMethod: 'UPI', address: '12 Whitefield, Bengaluru' },
];

// ── Barista Queue ──
export const baristaOrders = [
  {
    id: 'ORD-1001', customer: 'Rahul Sharma', items: ['Dark Roast (M) x2'], status: 'Pending', time: '2 mins ago', priority: 'normal', source: 'D2C',
    slaMinutes: 10, elapsedMinutes: 2,
    kot: {
      steps: ['Grind 20g dark roast beans to medium-fine', 'Brew with 300ml water at 94°C for 4 minutes', 'Pour into medium cup, serve hot'],
      ingredients: [{ name: '20g Dark Roast Beans', available: true }, { name: '300ml Filtered Water', available: true }],
      temperature: 'Hot', cupSize: 'Medium', specialNotes: 'Extra hot requested'
    }
  },
  {
    id: 'ORD-1002', customer: 'Priya Patel', items: ['Vanilla Cold Brew (L)', 'Hazelnut Dream (M)'], status: 'Pending', time: '5 mins ago', priority: 'rush', source: 'Kiosk',
    slaMinutes: 8, elapsedMinutes: 5,
    kot: {
      steps: ['Pour 200ml cold brew concentrate into large cup', 'Add vanilla syrup (15ml)', 'Add ice and top with 100ml cold water', 'Prepare Hazelnut Dream: brew 250ml medium roast', 'Add hazelnut syrup (20ml) and serve'],
      ingredients: [{ name: '200ml Cold Brew', available: true }, { name: '15ml Vanilla Syrup', available: true }, { name: 'Ice', available: true }, { name: '20ml Hazelnut Syrup', available: true }],
      temperature: 'Iced', cupSize: 'Large', specialNotes: 'No sugar in cold brew'
    }
  },
  {
    id: 'ORD-1005', customer: 'Vikram Singh', items: ['Cappuccino (L)'], status: 'In Progress', time: '8 mins ago', priority: 'normal', source: 'Kiosk',
    slaMinutes: 7, elapsedMinutes: 4,
    kot: {
      steps: ['Pull 2 espresso shots (36ml)', 'Steam 200ml whole milk to 65°C with thick foam', 'Pour steamed milk over espresso', 'Top with foam dome and dust with cocoa'],
      ingredients: [{ name: '2 Espresso Shots', available: true }, { name: '200ml Whole Milk', available: true }, { name: 'Cocoa Powder', available: true }],
      temperature: 'Hot', cupSize: 'Large', specialNotes: ''
    }
  },
  {
    id: 'ORD-1007', customer: 'Meera Joshi', items: ['Iced Americano (M)'], status: 'Completed', time: '15 mins ago', priority: 'normal', source: 'Kiosk',
    slaMinutes: 5, elapsedMinutes: 4,
    kot: {
      steps: ['Pull 2 espresso shots', 'Fill medium cup with ice', 'Pour espresso over ice', 'Top with cold water'],
      ingredients: [{ name: '2 Espresso Shots', available: true }, { name: 'Ice', available: true }, { name: 'Cold Water', available: true }],
      temperature: 'Iced', cupSize: 'Medium', specialNotes: ''
    }
  },
];

// ── Customers ──
export const customers = [
  { id: 'cust-001', name: 'Rahul Sharma', email: 'rahul@gmail.com', phone: '+91 98765 43210', orders: 12, totalSpent: 14500, status: 'Active', joinedDate: '2025-11-15', lastOrder: '2026-05-21', favoriteItem: 'Dark Roast Concentrate', segment: 'VIP' },
  { id: 'cust-002', name: 'Priya Patel', email: 'priya@gmail.com', phone: '+91 87654 32109', orders: 8, totalSpent: 9200, status: 'Active', joinedDate: '2025-12-01', lastOrder: '2026-05-21', favoriteItem: 'Vanilla Cold Brew', segment: 'Regular' },
  { id: 'cust-003', name: 'Amit Kumar', email: 'amit@gmail.com', phone: '+91 76543 21098', orders: 5, totalSpent: 6800, status: 'Active', joinedDate: '2026-01-10', lastOrder: '2026-05-21', favoriteItem: 'Espresso Blend', segment: 'Regular' },
  { id: 'cust-004', name: 'Sneha Reddy', email: 'sneha@gmail.com', phone: '+91 65432 10987', orders: 22, totalSpent: 28500, status: 'Active', joinedDate: '2025-08-20', lastOrder: '2026-05-21', favoriteItem: 'Mocha Magic', segment: 'VIP' },
  { id: 'cust-005', name: 'Vikram Singh', email: 'vikram@gmail.com', phone: '+91 54321 09876', orders: 3, totalSpent: 2100, status: 'Active', joinedDate: '2026-03-15', lastOrder: '2026-05-21', favoriteItem: 'Cappuccino', segment: 'New' },
  { id: 'cust-006', name: 'Ananya Gupta', email: 'ananya@gmail.com', phone: '+91 43210 98765', orders: 1, totalSpent: 1499, status: 'Inactive', joinedDate: '2026-04-01', lastOrder: '2026-05-20', favoriteItem: 'Matcha Latte Kit', segment: 'At Risk' },
];

// ── Inventory ──
export const storeInventory = [
  { id: 'inv-001', name: 'Coffee Concentrate', stock: 5000, unit: 'ml', threshold: 1000, category: 'Raw Material', lastRestocked: '2026-05-20', costPerUnit: 0.5 },
  { id: 'inv-002', name: 'Vanilla Syrup', stock: 2000, unit: 'ml', threshold: 500, category: 'Syrup', lastRestocked: '2026-05-18', costPerUnit: 0.8 },
  { id: 'inv-003', name: 'Oat Milk', stock: 10000, unit: 'ml', threshold: 2000, category: 'Dairy Alt', lastRestocked: '2026-05-19', costPerUnit: 0.3 },
  { id: 'inv-004', name: 'Coffee Beans (Arabica)', stock: 5000, unit: 'g', threshold: 1000, category: 'Raw Material', lastRestocked: '2026-05-17', costPerUnit: 2.5 },
  { id: 'inv-005', name: 'Caramel Syrup', stock: 800, unit: 'ml', threshold: 500, category: 'Syrup', lastRestocked: '2026-05-15', costPerUnit: 0.9 },
  { id: 'inv-006', name: 'Whole Milk', stock: 15000, unit: 'ml', threshold: 3000, category: 'Dairy', lastRestocked: '2026-05-21', costPerUnit: 0.1 },
  { id: 'inv-007', name: 'Chocolate Powder', stock: 3000, unit: 'g', threshold: 500, category: 'Powder', lastRestocked: '2026-05-16', costPerUnit: 1.2 },
  { id: 'inv-008', name: 'Cups (Medium)', stock: 450, unit: 'pcs', threshold: 100, category: 'Packaging', lastRestocked: '2026-05-20', costPerUnit: 5 },
];

export const centralInventory = [
  { id: 'cinv-001', name: 'Raw Coffee Beans', stock: 500, unit: 'kg', threshold: 100, vendor: 'Karnataka Estates', batchNo: 'B-2026-05A', expiryDate: '2026-11-30' },
  { id: 'cinv-002', name: 'Concentrate Batch A', stock: 100, unit: 'liters', threshold: 20, vendor: 'In-house', batchNo: 'CB-2026-05', expiryDate: '2026-08-15' },
  { id: 'cinv-003', name: 'Packaging Boxes', stock: 1000, unit: 'pcs', threshold: 200, vendor: 'PackCo India', batchNo: 'PK-2026-05', expiryDate: null },
  { id: 'cinv-004', name: 'Vanilla Extract (Madagascar)', stock: 50, unit: 'liters', threshold: 10, vendor: 'Spice Route Imports', batchNo: 'VE-2026-04', expiryDate: '2027-04-01' },
];

// ── Roles ──
export const roles = [
  { id: 'role-001', name: 'Super Admin', users: 1, permissions: ['All Access'], description: 'Full system access' },
  { id: 'role-002', name: 'Admin', users: 2, permissions: ['All Access'], description: 'Administrative access' },
  { id: 'role-003', name: 'Store Manager', users: 3, permissions: ['Dashboard', 'Orders', 'Inventory', 'Reports'], description: 'Store-level management' },
  { id: 'role-004', name: 'Barista', users: 8, permissions: ['Order Queue', 'Recipe View'], description: 'Kitchen operations only' },
  { id: 'role-005', name: 'Inventory Manager', users: 2, permissions: ['Inventory', 'Purchase Orders', 'Vendors'], description: 'Inventory operations' },
  { id: 'role-006', name: 'Finance Manager', users: 1, permissions: ['Reports', 'Financials', 'GST'], description: 'Financial operations' },
];

// ── Stores ──
export const stores = [
  { id: 'store-001', name: 'Digital Coffee HSR Layout', address: '27th Main, HSR Layout, Bengaluru', status: 'Active', orders: 145, revenue: 89500, rating: 4.7 },
  { id: 'store-002', name: 'Digital Coffee Koramangala', address: '80ft Road, Koramangala, Bengaluru', status: 'Active', orders: 210, revenue: 128000, rating: 4.8 },
  { id: 'store-003', name: 'Digital Coffee Indiranagar', address: '100ft Road, Indiranagar, Bengaluru', status: 'Active', orders: 178, revenue: 105000, rating: 4.6 },
  { id: 'store-004', name: 'Digital Coffee Whitefield', address: 'ITPL Main Road, Whitefield, Bengaluru', status: 'Coming Soon', orders: 0, revenue: 0, rating: 0 },
];

// ── Analytics Data ──
export const analyticsData = {
  revenue: {
    today: 45200,
    yesterday: 38900,
    thisWeek: 285000,
    thisMonth: 1125000,
    lastMonth: 987000,
    growth: 14,
  },
  orders: {
    today: 89,
    yesterday: 76,
    thisWeek: 520,
    thisMonth: 2100,
    pending: 12,
    inProgress: 5,
  },
  customers: {
    total: 1245,
    active: 890,
    new: 67,
    retention: 72,
  },
  topProducts: [
    { name: 'Dark Roast Concentrate', sales: 350, revenue: 349650 },
    { name: 'Vanilla Cold Brew', sales: 220, revenue: 263780 },
    { name: 'Mocha Magic', sales: 180, revenue: 206820 },
    { name: 'Espresso Blend', sales: 150, revenue: 127350 },
    { name: 'Hazelnut Dream', sales: 120, revenue: 131880 },
  ],
  weeklyRevenue: [
    { day: 'Mon', revenue: 35000, orders: 68 },
    { day: 'Tue', revenue: 42000, orders: 82 },
    { day: 'Wed', revenue: 38000, orders: 74 },
    { day: 'Thu', revenue: 55000, orders: 102 },
    { day: 'Fri', revenue: 48000, orders: 94 },
    { day: 'Sat', revenue: 72000, orders: 135 },
    { day: 'Sun', revenue: 65000, orders: 120 },
  ],
  hourlyOrders: [
    { hour: '8AM', orders: 12 }, { hour: '9AM', orders: 25 }, { hour: '10AM', orders: 18 },
    { hour: '11AM', orders: 22 }, { hour: '12PM', orders: 30 }, { hour: '1PM', orders: 28 },
    { hour: '2PM', orders: 15 }, { hour: '3PM', orders: 20 }, { hour: '4PM', orders: 35 },
    { hour: '5PM', orders: 40 }, { hour: '6PM', orders: 32 }, { hour: '7PM', orders: 18 },
  ],
  monthlyRevenue: [
    { month: 'Jan', revenue: 720000 }, { month: 'Feb', revenue: 850000 },
    { month: 'Mar', revenue: 930000 }, { month: 'Apr', revenue: 987000 },
    { month: 'May', revenue: 1125000 },
  ],
};

// ── Recipes ──
export const recipes = [
  {
    id: 'rec-001', name: 'Classic Espresso', version: '2.1',
    ingredients: [
      { name: 'Arabica Coffee Beans', quantity: 18, unit: 'g', inventoryId: 'inv-004' },
      { name: 'Filtered Water', quantity: 36, unit: 'ml', inventoryId: null },
    ],
    steps: ['Grind beans to fine (18g)', 'Tamp evenly at 30lbs pressure', 'Extract for 25-30 seconds', 'Target output: 36ml'],
    prepTime: 3, category: 'Hot Coffee', active: true,
    costPerCup: 25, sellingPrice: 180,
  },
  {
    id: 'rec-002', name: 'Cappuccino', version: '1.5',
    ingredients: [
      { name: 'Arabica Coffee Beans', quantity: 18, unit: 'g', inventoryId: 'inv-004' },
      { name: 'Whole Milk', quantity: 150, unit: 'ml', inventoryId: 'inv-006' },
    ],
    steps: ['Pull double espresso (36ml)', 'Steam 150ml milk to 65°C with thick microfoam', 'Pour with latte art technique', 'Serve immediately'],
    prepTime: 5, category: 'Hot Coffee', active: true,
    costPerCup: 35, sellingPrice: 220,
  },
  {
    id: 'rec-003', name: 'Vanilla Cold Brew', version: '3.0',
    ingredients: [
      { name: 'Cold Brew Concentrate', quantity: 200, unit: 'ml', inventoryId: 'inv-001' },
      { name: 'Vanilla Syrup', quantity: 15, unit: 'ml', inventoryId: 'inv-002' },
      { name: 'Ice', quantity: 100, unit: 'g', inventoryId: null },
    ],
    steps: ['Pour 200ml cold brew concentrate into large cup', 'Add 15ml vanilla syrup', 'Fill with ice', 'Top with cold water if needed'],
    prepTime: 2, category: 'Iced Coffee', active: true,
    costPerCup: 45, sellingPrice: 240,
  },
];

// ── CMS Banners ──
export const banners = [
  { id: 'ban-001', title: 'Summer Special ☀️', subtitle: 'Get 20% off on all cold brews this summer', active: true, position: 'hero', ctaText: 'Shop Now', ctaLink: '/catalog' },
  { id: 'ban-002', title: 'New Arrival 🌟', subtitle: 'Try our new Matcha Latte Kit — straight from Uji, Japan', active: true, position: 'hero', ctaText: 'Explore', ctaLink: '/catalog' },
  { id: 'ban-003', title: 'Subscribe & Save', subtitle: 'Weekly coffee plans starting at ₹799/week', active: false, position: 'promo', ctaText: 'Learn More', ctaLink: '/subscription' },
];

// ── Testimonials ──
export const testimonials = [
  { id: 't1', name: 'Rahul S.', text: 'The Dark Roast concentrate is incredible! I save ₹200 per week compared to buying from cafés.', rating: 5, avatar: 'RS' },
  { id: 't2', name: 'Priya P.', text: 'Love the subscription plan. Fresh coffee delivered every Monday morning. Life changing!', rating: 5, avatar: 'PP' },
  { id: 't3', name: 'Amit K.', text: 'Best espresso beans I\'ve found in India. The small batch quality really shows.', rating: 4, avatar: 'AK' },
  { id: 't4', name: 'Sneha R.', text: 'The Mocha Magic is like having a barista at home. My kids love it too!', rating: 5, avatar: 'SR' },
];

// ── Notification Templates ──
export const notificationTemplates = [
  { id: 'nt-001', name: 'Order Confirmation', channel: 'WhatsApp', content: 'Hi {name}! Your order #{orderId} has been confirmed. Track it here: {trackingLink}', active: true },
  { id: 'nt-002', name: 'Order Ready', channel: 'WhatsApp', content: 'Your order #{orderId} is ready for pickup! Token: {token}', active: true },
  { id: 'nt-003', name: 'Payment Failed', channel: 'SMS', content: 'Payment failed for order #{orderId}. Please retry: {retryLink}', active: true },
  { id: 'nt-004', name: 'Weekly Newsletter', channel: 'Email', content: 'This week at Digital Coffee: New arrivals, offers, and more!', active: false },
];

// ── Activity Log ──
export const activityLog = [
  { id: 'act-001', user: 'Admin', action: 'Updated product price', resource: 'Dark Roast Concentrate', timestamp: '2026-05-21T14:30:00Z', details: 'Price changed from ₹1199 to ₹999' },
  { id: 'act-002', user: 'Store Manager', action: 'Restocked inventory', resource: 'Whole Milk', timestamp: '2026-05-21T12:00:00Z', details: 'Added 5000ml to Store #1' },
  { id: 'act-003', user: 'Admin', action: 'Created new recipe', resource: 'Mango Tango Shake', timestamp: '2026-05-21T10:15:00Z', details: 'New seasonal recipe added' },
  { id: 'act-004', user: 'Barista', action: 'Completed order', resource: 'ORD-1007', timestamp: '2026-05-21T14:15:00Z', details: 'Iced Americano prepared in 4 mins' },
  { id: 'act-005', user: 'Admin', action: 'Activated banner', resource: 'Summer Special', timestamp: '2026-05-21T09:00:00Z', details: 'Hero banner activated' },
];

// ── Subscription Plans ──
export const subscriptionPlans = [
  { id: 'sub-001', name: 'Starter', price: 799, frequency: 'Weekly', items: '2 Concentrates', features: ['Free delivery', '2 bottles/week', 'Pause anytime'], popular: false },
  { id: 'sub-002', name: 'Coffee Lover', price: 1499, frequency: 'Weekly', items: '4 Concentrates + 1 Specialty', features: ['Free delivery', '5 items/week', 'Priority support', '10% discount'], popular: true },
  { id: 'sub-003', name: 'Office Pack', price: 3999, frequency: 'Weekly', items: '10 Mixed Items', features: ['Free delivery', '10 items/week', 'Bulk pricing', 'Dedicated manager'], popular: false },
];

// ── Coupon Codes ──
export const coupons = [
  { code: 'WELCOME20', discount: 20, type: 'percentage', minOrder: 500, maxDiscount: 200, active: true, expiresAt: '2026-06-30' },
  { code: 'FLAT100', discount: 100, type: 'flat', minOrder: 999, maxDiscount: 100, active: true, expiresAt: '2026-12-31' },
  { code: 'SUMMER15', discount: 15, type: 'percentage', minOrder: 0, maxDiscount: 300, active: true, expiresAt: '2026-08-31' },
];
