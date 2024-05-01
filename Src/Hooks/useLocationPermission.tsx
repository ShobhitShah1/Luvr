import {useState} from 'react';
import {Alert, BackHandler, Linking, Platform} from 'react-native';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {store} from '../Redux/Store/store';
import {updateField} from '../Redux/Action/userActions';
import {LocalStorageFields} from '../Types/LocalStorageFields';
import Geolocation from 'react-native-geolocation-service';
import {APP_NAME} from '../Config/Setting';

export const useLocationPermission = () => {
  const [locationPermission, setLocationPermission] = useState(false);

  const checkLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      const result = await check(permission);
      if (result === RESULTS.GRANTED) {
        setLocationPermission(true);
      }
      return result === RESULTS.GRANTED;
    } catch (error) {
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
        StoreLetAndLong();
        return true;
      } else {
        const requestPermission = await request(permission);

        const isPermissionGranted = requestPermission === RESULTS.GRANTED;
        setLocationPermission(isPermissionGranted);

        if (!isPermissionGranted) {
          if (requestPermission === RESULTS.BLOCKED) {
            showAlertAndNavigateToSettings();
          }
        } else {
          StoreLetAndLong();
        }

        return isPermissionGranted;
      }
    } catch (error) {
      return false;
    }
  };

  const StoreLetAndLong = async () => {
    Geolocation.getCurrentPosition(
      async position => {
        const {coords} = position;
        if (coords) {
          await Promise.all([
            store.dispatch(
              updateField(LocalStorageFields.longitude, coords.longitude),
            ),
            store.dispatch(
              updateField(LocalStorageFields.latitude, coords.latitude),
            ),
          ]);
        }
      },
      error => {},
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const showAlertAndNavigateToSettings = () => {
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
