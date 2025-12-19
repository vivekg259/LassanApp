import { miningDomainImpl } from './mining.domain';

export const miningDomain = {
  start: miningDomainImpl.start,
  stop: miningDomainImpl.stop,
  claimTick: miningDomainImpl.claimTick,
  getState: miningDomainImpl.getState,
};
