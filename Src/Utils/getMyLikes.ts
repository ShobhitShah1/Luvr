import { onSwipeRight } from '../Redux/Action/actions';
import { store } from '../Redux/Store/store';
import UserService from '../Services/AuthService';
import NetInfo from '@react-native-community/netinfo';

export const getMyLikes = async () => {
  const InInternetConnected = (await NetInfo.fetch()).isConnected;
  if (!InInternetConnected) {
    return;
  }

  try {
    const userDataForApi = { eventName: 'my_likes' };

    const APIResponse = await UserService.UserRegister(userDataForApi);
    if (APIResponse?.code === 200 && APIResponse?.data) {
      const userIds = Array.isArray(APIResponse.data) ? APIResponse.data : [APIResponse.data];
      store.dispatch(onSwipeRight(userIds));
    }
  } catch (error) {}
};
