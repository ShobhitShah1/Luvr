import { useToast } from 'react-native-toast-notifications';

export const useCustomToast = () => {
  const toaster = useToast();

  const showToast = (title: string, message: string, status: string) => {
    toaster.show(message, {
      type: 'custom_toast',
      title,
      status,
    });
  };

  return {
    showToast,
  };
};
