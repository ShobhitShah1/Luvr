import {useState} from 'react';
import {Platform, Linking, Alert} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const useGalleryPermission = () => {
  const [galleryPermission, setGalleryPermission] = useState(false);

  const requestGalleryPermission = async () => {
    try {
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.PHOTO_LIBRARY;

      const result = await check(permission);
      console.log('result', result);
      if (Platform.OS === 'ios' ? result === RESULTS.GRANTED : true) {
        setGalleryPermission(true);
        return true;
      } else {
        const requestPermission = await request(permission);
        const isPermissionGranted = requestPermission === RESULTS.GRANTED;
        setGalleryPermission(isPermissionGranted);

        if (!isPermissionGranted) {
          showAlertAndNavigateToSettings();
        }

        return isPermissionGranted;
      }
    } catch (error) {
      console.error('Error checking or requesting gallery permission:', error);
      return false;
    }
  };

  const showAlertAndNavigateToSettings = () => {
    Alert.alert(
      'Permission Denied',
      'To access the gallery, you need to grant permission in device settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
        },
      ],
    );
  };

  return {galleryPermission, requestGalleryPermission};
};
