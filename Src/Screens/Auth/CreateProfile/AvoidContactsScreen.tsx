import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonImages from '../../../Common/CommonImages';
import {
  ActiveOpacity,
  COLORS,
  FONTS,
  GROUP_FONT,
} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CreateProfileStyles from './styles';

const AvoidContactsScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{BottomTab: {}}>>();
  return (
    <View style={styles.container}>
      <View style={styles.MiddleImageView}>
        <Image
          source={CommonImages.Avoid_Contact}
          style={styles.LocationImage}
        />
      </View>

      <View style={styles.MiddleTextView}>
        <Text style={styles.TitleText}>
          Want to avoid someone you know on Dating App?
        </Text>
        <Text style={styles.DescriptionText}>
          If your contact has an account with the same details you provide, We
          will store your blocked contacts to stop you from seeing each other.
        </Text>
      </View>

      <View style={[CreateProfileStyles.BottomButton]}>
        <GradientButton
          Title={'Continue'}
          Disabled={false}
          Navigation={() => {
            navigation.navigate('BottomTab', {
              screen: 'Home',
            });
          }}
        />

        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          style={styles.CancelView}>
          <Text style={styles.CancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AvoidContactsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: hp('1.3%'),
    backgroundColor: COLORS.Secondary,
  },
  MiddleImageView: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  MiddleTextView: {
    flex: 0.35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  TitleText: {
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: hp('3%'),
    lineHeight: 36,
    color: COLORS.Primary,
  },
  DescriptionText: {
    width: '90%',
    marginTop: hp('1%'),
    fontFamily: FONTS.Regular,
    color: COLORS.Black,
    fontSize: hp('1.5%'),
    textAlign: 'center',
  },
  BottomButtonView: {
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: hp('2%'),
    overflow: 'hidden',
    justifyContent: 'center',
  },
  LocationImage: {
    width: hp('30%'),
    height: hp('30%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  CancelView: {
    marginTop: hp('2%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  CancelText: {
    textAlign: 'center',
    ...GROUP_FONT.h3,
    color: COLORS.Primary,
  },
});
