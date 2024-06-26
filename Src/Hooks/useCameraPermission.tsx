import {useState} from 'react';
import {Platform, Linking, Alert} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const useCameraPermission = () => {
  const [cameraPermission, setCameraPermission] = useState(false);

  const requestCameraPermission = async () => {
    try {
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.IOS.CAMERA;

      const result = await check(permission);
      if (result === RESULTS.GRANTED) {
        setCameraPermission(true);
        return true;
      } else {
        const requestPermission = await request(permission);
        const isPermissionGranted = requestPermission === RESULTS.GRANTED;
        setCameraPermission(isPermissionGranted);

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
      'Camera Access Denied',
      'To take photos for your profile, camera access is required. Please grant camera permission in your device settings to proceed. Would you like to open settings now?',
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

  return {cameraPermission, requestCameraPermission};
};
