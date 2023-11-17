import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS, GROUP_FONT} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

const LocationPermission: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  return (
    <View style={styles.container}>
      <View style={styles.TopTitleView}>
        <Text style={styles.TitleText}>So, are you from around here?</Text>
        <Text style={styles.TitleSubText}>
          Set your location to see who's in your area or beyond. You won't be
          able to match with people otherwise
        </Text>
      </View>

      <View style={styles.MiddleImageView}>
        {/* <View style={styles.MiddleCircle}>
          <SimpleLineIcons
            name="location-pin"
            color={COLORS.Gray}
            size={wp('25%')}
            style={styles.IconStyle}
          />
        </View> */}
      </View>

      <View style={styles.BottomButtonView}>
        <GradientButton
          Title="Allow"
          Disabled={false}
          Navigation={() =>
            navigation.navigate('LoginStack', {
              screen: 'ManageContacts',
            })
          }
        />
        <Text style={styles.HowIsLocationUsedText}>
          How is my location used?{' '}
          <AntDesign
            name="arrowdown"
            color={COLORS.Black}
            size={wp('5%')}
            style={styles.IconStyle}
          />
        </Text>
      </View>
    </View>
  );
};

export default LocationPermission;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: hp('1.3%'),
    backgroundColor: COLORS.White,
  },
  TopTitleView: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: hp('1.5%'),
  },
  TitleText: {
    ...GROUP_FONT.h2,
    fontSize: hp('2.7%'),
  },
  TitleSubText: {
    marginTop: hp('1.5%'),
    ...GROUP_FONT.body4,
    textAlign: 'center',
    color: COLORS.Black,
  },
  MiddleImageView: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BottomButtonView: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: hp('1%'),
  },
  HowIsLocationUsedText: {
    ...GROUP_FONT.h3,
    color: COLORS.Brown,
    fontSize: hp('2%'),
    marginTop: hp('2.5%'),
    marginBottom: hp('0.5%'),
  },
  IconStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  MiddleCircle: {
    width: '60%',
    height: '45%',
    borderRadius: wp('100%'),
    backgroundColor: COLORS.LightGray,
    justifyContent: 'center',
  },
  LocationImage: {
    width: '80%',
    height: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
