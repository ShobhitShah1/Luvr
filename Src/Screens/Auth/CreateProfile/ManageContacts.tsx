import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, GROUP_FONT} from '../../../Common/Theme';
import Blocked from './Contacts/Blocked';
import ContactScreen from './Contacts/ContactScreen';

const Tab = createMaterialTopTabNavigator();

const ManageContacts: React.FC = () => {
  return (
    <View style={styles.Container}>
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: COLORS.Black,
          },
          tabBarLabelStyle: {
            ...GROUP_FONT.h4,
            fontSize: hp('1.3%'),
          },
        }}>
        <Tab.Screen name="Contacts" component={ContactScreen} />
        <Tab.Screen name="Blocked" component={Blocked} />
      </Tab.Navigator>
    </View>
  );
};

export default ManageContacts;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
});
