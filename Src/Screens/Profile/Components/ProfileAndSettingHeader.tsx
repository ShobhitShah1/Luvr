import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC} from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import {ActiveOpacity, COLORS, GROUP_FONT} from '../../../../Common/Theme';
// import CommonIcons from '../../../../Common/CommonIcons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import CommonIcons from '../../../Common/CommonIcons';
import {ActiveOpacity, COLORS, GROUP_FONT} from '../../../Common/Theme';

interface HeaderProps {
  Title: string;
}

const ProfileAndSettingHeader: FC<HeaderProps> = ({Title}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  return (
    <View style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.White} />
      <View style={styles.ContentView}>
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => navigation.goBack()}
          style={styles.ViewStyle}>
          <Image
            resizeMode="contain"
            style={styles.BackIcon}
            source={CommonIcons.TinderBack}
          />
        </TouchableOpacity>
        <View style={styles.TitleView}>
          <Text style={styles.Title}>{Title}</Text>
        </View>
        <View style={styles.AddIconAndOption} />
      </View>
    </View>
  );
};

export default ProfileAndSettingHeader;

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    height: hp('8%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.White,
    shadowColor: COLORS.Black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  ContentView: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ViewStyle: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  BackIcon: {
    width: 25,
    height: 25,
  },
  TitleView: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Title: {
    ...GROUP_FONT.h3,
    fontSize: 16,
    lineHeight: 25,
    color: COLORS.Black,
  },
  AddIconAndOption: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  AddIcon: {
    width: hp('2.75%'),
    height: hp('2.75%'),
    right: hp('1.5%'),
  },
  MoreOptionIcon: {
    width: hp('2.6%'),
    height: hp('2.6%'),
  },
});
