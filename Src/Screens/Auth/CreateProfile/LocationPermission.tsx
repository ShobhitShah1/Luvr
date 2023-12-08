import React, {FC} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonImages from '../../../Common/CommonImages';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CreateProfileStyles from './styles';

const LocationPermission: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  return (
    <View style={styles.container}>
      <View style={styles.MiddleImageView}>
        <Image source={CommonImages.Location} style={styles.LocationImage} />
      </View>

      <View style={styles.MiddleTextView}>
        <Text style={styles.TitleText}>Allow your location</Text>
        <Text style={styles.DescriptionText}>
          Set your location to see nearby people. You won’t be able to match
          with people otherwise.
        </Text>
      </View>

      <View style={[CreateProfileStyles.BottomButton]}>
        <GradientButton
          Title={'Allow'}
          Disabled={false}
          Navigation={() => {
            navigation.navigate('LoginStack', {
              screen: 'AvoidContacts',
            });
          }}
        />
      </View>
    </View>
  );
};

export default LocationPermission;

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
    width: '85%',
    top: hp('0.5%'),
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
});
