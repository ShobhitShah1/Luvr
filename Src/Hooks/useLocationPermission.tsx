import {useState} from 'react';
import {Alert, BackHandler, Linking, Platform} from 'react-native';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';

export const useLocationPermission = () => {
  const [locationPermission, setLocationPermission] = useState(false);

  const checkLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      const result = await check(permission);
      console.log('📍 Location Permission Status:', result);
      if (result === RESULTS.GRANTED) {
        setLocationPermission(true);
      }
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Error checking location permission:', error);
      return false;
    }
  };

  const requestLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      const result = await check(permission);
      if (result === RESULTS.GRANTED) {
        setLocationPermission(true);
        return true;
      } else {
        const requestPermission = await request(permission);
        console.log(
          '📍 Location Permission Request Status:',
          requestPermission,
        );
        const isPermissionGranted = requestPermission === RESULTS.GRANTED;
        setLocationPermission(isPermissionGranted);

        if (!isPermissionGranted) {
          showAlertAndNavigateToSettings();
        }

        return isPermissionGranted;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  const showAlertAndNavigateToSettings = () => {
    Alert.alert(
      'Location Permission',
      '{AppName} needs access to your location for a better user experience. This allows us to show you potential matches in your area and enhance your overall app experience.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => BackHandler.exitApp(),
        },
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
        },
      ],
    );
  };

  return {
    locationPermission,
    requestLocationPermission,
    checkLocationPermission,
    showAlertAndNavigateToSettings,
  };
};
