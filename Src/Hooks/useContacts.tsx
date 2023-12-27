import { useState } from 'react';
import { Alert } from 'react-native';
import Contacts from 'react-native-contacts';
import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
  request,
} from 'react-native-permissions';

export const useContacts = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [permissionState, setPermissionState] = useState<string>('');

  const fetchContacts = () => {
    Contacts.getAllWithoutPhotos()
      .then(fetchedContacts => {
        console.log('fetchedContacts:', fetchedContacts);
        setContacts(fetchedContacts);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const checkPermission = async () => {
    try {
      const result = await check(PERMISSIONS.ANDROID.READ_CONTACTS);
      setPermissionState(result);

      if (result === RESULTS.GRANTED) {
        fetchContacts();
        Contacts.getCount().then(count => {
          console.log(`Search ${count} contacts`);
        });
      } else if (result === RESULTS.UNAVAILABLE) {
        console.info('Contacts permission is not available on this device');
      } else {
        console.info('Contacts permission denied');
        showAlert();
      }
    } catch (error) {
      console.info('Permission error: ', error);
    }
  };

  const showAlert = () => {
    Alert.alert(
      'Permission Denied',
      'To access your contacts, please go to settings and enable the Contacts permission.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => openSettings()},
      ],
      {cancelable: false},
    );
  };

  const requestPermission = async () => {
    try {
      const status = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
      setPermissionState(status);

      if (status === RESULTS.GRANTED) {
        checkPermission();
      } else {
        console.info('Contacts permission denied');
        showAlert();
      }
    } catch (error) {
      console.info('Permission error: ', error);
    }
  };

  return {contacts, permissionState, requestPermission};
};
