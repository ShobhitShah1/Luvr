import { useToast } from 'react-native-toast-notifications';

const Toast = (title: string, message: string, status: string) => {
  const toast = useToast();

  toast.show(title, {
    type: 'custom_toast',
    title: message,
    status: status,
  });
};

export default Toast;
