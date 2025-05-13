export interface MerchItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  isNew?: boolean;
}

export const MERCH_ITEMS: MerchItem[] = [
  {
    id: "premium-hoodie",
    name: "Premium Training Hoodie",
    description:
      "Comfortable, moisture-wicking hoodie perfect for workouts and casual wear",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80",
    rating: 4.9,
    isNew: true,
  },
  {
    id: "performance-bottle",
    name: "Performance Water Bottle",
    description:
      "Double-walled insulated bottle keeps your drinks at the perfect temperature",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80",
    rating: 4.8,
  },
  {
    id: "workout-towel",
    name: "Microfiber Gym Towel",
    description:
      "Quick-drying, antibacterial towel essential for every workout",
    price: 19.99,
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80",
    rating: 4.7,
  },
  {
    id: "compression-shorts",
    name: "Performance Shorts",
    description: "Breathable compression shorts with phone pocket",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80",
    rating: 4.9,
    isNew: true,
  },
  {
    id: "gym-bag",
    name: "Premium Gym Bag",
    description: "Spacious, water-resistant bag with dedicated compartments",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80",
    rating: 4.8,
  },
  {
    id: "resistance-bands",
    name: "Resistance Band Set",
    description: "Complete set of premium resistance bands with carrying case",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&q=80",
    rating: 4.9,
  },
];
