import React, {memo} from 'react';
import {SectionList, Text, View} from 'react-native';
import {useContacts} from '../../../../Hooks/useContacts';
import styles from './styles';
import ContactSearch from '../Components/ContactSearch';

interface Contact {
  displayName: string;
  phoneNumbers: Array<{number: string}>;
}

interface Section {
  title: string;
  data: Contact[];
}

const ContactItem = memo(({item, index}: any) => (
  <View
    style={[
      styles.ContactView,
      {
        borderTopWidth: index === 0 ? 0 : 0.3,
      },
    ]}>
    <Text style={styles.ContactDisplayName}>{item?.displayName}</Text>
    <Text style={styles.ContactDisplayNumber}>
      {item?.phoneNumbers[0]?.number}
    </Text>
  </View>
));

const RenderHeader = (value: any) => {
  return (
    <View style={styles.SectionHeaderView}>
      <Text style={styles.SectionHeaderText}>{value?.title}</Text>
    </View>
  );
};

const ContactScreen = () => {
  const {contacts} = useContacts();
  const contactsWithNumbers = contacts.filter(
    contact => contact.phoneNumbers.length > 0,
  );

  const groupedContacts: Record<string, Contact[]> = contactsWithNumbers.reduce(
    (acc, contact) => {
      const letter = contact.displayName
        ? contact.displayName[0]?.toUpperCase()
        : false;
      if (!letter) {
        return acc;
      }
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(contact);
      return acc;
    },
    {},
  );

  const sections: Section[] = Object.keys(groupedContacts)
    .sort()
    .map(letter => ({
      title: letter,
      data: groupedContacts[letter] ?? [],
    }))
    .filter(section => section.data.length > 0);

  return (
    <View style={styles.Container}>
      <ContactSearch />

      {contacts.length !== 0 && (
        <SectionList
          bounces={false}
          sections={sections}
          maxToRenderPerBatch={30}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <ContactItem item={item} index={index} />
          )}
          renderSectionHeader={({section: {title}}) => (
            <RenderHeader title={title} />
          )}
        />
      )}
    </View>
  );
};

export default ContactScreen;
