import { userDomainImpl } from './user.domain';

export const userDomain = {
  getProfile: userDomainImpl.getProfile,
  updateProfile: userDomainImpl.updateProfile,
  deleteAccount: userDomainImpl.deleteAccount,
};
