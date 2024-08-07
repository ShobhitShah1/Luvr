/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../Common/CommonIcons';
import {ActiveOpacity, COLORS, GROUP_FONT} from '../../../Common/Theme';

interface HeaderProps {
  Title: string;
  onUpdatePress?: () => void;
  isLoading?: boolean;
}

const ProfileAndSettingHeader: FC<HeaderProps> = ({
  Title,
  onUpdatePress,
  isLoading,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  return (
    <View style={styles.Container}>
      <SafeAreaView />
      <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.White} />
      <View style={styles.ContentView}>
        <TouchableOpacity
          disabled={isLoading}
          activeOpacity={ActiveOpacity}
          onPress={() => navigation.goBack()}
          style={styles.ViewStyle}>
          <Image
            resizeMode="contain"
            style={styles.BackIcon}
            source={CommonIcons.TinderBack}
          />
        </TouchableOpacity>
        <View
          style={[
            styles.TitleView,
            {right: Title === 'Notification' ? 10 : 0},
          ]}>
          <Text style={styles.Title}>{Title}</Text>
        </View>
        {Title !== 'Notification' ? (
          <TouchableOpacity
            disabled={isLoading}
            style={styles.ModalSubmitButton}
            onPress={onUpdatePress}
            activeOpacity={ActiveOpacity}>
            <Image
              source={CommonIcons.Check}
              tintColor={COLORS.White}
              style={styles.ModalSubmitIcon}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    </View>
  );
};

export default ProfileAndSettingHeader;

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    height: Platform.OS === 'ios' ? hp('12%') : hp('6.8%'),
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
    top: Platform.OS === 'ios' ? 5 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ViewStyle: {
    width: '10%',
    justifyContent: 'center',
  },
  BackIcon: {
    width: 25,
    height: 25,
  },
  TitleView: {
    width: '75%',
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
  SettingView: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  SettingText: {
    ...GROUP_FONT.h4,
    color: COLORS.Primary,
    textAlign: 'center',
  },
  ModalSubmitButton: {
    width: 25,
    height: 25,
    borderRadius: 500,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.Primary,
  },
  ModalSubmitIcon: {
    width: 15,
    height: 15,
    alignSelf: 'center',
  },
});
