import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useContacts} from '../../../Hooks/useContacts';

const ManageContacts: React.FC = () => {
  const {contacts} = useContacts();

  const windowSize = contacts.length > 50 ? contacts.length / 4 : 21;

  return (
    <View>
      <FlatList
        data={contacts}
        disableVirtualization={true}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <View key={index}>
            <Text style={{color: 'red'}}>
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
