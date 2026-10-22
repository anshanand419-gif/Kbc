export type Category = 'Anime' | 'Marvel' | 'Free Fire' | 'Minecraft';

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Extreme';

export interface Question {
  id: number;
  category: Category;
  difficulty: Difficulty;
  prize_money: string;
  question: string;
  options: [string, string, string, string];
  answer: number; // 0, 1, 2, or 3
  explanation: string;
}

export interface PrizeTier {
  level: number;
  prize: string;
  amount: number;
  difficulty: Difficulty;
  isSafePoint?: boolean;
}

export const KBC_PRIZE_TIERS: PrizeTier[] = [
  { level: 1, prize: '₹1,000', amount: 1000, difficulty: 'Easy' },
  { level: 2, prize: '₹2,000', amount: 2000, difficulty: 'Easy' },
  { level: 3, prize: '₹3,000', amount: 3000, difficulty: 'Easy' },
  { level: 4, prize: '₹5,000', amount: 5000, difficulty: 'Easy' },
  { level: 5, prize: '₹10,000', amount: 10000, difficulty: 'Easy', isSafePoint: true },
  { level: 6, prize: '₹20,000', amount: 20000, difficulty: 'Medium' },
  { level: 7, prize: '₹40,000', amount: 40000, difficulty: 'Medium' },
  { level: 8, prize: '₹80,000', amount: 80000, difficulty: 'Medium' },
  { level: 9, prize: '₹1,60,000', amount: 160000, difficulty: 'Medium' },
  { level: 10, prize: '₹3,20,000', amount: 320000, difficulty: 'Medium', isSafePoint: true },
  { level: 11, prize: '₹6,40,000', amount: 640000, difficulty: 'Hard' },
  { level: 12, prize: '₹12,50,000', amount: 1250000, difficulty: 'Hard' },
  { level: 13, prize: '₹25,00,000', amount: 2500000, difficulty: 'Hard' },
  { level: 14, prize: '₹50,00,000', amount: 5000000, difficulty: 'Hard' },
  { level: 15, prize: '₹1,00,00,000', amount: 10000000, difficulty: 'Hard' },
  { level: 16, prize: '₹7,00,00,000', amount: 70000000, difficulty: 'Extreme', isSafePoint: true },
];

export interface LifelineState {
  fiftyFifty: boolean;
  audiencePoll: boolean;
  phoneAFriend: boolean;
  flipQuestion: boolean;
  expertHint: boolean;
}
