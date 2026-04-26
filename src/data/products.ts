export type ProductType =
  | 'pen-topper'
  | 'pencil-topper'
  | 'wine-stopper'
  | 'keychain'
  | 'straw-charm'
  | 'dog-necklace'
  | 'car-freshie';

export interface Product {
  id: number;
  img: string;
  name: string;
  type: ProductType;
  typeLabel: string;
}

export const CATEGORIES: { value: ProductType; label: string; short: string }[] = [
  { value: 'pen-topper', label: 'Pen Toppers', short: 'Pen' },
  { value: 'pencil-topper', label: 'Pencil Toppers', short: 'Pencil' },
  { value: 'wine-stopper', label: 'Wine Stoppers', short: 'Wine' },
  { value: 'keychain', label: 'Keychains', short: 'Keychain' },
  { value: 'straw-charm', label: 'Straw Charms', short: 'Straw' },
  { value: 'dog-necklace', label: 'Dog Necklaces', short: 'Dog' },
  { value: 'car-freshie', label: 'Car Freshies', short: 'Freshie' },
];

const NAMES: Record<ProductType, string[]> = {
  'pen-topper': ['Sapphire Sun', 'Crimson Gold', 'Emerald Mist', 'Lavender Dream'],
  'pencil-topper': ['Honey Star', 'Bubblegum', 'Sea Glass', 'Twilight'],
  'wine-stopper': ['Star Bright', 'Heart of Gold', 'Hex Charm', 'Rose Petal'],
  keychain: ['Lucky Charm', 'Pocket Sunshine', 'Berry Bunch', 'Indigo Sky'],
  'straw-charm': ['Sip Happy', 'Citrus Twist', 'Ocean Breeze', 'Wildflower'],
  'dog-necklace': ['Best Buddy', 'Pup Royale', 'Bandana Blue', 'Daisy Days'],
  'car-freshie': ['Open Road', 'Sweet Drive', 'Sunshine Cruiser', 'Heartbeat'],
};

const pad = (n: number) => String(n).padStart(2, '0');

// Generated SVGs run product-01 through product-28, in the same order as CATEGORIES,
// 4 per category. Build the typed product list from that.
export const PRODUCTS: Product[] = CATEGORIES.flatMap((cat, catIdx) => {
  const labelMap: Record<ProductType, string> = {
    'pen-topper': 'Pen Topper',
    'pencil-topper': 'Pencil Topper',
    'wine-stopper': 'Wine Stopper',
    keychain: 'Keychain',
    'straw-charm': 'Straw Charm',
    'dog-necklace': 'Dog Necklace',
    'car-freshie': 'Car Freshie',
  };
  return NAMES[cat.value].map((name, i) => {
    const id = catIdx * 4 + i + 1;
    return {
      id,
      img: `/images/product-${pad(id)}.svg`,
      name,
      type: cat.value,
      typeLabel: labelMap[cat.value],
    };
  });
});
