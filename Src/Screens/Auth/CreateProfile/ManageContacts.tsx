import React, {FC, useEffect, useLayoutEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {ActiveOpacity, COLORS, GROUP_FONT} from '../../../Common/Theme';
import {ContactTabData} from '../../../Components/Data/ContactTabData';
import ContactHeader from './Components/ContactHeader';
import ContactSearch from './Components/ContactSearch';
import ContactTabButton from './Components/ContactTabButton';
import AllContactRender from './Contacts/AllContactRender';
import Blocked from './Contacts/Blocked';
import {useContacts} from '../../../Hooks/useContacts';
import {RESULTS} from 'react-native-permissions';

const ManageContacts: FC = () => {
  const {contacts, permissionState, requestPermission} = useContacts();

  const [SelectedContactTab, setSelectedContactTab] = useState<number>(1);
  const [ContactPermission, setContactPermission] =
    useState<string>(permissionState);

  useEffect(() => {
    console.log(
      'permissionState:',
      permissionState === RESULTS.GRANTED,
      SelectedContactTab,
    );
    setContactPermission(permissionState);
  }, [permissionState, contacts]);

  const RenderPermissionButton = () => {
    return (
      <View
        style={{
          marginTop: hp('20%'),
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={requestPermission}
          style={{
            width: '55%',
            height: hp('6%'),
            justifyContent: 'center',
            borderRadius: hp('3%'),
            backgroundColor: COLORS.Primary,
          }}>
          <Text
            style={{
              textAlign: 'center',
              ...GROUP_FONT.h4,
              color: COLORS.White,
            }}>
            Import Contact
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    if (ContactPermission === RESULTS.GRANTED) {
      return SelectedContactTab === 1 ? <AllContactRender /> : <Blocked />;
    } else {
      return <RenderPermissionButton />;
    }
  };

  return (
    <View style={styles.Container}>
      <ContactHeader isAddContact={false} />

      <View style={styles.ContentView}>
        {/* Top Tab Bar View */}
        <View style={styles.TabBarContainer}>
          {ContactTabData.map((res, index) => {
            return (
              <ContactTabButton
                key={res.id}
                label={res.title}
                isSelected={SelectedContactTab === res.id}
                onPress={() => setSelectedContactTab(res.id)}
              />
            );
          })}
        </View>

        {/* Search View */}
        <View style={styles.SearchBarContainer}>
          <ContactSearch />
        </View>

        {/* Content View */}
        <View style={{flexGrow: 1, marginBottom: hp('46%')}}>
          {renderContent()}
        </View>
      </View>
    </View>
  );
};

export default ManageContacts;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.Secondary,
  },
  ContentView: {
    width: '90%',
    paddingVertical: hp('3%'),
  },
  TabBarContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  SearchBarContainer: {
    alignItems: 'center',
    paddingVertical: hp('3%'),
  },
});
