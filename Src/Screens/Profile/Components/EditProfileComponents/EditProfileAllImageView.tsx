/* eslint-disable @typescript-eslint/no-shadow */
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import React, { FC, memo, useCallback, useState } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import ApiConfig from '../../../../Config/ApiConfig';
import { addUrlToItem, sortByUrl } from '../../../../Utils/ImagePickerUtils';
import { useCustomToast } from '../../../../Utils/toastUtils';
import EditProfileRenderImageBox from './EditProfileRenderImageBox';

interface EditProfileAllImageViewProps {
  item: {
    name: string;
    type: string;
    key: string;
    url: string;
  };
  setUserPicks: any;
  UserPicks: {
    name: string;
    type: string;
    key: string;
    url: string;
  }[];
  OnToggleModal: () => void;
  isLoading: boolean;
  onRefetchData: () => Promise<void>;
}

const uploadImageToServer = async (imageData: any, token: string, onRefetchData: () => Promise<void>) => {
  try {
    const formData = new FormData();
    formData.append('eventName', 'update_profile');
    formData.append('file_to', 'profile_images');
    formData.append('file', {
      uri: Platform.OS === 'android' ? imageData.uri : imageData.uri.replace('file://', ''),
      type: imageData.type,
      name: imageData.fileName || 'image.jpg',
    });

    const response = await axios.post(ApiConfig.IMAGE_UPLOAD_BASE_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        app_secret: '_d_a_t_i_n_g_',
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      onRefetchData();
    } else {
      return { success: false, error: response.data?.message || 'Failed to upload image' };
    }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to upload image' };
  }
};

const EditProfileAllImageView: FC<EditProfileAllImageViewProps> = ({
  item,
  setUserPicks,
  UserPicks,
  OnToggleModal,
  isLoading,
  onRefetchData,
}) => {
  const [localLoading, setLocalLoading] = useState(false);
  const userData = useSelector((state: any) => state?.user);
  const { showToast } = useCustomToast();

  const handleOnImagePress = useCallback(
    (item: { key: string; url: string }) => {
      if (item?.url?.length === 0) {
        OnToggleModal();
      }
    },
    [OnToggleModal]
  );

  const handleImageChange = useCallback(
    async (key: string) => {
      try {
        const isInternetConnected = (await NetInfo.fetch()).isConnected;
        if (!isInternetConnected) {
          showToast('Error', 'Please check your internet connection', 'error');
          return;
        }

        setLocalLoading(true);

        const result = await ImagePicker.launchImageLibrary({
          mediaType: 'photo',
          selectionLimit: 1,
          quality: 1,
          includeBase64: false,
        });

        if (result.assets && result.assets.length > 0) {
          const selectedImage = result.assets[0];
          await uploadImageToServer(selectedImage, userData.Token, onRefetchData);
        }
      } catch (error: any) {
        showToast('Error', error?.message || 'Failed to pick image', 'error');
      } finally {
        setLocalLoading(false);
      }
    },
    [UserPicks, setUserPicks, userData.Token, showToast, onRefetchData]
  );

  return (
    <Pressable
      disabled={isLoading || localLoading}
      onPress={() => handleOnImagePress(item)}
      style={styles.AddUserPhotoView}
    >
      <EditProfileRenderImageBox
        onDelete={() => {}}
        onAdd={() => {
          const newPics = UserPicks.map(addUrlToItem(item)).sort(sortByUrl);
          const imagesWithUrls = newPics.filter((pick) => pick.url);
          const lastSixImages = imagesWithUrls.slice(-6);

          const finalPicks = Array.from({ length: 6 }, (_, index) => {
            if (index < lastSixImages.length) {
              return lastSixImages[index];
            }
            return {
              name: '',
              type: '',
              key: String(5 - index),
              url: '',
            };
          });

          setUserPicks(finalPicks);
        }}
        onChange={handleImageChange}
        picture={item}
        isLoading={isLoading || localLoading}
      />
    </Pressable>
  );
};

export default memo(EditProfileAllImageView);

const styles = StyleSheet.create({
  AddUserPhotoView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: heightPercentageToDP('0.5%'),
  },
});
