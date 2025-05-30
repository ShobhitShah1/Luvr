// hooks/useShareProfile.ts
import { Share } from 'react-native';
import { useCustomToast } from '../Utils/toastUtils';
import { useUserData } from '../Contexts/UserDataContext';
import TextString from '../Common/TextString';
import ApiConfig from '../Config/ApiConfig';

interface ShareData {
  id?: string;
  _id?: string;
  full_name?: string;
  about?: string;
}

export const useShareProfile = () => {
  const { showToast } = useCustomToast();
  const { subscription } = useUserData();

  const shareProfile = async (data: ShareData | any) => {
    try {
      if (!subscription.isActive) {
        showToast(TextString.premiumFeatureAccessTitle, TextString.premiumFeatureAccessDescription, 'error');
        return false;
      }

      const id = data?.id || data?._id || data?.params?.props?._id || data?.params?.props?.id;

      if (!id) {
        showToast('Error', 'Unable to share profile', 'error');
        return false;
      }

      const getName = () => data?.full_name || data?.params?.props?.full_name || data?.name || 'this profile';

      const getBio = () =>
        data?.about || data?.params?.props?.about || data?.bio || data?.description || 'Check out this amazing profile';

      const userName = getName();
      const userBio = getBio();
      const truncatedBio = userBio.length > 50 ? `${userBio.substring(0, 50)}...` : userBio;

      const deepLinkUrl = `${ApiConfig.SHARE_BASE}/profile/${id}`;
      const shareMessage = `✨ I found ${userName} on Luvr! ${truncatedBio}\n\n👉 Connect on Luvr: ${deepLinkUrl}\n\n#Luvr #MeetNewPeople`;

      await Share.share({
        message: shareMessage,
        title: `${userName} on Luvr`,
      });

      return true;
    } catch (error: any) {
      showToast('Error', error?.message || 'Failed to share profile', 'error');
      return false;
    }
  };

  return shareProfile;
};
