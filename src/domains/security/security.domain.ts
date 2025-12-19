export const securityDomainImpl = {
  updatePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    showInfoAlert: (title: string, message: string, onConfirm?: () => void) => void;
    setCurrentPassword: (value: string) => void;
    setNewPassword: (value: string) => void;
    setConfirmPassword: (value: string) => void;
  }) {
    const { currentPassword, newPassword, confirmPassword, showInfoAlert, setCurrentPassword, setNewPassword, setConfirmPassword } = data;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showInfoAlert('Error', 'Please fill in all password fields.');
        return;
    }
    if (newPassword !== confirmPassword) {
        showInfoAlert('Error', 'New passwords do not match.');
        return;
    }
    
    // Password Validation Logic
    // Length: 8-14 chars
    if (newPassword.length < 8 || newPassword.length > 14) {
        showInfoAlert('Invalid Password', 'Password must be between 8 and 14 characters long.');
        return;
    }

    // One lowercase letter
    if (!/[a-z]/.test(newPassword)) {
        showInfoAlert('Invalid Password', 'Password must contain at least one lowercase letter.');
        return;
    }

    // One uppercase letter
    if (!/[A-Z]/.test(newPassword)) {
        showInfoAlert('Invalid Password', 'Password must contain at least one uppercase letter.');
        return;
    }

    // One number
    if (!/[0-9]/.test(newPassword)) {
        showInfoAlert('Invalid Password', 'Password must contain at least one number.');
        return;
    }

    // One special character (only !,@,#,$,*)
    if (!/[!@#$*]/.test(newPassword)) {
        showInfoAlert('Invalid Password', 'Password must contain at least one special character (!, @, #, $, *).');
        return;
    }

    // Check for forbidden characters (anything that is NOT alphanumeric OR allowed special chars)
    if (/[^a-zA-Z0-9!@#$*]/.test(newPassword)) {
        showInfoAlert('Invalid Password', 'Password contains invalid characters. Only letters, numbers, and !, @, #, $, * are allowed.');
        return;
    }
    
    // Simulate API call
    showInfoAlert('Success', 'Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  },

  toggle2FA(data: {
    value: boolean;
    setIs2FAEnabled: (value: boolean) => void;
    showConfirmAlert: (title: string, message: string, onConfirm: () => void, confirmText?: string, cancelText?: string) => void;
  }) {
    const { value, setIs2FAEnabled, showConfirmAlert } = data;

    if (value) {
        showConfirmAlert(
            "Enable 2FA",
            "We will send a verification code to your registered email/phone to enable Two-Factor Authentication.",
            () => {
                // Simulate sending code
                // We need to close the current alert first, then show the next one.
                // Since closeAlert is async in terms of React state, we might need a small timeout or just set the new state directly.
                // However, setting state directly overwrites the previous one, which is fine.
                setTimeout(() => {
                    showConfirmAlert("Code Sent", "Please enter the code sent to your device (Simulated).", () => {
                        setIs2FAEnabled(true);
                    }, "Verify", "Cancel");
                }, 300);
            },
            "Send Code",
            "Cancel"
        );
    } else {
        showConfirmAlert(
            "Disable 2FA",
            "Are you sure you want to disable Two-Factor Authentication? Your account will be less secure.",
            () => setIs2FAEnabled(false),
            "Disable",
            "Cancel"
        );
    }
  },

  toggleBiometric(data: {
    value: boolean;
    setIsBiometricEnabled: (value: boolean) => void;
    showConfirmAlert: (title: string, message: string, onConfirm: () => void, confirmText?: string, cancelText?: string) => void;
    showInfoAlert: (title: string, message: string, onConfirm?: () => void) => void;
  }) {
    const { value, setIsBiometricEnabled, showConfirmAlert, showInfoAlert } = data;

    if (value) {
        // Simulate biometric prompt
        showConfirmAlert("Biometric Setup", "Please authenticate to enable biometric login.", () => {
            // Simulate success
            setIsBiometricEnabled(true);
            setTimeout(() => {
                showInfoAlert("Success", "Biometric login enabled.");
            }, 300);
        }, "Authenticate", "Cancel");
    } else {
        setIsBiometricEnabled(false);
    }
  },
};
