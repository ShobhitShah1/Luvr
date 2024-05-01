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
      return false;
    }
  };

  const showAlertAndNavigateToSettings = () => {
    Alert.alert(
      'Gallery Access Denied',
      "To upload a profile image, access to your device's gallery is required. Please grant permission in your device settings to proceed. Would you like to open settings now?",
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
