import React, {FC} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../Common/CommonIcons';
import {ActiveOpacity, COLORS, FONTS} from '../../../Common/Theme';
import {useNavigation} from '@react-navigation/native';
import {APP_NAME} from '../../../Config/Setting';

interface BottomTabHeaderProps {
  hideSettingAndNotification?: boolean;
  showSetting?: boolean;
}

const BottomTabHeader: FC<BottomTabHeaderProps> = ({
  hideSettingAndNotification,
  showSetting,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.Container}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={COLORS.White}
        animated={true}
      />
      <View style={styles.ContentView}>
        <View style={styles.TitleTextView}>
          <Text style={styles.TitleText}>{APP_NAME}</Text>
        </View>

        {!hideSettingAndNotification && (
          <View style={styles.IconsView}>
            <View style={styles.IconWrapper}>
              <Image
                style={styles.Icons}
                resizeMode="contain"
                source={CommonIcons.Notification}
              />
            </View>
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              onPress={() => {
                navigation.navigate('Setting');
              }}
              style={styles.IconWrapper}>
              <Image
                style={styles.Icons}
                resizeMode="contain"
                source={CommonIcons.Setting}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default BottomTabHeader;

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    height: hp('8%'),
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
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TitleTextView: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  TitleText: {
    fontFamily: FONTS.Bold,
    fontSize: hp('2%'),
    color: COLORS.Primary,
  },
  IconsView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  IconWrapper: {
    marginHorizontal: hp('1%'),
    justifyContent: 'center',
  },
  Icons: {
    width: hp('3.5%'),
    height: hp('3%'),
  },
});
