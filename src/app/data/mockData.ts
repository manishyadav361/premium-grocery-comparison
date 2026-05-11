export interface PlatformData {
  price: number;
  mrp: number;
  deliveryFee: number;
  eta: string;
  inStock: boolean;
  discount: number;
  coupon?: string;
  url?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  variant: string;
  rating: number;
  reviews: number;
  platforms: {
    blinkit: PlatformData;
    zepto: PlatformData;
    instamart: PlatformData;
  };
  priceHistory: { date: string; blinkit: number; zepto: number; instamart: number }[];
  tags: string[];
}

export const PLATFORMS = {
  blinkit: {
    name: 'Blinkit',
    color: '#F8CB46',
    textColor: '#000000',
    bgClass: 'bg-yellow-400',
    logo: '⚡',
    scheme: '#F8CB46',
  },
  zepto: {
    name: 'Zepto',
    color: '#7C3AED',
    textColor: '#FFFFFF',
    bgClass: 'bg-purple-700',
    logo: '🟣',
    scheme: '#7C3AED',
  },
  instamart: {
    name: 'Instamart',
    color: '#FF6B35',
    textColor: '#FFFFFF',
    bgClass: 'bg-orange-500',
    logo: '🛒',
    scheme: '#FF6B35',
  },
};

export const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '🛒' },
  { id: 'dairy', label: 'Dairy', emoji: '🥛' },
  { id: 'snacks', label: 'Snacks', emoji: '🍿' },
  { id: 'fruits', label: 'Fruits', emoji: '🍎' },
  { id: 'personal-care', label: 'Personal Care', emoji: '🧴' },
  { id: 'beverages', label: 'Beverages', emoji: '🧃' },
  { id: 'cleaning', label: 'Cleaning', emoji: '🧹' },
  { id: 'bakery', label: 'Bakery', emoji: '🍞' },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Oral-B Pro 100 Electric Toothbrush',
    brand: 'Oral-B',
    category: 'personal-care',
    image: 'https://images.unsplash.com/photo-1550985543-f1ea83691cd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    variant: '1 pc, Rechargeable',
    rating: 4.5,
    reviews: 2847,
    platforms: {
      blinkit: { price: 699, mrp: 999, deliveryFee: 0, eta: '8 min', inStock: true, discount: 30, coupon: 'SAVE10' },
      zepto: { price: 649, mrp: 999, deliveryFee: 0, eta: '12 min', inStock: true, discount: 35 },
      instamart: { price: 719, mrp: 999, deliveryFee: 20, eta: '15 min', inStock: true, discount: 28 },
    },
    priceHistory: [
      { date: 'Jan 1', blinkit: 749, zepto: 699, instamart: 769 },
      { date: 'Jan 8', blinkit: 729, zepto: 679, instamart: 749 },
      { date: 'Jan 15', blinkit: 719, zepto: 659, instamart: 739 },
      { date: 'Jan 22', blinkit: 699, zepto: 649, instamart: 729 },
      { date: 'Feb 1', blinkit: 699, zepto: 649, instamart: 719 },
      { date: 'Feb 8', blinkit: 699, zepto: 649, instamart: 719 },
    ],
    tags: ['electric', 'rechargeable', 'oral-care'],
  },
  {
    id: '2',
    name: 'Colgate Strong Teeth Toothbrush',
    brand: 'Colgate',
    category: 'personal-care',
    image: 'https://images.unsplash.com/photo-1571942676516-bcab84649e44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    variant: 'Pack of 4, Soft Bristles',
    rating: 4.3,
    reviews: 5621,
    platforms: {
      blinkit: { price: 89, mrp: 120, deliveryFee: 0, eta: '10 min', inStock: true, discount: 26 },
      zepto: { price: 79, mrp: 120, deliveryFee: 0, eta: '9 min', inStock: true, discount: 34, coupon: 'COLGATE5' },
      instamart: { price: 85, mrp: 120, deliveryFee: 0, eta: '14 min', inStock: true, discount: 29 },
    },
    priceHistory: [
      { date: 'Jan 1', blinkit: 99, zepto: 89, instamart: 99 },
      { date: 'Jan 8', blinkit: 95, zepto: 85, instamart: 95 },
      { date: 'Jan 15', blinkit: 89, zepto: 79, instamart: 89 },
      { date: 'Jan 22', blinkit: 89, zepto: 79, instamart: 85 },
      { date: 'Feb 1', blinkit: 89, zepto: 79, instamart: 85 },
      { date: 'Feb 8', blinkit: 89, zepto: 79, instamart: 85 },
    ],
    tags: ['toothbrush', 'soft', 'pack'],
  },
  {
    id: '3',
    name: 'Amul Taaza Full Cream Milk',
    brand: 'Amul',
    category: 'dairy',
    image: 'https://images.unsplash.com/photo-1760273464017-4bb7dfa42d91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    variant: '1 L, Tetra Pack',
    rating: 4.7,
    reviews: 12450,
    platforms: {
      blinkit: { price: 68, mrp: 72, deliveryFee: 0, eta: '8 min', inStock: true, discount: 6 },
      zepto: { price: 68, mrp: 72, deliveryFee: 0, eta: '11 min', inStock: true, discount: 6 },
      instamart: { price: 70, mrp: 72, deliveryFee: 0, eta: '13 min', inStock: false, discount: 3 },
    },
    priceHistory: [
      { date: 'Jan 1', blinkit: 70, zepto: 70, instamart: 72 },
      { date: 'Jan 8', blinkit: 68, zepto: 70, instamart: 72 },
      { date: 'Jan 15', blinkit: 68, zepto: 68, instamart: 70 },
      { date: 'Jan 22', blinkit: 68, zepto: 68, instamart: 70 },
      { date: 'Feb 1', blinkit: 68, zepto: 68, instamart: 70 },
      { date: 'Feb 8', blinkit: 68, zepto: 68, instamart: 70 },
    ],
    tags: ['milk', 'dairy', 'full-cream'],
  },
  {
    id: '4',
    name: "Lay's Classic Salted Chips",
    brand: "Lay's",
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1741520149938-4f08654780ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    variant: '26g, Pack of 5',
    rating: 4.4,
    reviews: 8903,
    platforms: {
      blinkit: { price: 59, mrp: 75, deliveryFee: 0, eta: '9 min', inStock: true, discount: 21, coupon: 'LAYS15' },
      zepto: { price: 63, mrp: 75, deliveryFee: 0, eta: '10 min', inStock: true, discount: 16 },
      instamart: { price: 55, mrp: 75, deliveryFee: 15, eta: '18 min', inStock: true, discount: 27 },
    },
    priceHistory: [
      { date: 'Jan 1', blinkit: 70, zepto: 70, instamart: 65 },
      { date: 'Jan 8', blinkit: 65, zepto: 67, instamart: 60 },
      { date: 'Jan 15', blinkit: 62, zepto: 65, instamart: 58 },
      { date: 'Jan 22', blinkit: 59, zepto: 63, instamart: 55 },
      { date: 'Feb 1', blinkit: 59, zepto: 63, instamart: 55 },
      { date: 'Feb 8', blinkit: 59, zepto: 63, instamart: 55 },
    ],
    tags: ['chips', 'snacks', 'salted'],
  },
  {
    id: '5',
    name: 'Fresh Yellow Bananas',
    brand: 'Farm Fresh',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1600190190530-f7d419e8a7ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    variant: '6 pcs, ~500g',
    rating: 4.2,
    reviews: 3201,
    platforms: {
      blinkit: { price: 35, mrp: 45, deliveryFee: 0, eta: '10 min', inStock: true, discount: 22 },
      zepto: { price: 32, mrp: 45, deliveryFee: 0, eta: '12 min', inStock: true, discount: 29 },
      instamart: { price: 38, mrp: 45, deliveryFee: 0, eta: '16 min', inStock: true, discount: 16 },
    },
    priceHistory: [
      { date: 'Jan 1', blinkit: 42, zepto: 40, instamart: 44 },
      { date: 'Jan 8', blinkit: 39, zepto: 36, instamart: 41 },
      { date: 'Jan 15', blinkit: 37, zepto: 34, instamart: 39 },
      { date: 'Jan 22', blinkit: 35, zepto: 32, instamart: 38 },
      { date: 'Feb 1', blinkit: 35, zepto: 32, instamart: 38 },
      { date: 'Feb 8', blinkit: 35, zepto: 32, instamart: 38 },
    ],
    tags: ['fruits', 'banana', 'fresh'],
  },
  {
    id: '6',
    name: 'Dove Beauty Bar Soap',
    brand: 'Dove',
    category: 'personal-care',
    image: 'https://images.unsplash.com/photo-1556227702-b89ac3b94ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    variant: '100g, Pack of 3',
    rating: 4.6,
    reviews: 7823,
    platforms: {
      blinkit: { price: 149, mrp: 195, deliveryFee: 0, eta: '8 min', inStock: true, discount: 24 },
      zepto: { price: 139, mrp: 195, deliveryFee: 0, eta: '13 min', inStock: true, discount: 29, coupon: 'DOVE10' },
      instamart: { price: 155, mrp: 195, deliveryFee: 0, eta: '15 min', inStock: true, discount: 21 },
    },
    priceHistory: [
      { date: 'Jan 1', blinkit: 165, zepto: 155, instamart: 169 },
      { date: 'Jan 8', blinkit: 159, zepto: 149, instamart: 165 },
      { date: 'Jan 15', blinkit: 155, zepto: 145, instamart: 159 },
      { date: 'Jan 22', blinkit: 149, zepto: 139, instamart: 155 },
      { date: 'Feb 1', blinkit: 149, zepto: 139, instamart: 155 },
      { date: 'Feb 8', blinkit: 149, zepto: 139, instamart: 155 },
    ],
    tags: ['soap', 'beauty', 'dove'],
  },
  {
    id: '7',
    name: 'Britannia Brown Bread',
    brand: 'Britannia',
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    variant: '400g, Whole Wheat',
    rating: 4.1,
    reviews: 4562,
    platforms: {
      blinkit: { price: 42, mrp: 50, deliveryFee: 0, eta: '9 min', inStock: true, discount: 16 },
      zepto: { price: 45, mrp: 50, deliveryFee: 0, eta: '11 min', inStock: true, discount: 10 },
      instamart: { price: 40, mrp: 50, deliveryFee: 0, eta: '14 min', inStock: true, discount: 20 },
    },
    priceHistory: [
      { date: 'Jan 1', blinkit: 48, zepto: 48, instamart: 46 },
      { date: 'Jan 8', blinkit: 45, zepto: 47, instamart: 43 },
      { date: 'Jan 15', blinkit: 43, zepto: 46, instamart: 41 },
      { date: 'Jan 22', blinkit: 42, zepto: 45, instamart: 40 },
      { date: 'Feb 1', blinkit: 42, zepto: 45, instamart: 40 },
      { date: 'Feb 8', blinkit: 42, zepto: 45, instamart: 40 },
    ],
    tags: ['bread', 'wheat', 'bakery'],
  },
  {
    id: '8',
    name: 'Himalaya Face Wash Neem',
    brand: 'Himalaya',
    category: 'personal-care',
    image: 'https://images.unsplash.com/photo-1761864293818-603c23655cee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    variant: '150ml, Purifying',
    rating: 4.4,
    reviews: 9341,
    platforms: {
      blinkit: { price: 99, mrp: 135, deliveryFee: 0, eta: '10 min', inStock: true, discount: 27 },
      zepto: { price: 105, mrp: 135, deliveryFee: 0, eta: '12 min', inStock: true, discount: 22 },
      instamart: { price: 95, mrp: 135, deliveryFee: 20, eta: '17 min', inStock: false, discount: 30 },
    },
    priceHistory: [
      { date: 'Jan 1', blinkit: 120, zepto: 125, instamart: 115 },
      { date: 'Jan 8', blinkit: 115, zepto: 118, instamart: 108 },
      { date: 'Jan 15', blinkit: 108, zepto: 112, instamart: 100 },
      { date: 'Jan 22', blinkit: 99, zepto: 105, instamart: 95 },
      { date: 'Feb 1', blinkit: 99, zepto: 105, instamart: 95 },
      { date: 'Feb 8', blinkit: 99, zepto: 105, instamart: 95 },
    ],
    tags: ['face-wash', 'neem', 'himalaya'],
  },
];

export const TRENDING_SEARCHES = [
  'Toothbrush', 'Milk', 'Eggs', 'Bread', 'Bananas', 'Chips',
  'Face Wash', 'Shampoo', 'Rice', 'Dal', 'Soap', 'Butter',
];

export const RECENT_SEARCHES = ['Toothbrush', 'Amul Milk', 'Lays Chips'];

export const getCheapestPlatform = (product: Product): { platform: string; price: number } => {
  const prices = [
    { platform: 'blinkit', price: product.platforms.blinkit.inStock ? product.platforms.blinkit.price : Infinity },
    { platform: 'zepto', price: product.platforms.zepto.inStock ? product.platforms.zepto.price : Infinity },
    { platform: 'instamart', price: product.platforms.instamart.inStock ? product.platforms.instamart.price : Infinity },
  ];
  return prices.reduce((min, curr) => curr.price < min.price ? curr : min);
};

export const getMinPrice = (product: Product): number => {
  return Math.min(
    product.platforms.blinkit.inStock ? product.platforms.blinkit.price : Infinity,
    product.platforms.zepto.inStock ? product.platforms.zepto.price : Infinity,
    product.platforms.instamart.inStock ? product.platforms.instamart.price : Infinity,
  );
};

export const getSavings = (product: Product): number => {
  const prices = [
    product.platforms.blinkit.inStock ? product.platforms.blinkit.price : Infinity,
    product.platforms.zepto.inStock ? product.platforms.zepto.price : Infinity,
    product.platforms.instamart.inStock ? product.platforms.instamart.price : Infinity,
  ].filter(p => p !== Infinity);
  if (prices.length < 2) return 0;
  return Math.max(...prices) - Math.min(...prices);
};
