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
  const [permissionAttempts, setPermissionAttempts] = useState<number>(0);

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

  const requestLocationPermission = async (isLoggedIn: boolean = false): Promise<boolean> => {
    try {
      const permission = getLocationPermission();
      const checkResult = await check(permission);

      if (checkResult === RESULTS.GRANTED) {
        setLocationPermission(true);
        storeCurrentCods();
        return true;
      }

      if (checkResult === RESULTS.BLOCKED) {
        showBlockedAlert();
        return false;
      }

      if (isLoggedIn) {
        setPermissionAttempts((prev) => prev + 1);
      }

      const requestResult = await request(permission);
      const isGranted = requestResult === RESULTS.GRANTED;

      setLocationPermission(isGranted);

      if (!isGranted) {
        if (isLoggedIn) {
          if (requestResult === RESULTS.BLOCKED || permissionAttempts >= 1) {
            showBlockedAlert();
          }
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
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
  };

  const showBlockedAlert = (): void => {
    Alert.alert(
      'Location Permission Required',
      `${APP_NAME} requires location access to function properly. Please enable location services in your device settings to continue using the app.`,
      [
        {
          text: 'Exit App',
          style: 'destructive',
          onPress: () => BackHandler.exitApp(),
        },
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
        },
      ],
      { cancelable: false }
    );
  };

  return {
    locationPermission,
    requestLocationPermission,
    checkLocationPermission,
    showBlockedAlert,
  };
};
