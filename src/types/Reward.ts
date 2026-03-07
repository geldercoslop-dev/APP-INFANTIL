export interface Reward {
  id: string;
  title: string;
  description: string;
  cost?: number; // coins cost
  streakRequirement?: number; // streak days required
  isSuperPrize: boolean;
  redeemed: boolean;
  redeemedDate?: string;
}
