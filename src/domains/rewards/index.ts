import { rewardsDomainImpl } from './rewards.domain';

export const rewardsDomain = {
  claimDaily: rewardsDomainImpl.claimDaily,
  grantReward: rewardsDomainImpl.grantReward,
  getState: rewardsDomainImpl.getState,
};
