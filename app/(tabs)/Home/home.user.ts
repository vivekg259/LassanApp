type Translate = (
  key:
    | 'menu_personal_info'
    | 'menu_security'
    | 'menu_wallet'
    | 'menu_language'
    | 'menu_help'
    | 'feature_phase_3'
    | 'feature_next_update'
) => string;

type ShowInfoAlert = (title: string, message: string) => void;

type ShowConfirmAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
  confirmText: string,
  cancelText: string
) => void;

export function confirmLogout(params: { showConfirmAlert: ShowConfirmAlert }): void {
  const { showConfirmAlert } = params;
  showConfirmAlert('Log Out', 'Are you sure you want to log out?', () => console.log('User logged out'), 'Log Out', 'Cancel');
}

export function handleMenuPressAction(params: {
  item: string;
  t: Translate;
  push: (path: string) => void;
  setShowLanguageModal: (value: boolean) => void;
  showInfoAlert: ShowInfoAlert;
}): void {
  const { item, t, push, setShowLanguageModal, showInfoAlert } = params;

  if (item === 'Personal Information' || item === t('menu_personal_info')) {
    push('/personal-info');
    return;
  }
  if (item === 'Security & Privacy' || item === t('menu_security')) {
    push('/security-privacy');
    return;
  }
  if (item === 'Wallet Settings' || item === t('menu_wallet')) {
    showInfoAlert(item, t('feature_phase_3'));
    return;
  }
  if (item === 'Language' || item === t('menu_language')) {
    setShowLanguageModal(true);
    return;
  }
  if (item === 'Help & Support' || item === t('menu_help')) {
    push('/help-support');
    return;
  }

  showInfoAlert(item, t('feature_next_update'));
}
