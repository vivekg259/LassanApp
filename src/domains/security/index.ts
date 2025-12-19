import { securityDomainImpl } from './security.domain';

export const securityDomain = {
  updatePassword: securityDomainImpl.updatePassword,
  toggle2FA: securityDomainImpl.toggle2FA,
  toggleBiometric: securityDomainImpl.toggleBiometric,
};
