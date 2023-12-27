import React, {memo} from 'react';
import {FlatList, Image, Text, View} from 'react-native';
import {useContacts} from '../../../../Hooks/useContacts';
import styles from './styles';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';
import {COLORS} from '../../../../Common/Theme';

interface Contact {
  displayName: string;
  phoneNumbers: Array<{number: string}>;
}

interface Section {
  title: string;
  data: Contact[];
}

interface ContactItemProps {
  item: Contact;
  index: number;
}

const ContactItem = memo(({item, index}: ContactItemProps) => (
  <View key={index} style={[styles.ContactView]}>
    <View style={styles.NumberAndNameContainerView}>
      <Text style={styles.ContactDisplayName}>{item?.displayName}</Text>
      <Text style={styles.ContactDisplayNumber}>
        {item?.phoneNumbers[0]?.number}
      </Text>
    </View>
    <View style={styles.CheckBoxView}>
      <View style={styles.CheckBox}>
        <Image
          resizeMode="contain"
          tintColor={COLORS.White}
          source={CommonIcons.Check}
          style={styles.CheckImage}
        />
      </View>
    </View>
  </View>
));

const RenderHeader = ({title}: {title: string}) => (
  <View
    style={[
      styles.SectionHeaderView,
      {
        paddingTop: title === 'A' ? hp('1%') : hp('4%'),
      },
    ]}>
    <Text style={styles.SectionHeaderText}>{title}</Text>
  </View>
);

const AllContactRender = () => {
  const {contacts} = useContacts();
  console.log('contacts:', contacts);
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

  const ListEmptyComponent = () => {
    return (
      <View style={styles.ListEmptyView}>
        <Text style={styles.ListEmptyText}>No Contact Found</Text>
      </View>
    );
  };

  return (
    <View style={styles.Container}>
      <FlatList
        data={sections}
        keyExtractor={item => item.title}
        renderItem={({item}) => (
          <React.Fragment>
            <RenderHeader title={item.title} />
            <FlatList
              data={item.data}
              contentContainerStyle={{flex: contacts.length === 0 ? 1 : 0}}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <ContactItem item={item} index={index} />
              )}
              ListEmptyComponent={<ListEmptyComponent />}
            />
          </React.Fragment>
        )}
      />
    </View>
  );
};

export default AllContactRender;
