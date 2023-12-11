import {RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, GROUP_FONT} from '../../../../Common/Theme';

type DetailCardRouteParams = {
  props: {
    // Define the structure of the 'props' object
    item: {
      // Define the properties of the 'item' object
      // Adjust types as needed
      id: number;
      name: string;
      // ... other properties
    };
  };
};

const DetailCardHeader = () => {
  const CardDetail =
    useRoute<RouteProp<Record<string, DetailCardRouteParams>, string>>();
  // Access and validate the params
  const {props} = CardDetail.params || {};
  const item = props || {};
    console.log(item);

  return (
    <View style={styles.Container}>
      <View style={styles.ContentView}>
        <Text style={styles.HeaderText}>DetailCardHeader</Text>
      </View>
    </View>
  );
};

export default DetailCardHeader;

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    height: hp('7%'),
    justifyContent: 'center',
    backgroundColor: COLORS.White,
  },
  ContentView: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  HeaderText: {
    ...GROUP_FONT.h3,
    color: COLORS.Primary,
  },
});
