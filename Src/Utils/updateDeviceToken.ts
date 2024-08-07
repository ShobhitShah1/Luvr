import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';
import UserService from '../Services/AuthService';

export const updateDeviceToken = async () => {
  const InInternetConnected = (await NetInfo.fetch()).isConnected;

  if (!InInternetConnected) {
    return;
  }
  const Token = await messaging().getToken();

  if (Token) {
    const userDataForApi = {
      eventName: 'update_notification_token',
      notification_token: Token,
    };

    await UserService.UserRegister(userDataForApi);
  }
};
