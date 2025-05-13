// src/types/gym.ts
export interface Plan {
  id: string;
  name: string;
  title: string;
  price: number;
  duration: string;
  initiationFee: number;
  features: string[];
  description: string;
}
