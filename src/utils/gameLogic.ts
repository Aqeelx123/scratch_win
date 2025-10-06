import { Coupon, RewardType } from '../types';

const REWARD_TYPES: RewardType[] = ['better_luck', 'points_10', 'points_50', 'points_100'];

const REWARD_WEIGHTS = {
  better_luck: 50,
  points_10: 30,
  points_50: 15,
  points_100: 5,
};

function getRandomRewardType(): RewardType {
  const totalWeight = Object.values(REWARD_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (const [rewardType, weight] of Object.entries(REWARD_WEIGHTS)) {
    random -= weight;
    if (random <= 0) {
      return rewardType as RewardType;
    }
  }

  return 'better_luck';
}

export function generateCoupon(): Coupon {
  const rewardType = getRandomRewardType();

  return {
    id: `coupon-${Date.now()}`,
    rewardType,
    pointsValue: getPointsValue(rewardType),
    isRevealed: false,
  };
}

function getPointsValue(rewardType: RewardType): number {
  switch (rewardType) {
    case 'points_10':
      return 10;
    case 'points_50':
      return 50;
    case 'points_100':
      return 100;
    default:
      return 0;
  }
}
