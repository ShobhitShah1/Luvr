import {useEffect, useState} from 'react';
import Contacts from 'react-native-contacts';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';

export const useContacts = () => {
  const [contacts, setContacts] = useState<any[]>([]);

  const fetchContacts = () => {
    Contacts.getAll()
      .then(fetchedContacts => {
        setContacts(fetchedContacts);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const checkPermission = async () => {
    try {
      const result = await check(PERMISSIONS.ANDROID.READ_CONTACTS);
      if (result === RESULTS.GRANTED) {
        fetchContacts();
        Contacts.getCount().then(count => {
          console.log(`Search ${count} contacts`);
        });
      } else {
        console.error('Contacts permission denied');
      }
    } catch (error) {
      console.error('Permission error: ', error);
    }
  };

  useEffect(() => {
    const askPermission = async () => {
      try {
        const status = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
        if (status === RESULTS.GRANTED) {
          checkPermission();
        } else {
          console.error('Contacts permission denied');
        }
      } catch (error) {
        console.error('Permission error: ', error);
      }
    };

    askPermission();
  }, []);

  return {contacts};
};
