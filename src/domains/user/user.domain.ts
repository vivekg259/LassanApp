// Mock existing usernames for validation
const EXISTING_USERNAMES = ['admin', 'lassan', 'vivek', 'testuser'];

export const userDomainImpl = {
  getProfile() {
    // Mock profile data
    return {
      name: 'Vivek Gupta',
      username: '',
      email: 'vivek.gupta@example.com',
      phone: '+91 98765 43210',
      address: 'Mumbai, India',
    };
  },

  updateProfile(data: {
    name: string;
    username: string;
    referrerCode: string;
    nameChangeCount: number;
    isReferrerLocked: boolean;
    showInfoAlert: (title: string, message: string, onConfirm?: () => void) => void;
    setNameChangeCount: (value: number | ((prev: number) => number)) => void;
    setIsReferrerLocked: (value: boolean) => void;
    router: { back: () => void };
  }) {
    const { name, username, referrerCode, nameChangeCount, isReferrerLocked, showInfoAlert, setNameChangeCount, setIsReferrerLocked, router } = data;

    // Validate Username
    if (username.trim().length > 0) {
        const cleanUsername = username.trim();
        const isAlphanumeric = /^[a-zA-Z0-9]+$/.test(cleanUsername);
        
        if (!isAlphanumeric) {
            showInfoAlert('Invalid Username', 'Username must contain only alphanumeric characters.');
            return;
        }

        if (EXISTING_USERNAMES.includes(cleanUsername.toLowerCase())) {
            showInfoAlert('Username Taken', 'This username is already taken. Please choose a unique one.');
            return;
        }
    }

    // Handle Name Change Limit
    if (name !== 'Vivek Gupta') { // Assuming 'Vivek Gupta' was the initial name
        if (nameChangeCount >= 2) {
            showInfoAlert('Limit Reached', 'You have reached the maximum limit of 2 name changes.');
            return;
        }
        setNameChangeCount(prev => prev + 1);
    }

    // Handle Referral Code
    if (referrerCode.trim().length > 0 && !isReferrerLocked) {
        // Simulate referral validation
        setIsReferrerLocked(true);
        showInfoAlert('Referral Success', 'Referral code applied! Your base mining rate has increased by 10%.');
    }

    // In a real app, this would make an API call
    showInfoAlert('Success', 'Profile updated successfully!', () => {
        router.back();
    });
  },

  deleteAccount(router: any, Alert: any) {
    Alert.alert(
        'Final Confirmation',
        'This is your last chance. Are you absolutely sure?',
        [
            { text: 'Cancel', style: 'cancel' },
            { 
                text: 'Yes, Delete Everything', 
                style: 'destructive',
                onPress: () => {
                    // Simulate deletion
                    Alert.alert('Account Deleted', 'We are sad to see you go. Your account has been deleted.');
                    router.replace('/'); // Navigate to login/home
                }
            }
        ]
    );
  },
};
