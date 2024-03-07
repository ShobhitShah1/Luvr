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
import {ActiveOpacity, COLORS, GROUP_FONT} from '../../../../Common/Theme';
import CommonIcons from '../../../../Common/CommonIcons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

interface HeaderProps {
  isAddContact: boolean;
}

const ContactHeader: FC<HeaderProps> = ({isAddContact}) => {
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
          <Text style={styles.Title}>
            {isAddContact ? 'Add contacts' : 'Block contacts'}
          </Text>
        </View>
        <View style={styles.AddIconAndOption}>
          {!isAddContact && (
            <React.Fragment>
              <TouchableOpacity
                activeOpacity={ActiveOpacity}
                onPress={() => {}}>
                <Image
                  resizeMode="contain"
                  style={styles.AddIcon}
                  source={CommonIcons.add_contact}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={ActiveOpacity}
                onPress={() => {}}>
                <Image
                  resizeMode="contain"
                  style={styles.MoreOptionIcon}
                  source={CommonIcons.more_option}
                />
              </TouchableOpacity>
            </React.Fragment>
          )}
        </View>
      </View>
    </View>
  );
};

export default ContactHeader;

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
    width: hp('3%'),
    height: hp('3%'),
  },
  TitleView: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Title: {
    ...GROUP_FONT.h3,
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
