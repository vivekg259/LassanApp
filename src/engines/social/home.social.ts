import { Linking } from 'react-native';

type SetState<T> = (value: T | ((prev: T) => T)) => void;

type ShowInfoAlert = (title: string, message: string) => void;

export type SocialTaskStatus = 'pending' | 'verifying' | 'completed';

export function handleSocialTaskAction<TTask extends { id: string; status: SocialTaskStatus | string }>(params: {
  id: string;
  reward: number;
  url: string;
  status: SocialTaskStatus | string;
  setSocialTasks: SetState<TTask[]>;
  setBalance: SetState<number>;
  showInfoAlert: ShowInfoAlert;
}): Promise<void> {
  const { id, reward, url, status, setSocialTasks, setBalance, showInfoAlert } = params;

  if (status === 'pending') {
    return (async () => {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
          setSocialTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, status: 'verifying' } : task))
          );
        } else {
          showInfoAlert('Error', 'Cannot open this link.');
        }
      } catch {
        showInfoAlert('Error', 'An error occurred.');
      }
    })();
  }

  if (status === 'verifying') {
    setSocialTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status: 'completed' } : task)));
    setBalance((prev) => prev + reward);
    showInfoAlert('Reward Claimed', `You received +${reward} LSN!`);
  }

  return Promise.resolve();
}
