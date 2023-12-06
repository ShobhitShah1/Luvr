import {useState} from 'react';
import {Alert, Linking, NativeModules, Platform} from 'react-native';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';

const {CheckVersion} = NativeModules;

type Permission = any;

interface Permissions {
  camera?: string;
  gallery?: string;
}

const getCameraPermission = () => {
  return Platform.OS === 'android'
    ? PERMISSIONS.ANDROID.CAMERA
    : PERMISSIONS.IOS.CAMERA;
};

const getGalleryPermission = (): Promise<Permission> => {
  return new Promise(resolve => {
    CheckVersion.getCurrentVersion((isTiramisu: boolean) => {
      console.log(`Is TIRAMISU: ${isTiramisu}`);
      const permission =
        Platform.OS === 'android'
          ? isTiramisu
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.PHOTO_LIBRARY;
      resolve(permission);
    });
  });
};

const openAppSettings = () => {
  Linking.openSettings();
};

const showAlert = () => {
  Alert.alert(
    'Permission Blocked',
    'To enable this feature, please grant the necessary permissions in the app settings.',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Open Settings', onPress: openAppSettings},
    ],
  );
};

const useCameraGalleryPermissions = () => {
  const [permissions, setPermissions] = useState<Permissions>({
    camera: undefined,
    gallery: undefined,
  });

  const requestCameraPermission = async () => {
    try {
      console.log(getCameraPermission());
      const status = await request(getCameraPermission());
      setPermissions(prevPermissions => ({
        ...prevPermissions,
        camera: status,
      }));

      if (status !== RESULTS.GRANTED) {
        showAlert();
      }
    } catch (error) {
      console.error('Camera permission request error: ', error);
    }
  };

  const requestGalleryPermission = async () => {
    try {
      const permission: Permission = await getGalleryPermission();

      const status = await request(permission);
      console.log('status:', status);
      setPermissions(prevPermissions => ({
        ...prevPermissions,
        gallery: status,
      }));

      if (
        status === RESULTS.BLOCKED ||
        status === RESULTS.DENIED ||
        status === RESULTS.UNAVAILABLE
      ) {
        showAlert();
      }
    } catch (error) {
      console.error('Gallery permission request error: ', error);
    }
  };

  return {
    requestCameraPermission,
    requestGalleryPermission,
    permissions,
  };
};

export default useCameraGalleryPermissions;
