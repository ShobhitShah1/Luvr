import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {FC} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';
import {ActiveOpacity, COLORS, FONTS} from '../../../../Common/Theme';
import {ProfileType} from '../../../../Types/ProfileType';
import useCalculateAge from '../../../../Hooks/useCalculateAge';

type DetailCardRouteParams = {
  props: ProfileType | undefined;
};

const DetailCardHeader: FC<DetailCardRouteParams> = ({props}) => {
  const CardDetail =
    useRoute<RouteProp<Record<string, DetailCardRouteParams>, string>>();
  const {goBack} = useNavigation();
  const item = props || CardDetail.params.props;

  const Age = useCalculateAge(item?.birthdate || '00/00/0000');

  return (
    <View style={styles.Container}>
      <SafeAreaView />
      <View style={styles.ContentView}>
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => {
            goBack();
          }}
          style={styles.BackIconView}>
          <Image
            resizeMode="contain"
            source={CommonIcons.TinderBack}
            style={styles.BackIcon}
          />
        </TouchableOpacity>
        <View style={styles.NameAndBadgeView}>
          <Text numberOfLines={1} style={styles.HeaderText}>
            {item?.full_name || 'User'}, {Age || 0}
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
    // height: hp('7%'),
    height: Platform.OS === 'ios' ? hp('12.5%') : hp('7%'),
    justifyContent: 'center',
    backgroundColor: COLORS.White,
  },
  ContentView: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  BackIconView: {
    justifyContent: 'center',
  },
  BackIcon: {
    width: hp('3%'),
    height: hp('3%'),
  },
  NameAndBadgeView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    width: '90%',
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
