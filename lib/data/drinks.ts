// lib/data/drinks.ts
export type DrinkColor = 'coral' | 'mint' | 'lav' | 'sun' | 'berry';
export type DrinkTag = 'NEW' | 'POPULAR' | 'SEASON';
export type DrinkCategory = 'milk-tea' | 'fruit' | 'matcha' | 'coffee' | 'seasonal' | 'caf-free';

export interface Drink {
  id: string;
  name: string;
  base: string;
  price: number;
  color: DrinkColor;
  tag?: DrinkTag;
  category: DrinkCategory;
  description: string;
}

export const DRINKS: Drink[] = [
  { id: 'taro-cloud',       name: 'Taro Cloud',         base: 'oolong · oat',           price: 6.75, color: 'lav',   tag: 'POPULAR', category: 'milk-tea',  description: 'Steamed taro, oat milk, salt cream foam' },
  { id: 'strawberry-matcha',name: 'Strawberry Matcha',  base: 'ceremonial · whole',     price: 7.25, color: 'berry', tag: 'NEW',     category: 'matcha',    description: 'Ceremonial matcha, whole milk, fresh strawberry' },
  { id: 'okinawa-brown',    name: 'Okinawa Brown Sugar', base: 'black · whole',          price: 6.75, color: 'sun',                   category: 'milk-tea',  description: 'Black tea, molasses, whole milk, brown sugar pearls' },
  { id: 'peach-oolong',     name: 'Peach Oolong Fizz',  base: 'oolong · sparkling',     price: 6.25, color: 'coral',                  category: 'fruit',     description: 'Oolong, sparkling water, fresh peach' },
  { id: 'coconut-coldbrew', name: 'Coconut Cold Brew',  base: 'espresso · coconut',     price: 6.50, color: 'mint',                   category: 'coffee',    description: 'Cold brew espresso, coconut milk, toasted coconut' },
  { id: 'mango-pomelo',     name: 'Mango Pomelo',       base: 'fresh mango · jasmine',  price: 6.75, color: 'sun',   tag: 'SEASON',  category: 'seasonal',  description: 'Fresh mango, pomelo, jasmine tea, sago pearls' },
  { id: 'hojicha-latte',    name: 'Hojicha Latte',      base: 'roasted · oat',          price: 6.50, color: 'coral',                  category: 'matcha',    description: 'Roasted green tea, oat milk, nutty and low-caf' },
  { id: 'lychee-jasmine',   name: 'Lychee Jasmine',     base: 'lychee · jasmine',       price: 6.25, color: 'lav',                    category: 'fruit',     description: 'Lychee syrup, jasmine tea, crystal boba' },
  { id: 'wintermelon',      name: 'Wintermelon Cream',  base: 'wintermelon · jasmine',  price: 6.25, color: 'mint',                   category: 'caf-free',  description: 'Wintermelon syrup, jasmine tea, cream top' },
  { id: 'classic-milk-tea', name: 'Classic Milk Tea',   base: 'oolong · whole',         price: 6.50, color: 'sun',                    category: 'milk-tea',  description: 'Honey-glazed oolong, whole milk, tapioca pearls' },
  { id: 'cucumber-mint',    name: 'Cucumber Mint Splash',base: 'jasmine · aloe',        price: 6.50, color: 'mint',                   category: 'caf-free',  description: 'Jasmine tea, aloe pearls, fresh cucumber and mint' },
  { id: 'passionfruit-oolong',name: 'Passionfruit Oolong',base: 'oolong · passionfruit',price: 6.75, color: 'coral', tag: 'NEW',     category: 'fruit',     description: 'Oolong tea, fresh passionfruit, popping boba' },
];

export const FEATURED_DRINK = DRINKS.find(d => d.id === 'mango-pomelo')!;

export const CATEGORIES: { id: DrinkCategory | 'all'; label: string }[] = [
  { id: 'all',       label: 'All' },
  { id: 'milk-tea',  label: 'Milk Tea' },
  { id: 'fruit',     label: 'Fruit' },
  { id: 'matcha',    label: 'Matcha' },
  { id: 'coffee',    label: 'Coffee + Boba' },
  { id: 'seasonal',  label: 'Seasonal ✦' },
  { id: 'caf-free',  label: 'Caffeine Free' },
];

export const TOPPINGS = [
  { id: 'pearls',    name: 'Tapioca Pearls', desc: 'classic chew' },
  { id: 'grass',     name: 'Grass Jelly',    desc: 'cooling, herbal' },
  { id: 'aloe',      name: 'Aloe',           desc: 'crisp, hydrating' },
  { id: 'popping',   name: 'Popping Mango',  desc: 'bursts fresh juice' },
  { id: 'lychee-j',  name: 'Lychee Jelly',   desc: 'floral, light' },
  { id: 'redbean',   name: 'Red Bean',        desc: 'sweet, soft' },
  { id: 'pudding',   name: 'Pudding',         desc: 'silky custard' },
  { id: 'aiyu',      name: 'Aiyu Jelly',      desc: 'lemon-citrus' },
  { id: 'cream',     name: 'Salt Cream',      desc: 'savory top foam' },
];

export const BASES = ['Oat Milk', 'Whole Milk', 'Coconut Milk', 'Almond Milk', 'No Milk'];
export const ICE_LEVELS = ['No Ice', 'Light Ice', 'Regular Ice', 'Extra Ice'];
export const SIZES = [
  { label: 'S · 12oz', delta: 0 },
  { label: 'M · 16oz', delta: 0.50 },
  { label: 'L · 24oz', delta: 1.00 },
];
export const STORES = ['Mission Street', 'Hayes Valley', 'Inner Sunset'];
