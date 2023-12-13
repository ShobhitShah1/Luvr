import {RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';
import {COLORS, FONTS} from '../../../../Common/Theme';
import {CardDetailType} from '../../../../Types/CardDetailType';

type DetailCardRouteParams = {
  props: CardDetailType;
};

const DetailCardHeader = () => {
  const CardDetail =
    useRoute<RouteProp<Record<string, DetailCardRouteParams>, string>>();

  const item = CardDetail.params.props || {};

  return (
    <View style={styles.Container}>
      <View style={styles.ContentView}>
        <View style={styles.NameAndBadgeView}>
          <Text style={styles.HeaderText}>
            {item.name}, {item.age}
          </Text>
          <Image
            resizeMode="contain"
            style={styles.VerifyIcon}
            source={CommonIcons.Verification_Icon}
          />
        </View>
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
  NameAndBadgeView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  HeaderText: {
    fontFamily: FONTS.SemiBold,
    fontSize: hp('2.1%'),
    color: COLORS.Primary,
  },
  VerifyIcon: {
    width: hp('2%'),
    height: hp('2%'),
    alignSelf: 'center',
    alignItems: 'center',
    marginHorizontal: hp('0.7%'),
  },
});
