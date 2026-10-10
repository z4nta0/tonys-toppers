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
  alt: string; // What: Alt. Why: A screen reader announces each photo by its text alternative. How: A booth shot carries a description of the table, and every other photo its card's name until the content pass describes them.
  booth: boolean; // What: Booth. Why: A craft fair booth shot shows a whole table, so it belongs in the gallery and under the filters it's tagged with, not in the All list. How: This is true for a booth shot and false for a piece or set.
  id: string;
  img: string;
  name: string;
  types: ProductType[]; // What: Types. Why: One photo can show more than one kind of piece. How: This lists every category the photo is tagged with, the first one setting its card's look.
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
  'pen-topper': ['pen-topper-1', 'pen-topper-2', 'pen-topper-3', 'pen-topper-4', 'pen-topper-5', 'pen-topper-6', 'pen-topper-7', 'pen-topper-8', 'pen-topper-9', 'pen-topper-10', 'pen-topper-11',],
  'wine-stopper': ['wine-stopper-1',],
  'keychain': ['keychain-1',],
  'dog-necklace': ['dog-necklace-1', 'dog-necklace-2', 'dog-necklace-3', 'dog-necklace-4', 'dog-necklace-5', 'dog-necklace-6', 'dog-necklace-7', 'dog-necklace-8', 'dog-necklace-9', 'dog-necklace-10', 'dog-necklace-11', 'dog-necklace-12', 'dog-necklace-13', 'dog-necklace-14', 'dog-necklace-15', 'dog-necklace-16', 'dog-necklace-17', 'dog-necklace-18', 'dog-necklace-19',],
  'car-freshie': ['car-freshie-1', 'car-freshie-2', 'car-freshie-3', 'car-freshie-4', 'car-freshie-5',],
  'name-badge-reel': ['name-badge-reel-1',],
  'phone-grip': ['phone-grip-1', 'phone-grip-2', 'phone-grip-3', 'phone-grip-4', 'phone-grip-5', 'phone-grip-6', 'phone-grip-7', 'phone-grip-8', 'phone-grip-9',],
  'straw-charm': [],
};



const LABELS: Record<ProductType, string> = {
  'pen-topper': 'Pen Topper',
  'wine-stopper': 'Wine Stopper',
  'keychain': 'Keychain',
  'dog-necklace': 'Dog Necklace',
  'car-freshie': 'Car Freshie',
  'name-badge-reel': 'Name Badge Reel',
  'phone-grip': 'Phone Grip',
  'straw-charm': 'Straw Charm',
};



const SETS: { file: string; types: ProductType[] }[] = [ // What: Sets. Why: A few photos show pen toppers and wine stoppers displayed together, so each is one card under both filters rather than a copy under each. How: Each row names the photo and the categories it shows.
  { file: 'pen-wine-set-1', types: ['pen-topper', 'wine-stopper'] },
  { file: 'pen-wine-set-2', types: ['pen-topper', 'wine-stopper'] },
  { file: 'pen-wine-set-3', types: ['pen-topper', 'wine-stopper'] },
];



const BOOTH: { alt: string; file: string; types: ProductType[] }[] = [ // What: Booth. Why: The craft fair booth shots show Tony's whole table, so they live in the gallery and under the filters of the pieces they show, which keeps Straw Charms from being empty. How: Each row names the photo and the categories it shows.
  { alt: "Tony's pen toppers lined up in clear stands on a wooden shelf by a shop window, with beaded wine stoppers and bagged keychains on the shelf below and a framed card about Tony", file: 'booth-1', types: ['pen-topper', 'wine-stopper'] },
  { alt: 'A craft fair table crowded with clear cups of pen toppers and wine stoppers, beaded dog necklaces on a stand, keychains hanging from a rack, and a framed cartoon of Tony', file: 'booth-2', types: ['pen-topper', 'wine-stopper', 'dog-necklace'] },
  { alt: "Beaded charms and keychains hanging from a rack beside bagged pens in glass vases, with a framed cartoon of Tony in a Tony's Toppers shirt and a cup of pen toppers in front", file: 'booth-3', types: ['pen-topper', 'straw-charm'] },
  { alt: 'Tony seated behind his table at an outdoor craft fair, its black cloth covered with rows of pen toppers, wine stoppers, and beaded badge reels', file: 'booth-4', types: ['pen-topper', 'wine-stopper'] },
];



const PRO_URL_OBJ = import.meta.glob< string >( '../../assets/products/*.jpg', { eager : true, import : 'default' } ); // What: Product URL Object. Why: The product photos live in src/assets/products, where Vite fingerprints each one and fails the build when a listed photo is missing from its import. How: This imports every photo in the folder at build time and maps each one's source path to its built URL.



const urlFor = (file: string) => PRO_URL_OBJ[ `../../assets/products/${ file }.jpg` ]; // What: URL For. Why: Every card looks its photo up the same way. How: This returns the photo's built URL by its file name.



// Every individual piece in category order, with the pen and wine stopper sets
// right after the wine stoppers, then the booth shots, which only the filters
// and the gallery show.
export const PRODUCTS: Product[] = [
  ...CATEGORIES.flatMap((cat) => [
    ...NAMES[cat.value].map((file, i) => ({
      alt: `${LABELS[cat.value]} ${i + 1}`,
      booth: false,
      id: file,
      img: urlFor(file),
      name: `${LABELS[cat.value]} ${i + 1}`,
      types: [cat.value],
      typeLabel: LABELS[cat.value],
    })),
    ...(cat.value === 'wine-stopper'
      ? SETS.map((set, i) => ({
          alt: `Pen Topper & Wine Stopper Set ${i + 1}`,
          booth: false,
          id: set.file,
          img: urlFor(set.file),
          name: `Pen Topper & Wine Stopper Set ${i + 1}`,
          types: set.types,
          typeLabel: 'Pen Topper & Wine Stopper',
        }))
      : []),
  ]),
  ...BOOTH.map((shot, i) => ({
    alt: shot.alt,
    booth: true,
    id: shot.file,
    img: urlFor(shot.file),
    name: `Craft Fair Table ${i + 1}`,
    types: shot.types,
    typeLabel: 'Craft Fair Table',
  })),
];
