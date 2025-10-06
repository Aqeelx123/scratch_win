export type RewardType = 'better_luck' | 'points_10' | 'points_50' | 'points_100';

export interface Coupon {
  id: string;
  rewardType: RewardType;
  pointsValue: number;
  isRevealed: boolean;
}

export interface GameState {
  currentCoupon: Coupon | null;
  isRevealed: boolean;
  totalPoints: number;
  gamesPlayed: number;
}
