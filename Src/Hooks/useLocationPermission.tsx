import { useEffect, useState } from 'react';
import { Alert, BackHandler, Linking, Platform } from 'react-native';
import { PERMISSIONS, RESULTS, check, request, Permission } from 'react-native-permissions';
import { store } from '../Redux/Store/store';
import { updateField } from '../Redux/Action/actions';
import { LocalStorageFields } from '../Types/LocalStorageFields';
import Geolocation from 'react-native-geolocation-service';
import { APP_NAME } from '../Config/Setting';

const getLocationPermission = (): Permission => {
  if (Platform.OS === 'android') {
    return PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  } else {
    return PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
  }
};

export const useLocationPermission = () => {
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async (): Promise<boolean> => {
    try {
      const permission = getLocationPermission();
      const result = await check(permission);

      const isGranted = result === RESULTS.GRANTED;
      setLocationPermission(isGranted);

      if (isGranted) {
        storeCurrentCods();
      }

      return isGranted;
    } catch (error) {
      return false;
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const permission = getLocationPermission();

      const checkResult = await check(permission);

      if (checkResult === RESULTS.GRANTED) {
        setLocationPermission(true);
        storeCurrentCods();
        return true;
      }

      const requestResult = await request(permission);
      const isGranted = requestResult === RESULTS.GRANTED;

      setLocationPermission(isGranted);

      if (!isGranted) {
        if (requestResult === RESULTS.BLOCKED) {
          showAlertAndNavigateToSettings();
        }
      } else {
        storeCurrentCods();
      }

      return isGranted;
    } catch (error) {
      return false;
    }
  };

  const storeCurrentCods = async (): Promise<void> => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { coords } = position;
        if (coords) {
          await Promise.all([
            store.dispatch(updateField(LocalStorageFields.longitude, coords.longitude)),
            store.dispatch(updateField(LocalStorageFields.latitude, coords.latitude)),
          ]);
        }
      },
      (error) => {
        console.error('Error getting current location:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const showAlertAndNavigateToSettings = (): void => {
    Alert.alert(
      'Location Permission',
      `${APP_NAME} needs access to your location for a better user experience. This allows us to show you potential matches in your area and enhance your overall app experience.`,
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
      ]
    );
  };

  return {
    locationPermission,
    requestLocationPermission,
    checkLocationPermission,
    showAlertAndNavigateToSettings,
  };
};
