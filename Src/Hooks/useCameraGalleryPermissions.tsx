import {useEffect, useState} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';

const getCameraPermission = () => {
  return Platform.OS === 'android'
    ? PERMISSIONS.ANDROID.CAMERA
    : PERMISSIONS.IOS.CAMERA;
};

const getGalleryPermission = () => {
  return Platform.OS === 'android'
    ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    : PERMISSIONS.IOS.PHOTO_LIBRARY;
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
  const [permissions, setPermissions] = useState<Object>({
    camera: undefined,
    gallery: undefined,
  });

  useEffect(() => {
    const checkCurrentPermissions = async () => {
      try {
        const cameraStatus = await check(getCameraPermission());
        const galleryStatus = await check(getGalleryPermission());
        console.log(cameraStatus, galleryStatus);
        setPermissions({
          camera: cameraStatus,
          gallery: galleryStatus,
        });

        if (
          cameraStatus !== RESULTS.GRANTED ||
          galleryStatus !== RESULTS.GRANTED
        ) {
          showAlert();
        }
      } catch (error) {
        console.error('Permission check error: ', error);
      }
    };

    checkCurrentPermissions();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const status = await request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.IOS.CAMERA,
      );
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
      const status = await request(getGalleryPermission());
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
