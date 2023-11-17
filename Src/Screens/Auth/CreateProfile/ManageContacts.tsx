import {
  FlatList,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import Contacts from 'react-native-contacts';

const ManageContacts: FC = () => {
  useEffect(() => {
    AskPermission();
  }, []);

  const [StoreContacts, setStoreContacts] = useState<[]>([]);

  const windowSize = StoreContacts.length > 50 ? StoreContacts.length / 4 : 21;
  console.log('windowSize', windowSize);
  const AskPermission = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    })
      .then(res => {
        Contacts.getAll()
          .then(contacts => {
            setStoreContacts(contacts);
          })
          .catch(e => {
            console.log(e);
          });

        Contacts.getCount().then(count => {
          console.log(`Search ${count} contacts`);
        });

        Contacts.checkPermission();

        // console.log('Permission: ', res);
        // Contacts.getAll()
        //   .then(contacts => {
        //     // work with contacts
        //     console.log(contacts);
        //   })
        //   .catch(e => {
        //     console.log(e);
        //   });
      })
      .catch(error => {
        console.error('Permission error: ', error);
      });
  };

  return (
    <View>
      <FlatList
        data={StoreContacts}
        disableVirtualization={true}
        // maxToRenderPerBatch={windowSize}
        // windowSize={windowSize}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <View key={index}>
            <Text>
              {item?.displayName}: {item?.phoneNumbers[0]?.number}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default ManageContacts;

const styles = StyleSheet.create({});
