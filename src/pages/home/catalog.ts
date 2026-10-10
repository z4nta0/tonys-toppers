export type ProductType =
  | 'pen-topper'
  | 'wine-stopper'
  | 'keychain'
  | 'dog-necklace'
  | 'car-freshie'
  | 'name-badge-reel'
  | 'phone-grip'
  | 'straw-charm';

export interface Product {
  id: string;
  img: string;
  name: string;
  type: ProductType;
  typeLabel: string;
}

export const CATEGORIES: { value: ProductType; label: string; short: string }[] = [
  { value: 'pen-topper', label: 'Pen Toppers', short: 'Pen' },
  { value: 'wine-stopper', label: 'Wine Stoppers', short: 'Wine' },
  { value: 'keychain', label: 'Keychains', short: 'Keychain' },
  { value: 'dog-necklace', label: 'Dog Necklaces', short: 'Dog' },
  { value: 'car-freshie', label: 'Car Freshies', short: 'Freshie' },
  { value: 'name-badge-reel', label: 'Name Badge Reels', short: 'Badge' },
  { value: 'phone-grip', label: 'Phone Grips', short: 'Phone' },
  { value: 'straw-charm', label: 'Straw Charms', short: 'Straw' },
];

const NAMES: Record<ProductType, string[]> = {
  'pen-topper': ['pen-topper-1', 'pen-topper-2', 'pen-topper-3', 'pen-topper-4', 'pen-topper-5', 'pen-topper-6', 'pen-topper-7', 'pen-topper-8', 'pen-topper-9', 'pen-topper-10', 'pen-topper-11', 'pen-topper-12', 'pen-topper-13', 'pen-topper-14', 'pen-topper-15', 'pen-topper-16', 'pen-topper-17', 'pen-topper-18', 'pen-topper-19',],
  'wine-stopper': ['wine-stopper-1', 'wine-stopper-2', 'wine-stopper-3', 'wine-stopper-4', 'wine-stopper-5', 'wine-stopper-6', 'wine-stopper-7', 'wine-stopper-8'],
  'keychain': ['keychain-1',],
  'dog-necklace': ['dog-necklace-1', 'dog-necklace-2', 'dog-necklace-3', 'dog-necklace-4', 'dog-necklace-5', 'dog-necklace-6', 'dog-necklace-7', 'dog-necklace-8', 'dog-necklace-9', 'dog-necklace-10', 'dog-necklace-11', 'dog-necklace-12', 'dog-necklace-13', 'dog-necklace-14', 'dog-necklace-15', 'dog-necklace-16', 'dog-necklace-17', 'dog-necklace-18', 'dog-necklace-19', 'dog-necklace-20',],
  'car-freshie': ['car-freshie-1', 'car-freshie-2', 'car-freshie-3', 'car-freshie-4', 'car-freshie-5',],
  'name-badge-reel': ['name-badge-reel-1',],
  'phone-grip': ['phone-grip-1', 'phone-grip-2', 'phone-grip-3', 'phone-grip-4', 'phone-grip-5', 'phone-grip-6', 'phone-grip-7', 'phone-grip-8', 'phone-grip-9',],
  'straw-charm': ['straw-charm-1',],
};

//const pad = (n: number) => String(n).padStart(2, '0');

// Generated SVGs run product-01 through product-28, in the same order as CATEGORIES,
// 4 per category. Build the typed product list from that.
export const PRODUCTS: Product[] = CATEGORIES.flatMap((cat, catIdx) => {
  const labelMap: Record<ProductType, string> = {
    'pen-topper': 'Pen Topper',
    'wine-stopper': 'Wine Stopper',
    'keychain': 'Keychain',
    'dog-necklace': 'Dog Necklace',
    'car-freshie': 'Car Freshie',
    'name-badge-reel': 'Name Badge Reel',
    'phone-grip': 'Phone Grip',
    'straw-charm': 'Straw Charm',
  };
  return NAMES[cat.value].map((name, i) => {
    const id = `${catIdx} + ${i}`;
    return {
      id: id,
      img: `images/${cat.value}/${name}.jpg`,
      name: `${labelMap[cat.value]} ${i + 1}`,
      type: cat.value,
      typeLabel: labelMap[cat.value],
    };
  });
});
