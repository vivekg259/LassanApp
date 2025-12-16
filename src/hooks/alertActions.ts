type SetState<T> = (value: T | ((prev: T) => T)) => void;

export type CustomAlertState = {
  visible: boolean;
  title: string;
  message: string;
  type: 'info' | 'confirm';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export function showInfoAlertAction(params: {
  setCustomAlert: SetState<CustomAlertState>;
  title: string;
  message: string;
}): void {
  const { setCustomAlert, title, message } = params;
  setCustomAlert({ visible: true, title, message, type: 'info' });
}

export function showConfirmAlertAction(params: {
  setCustomAlert: SetState<CustomAlertState>;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}): void {
  const { setCustomAlert, title, message, onConfirm, confirmText = 'Yes', cancelText = 'No' } = params;
  setCustomAlert({
    visible: true,
    title,
    message,
    type: 'confirm',
    onConfirm,
    confirmText,
    cancelText,
  });
}

export function closeAlertAction(params: { setCustomAlert: SetState<CustomAlertState> }): void {
  const { setCustomAlert } = params;
  setCustomAlert((prev) => ({ ...prev, visible: false }));
}
