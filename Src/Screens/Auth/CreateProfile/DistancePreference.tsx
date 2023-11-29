import Slider from 'react-native-slider';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const DistancePreference: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const [milesValue, setMilesValue] = useState<number>(0.75);

  const calculateMiles = (value: number): number => {
    const maxMiles = 100;
    return Math.round(value * maxMiles);
  };

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={4} Skip={false} />

      <View style={styles.DataViewContainer}>
        <View style={CreateProfileStyles.ContentView}>
          <Text style={styles.TitleText}>
            Set your distance {'\n'}Preference
          </Text>
          <Text style={styles.CompatibilityText}>
            Adjusting distance, It's like searching by location.
          </Text>
        </View>

        <View style={styles.SliderContainerView}>
          <View style={styles.DistancePrefView}>
            <Text style={styles.SliderInfoText}>Distance Preference</Text>
            <Text style={styles.SliderValue}>{`${calculateMiles(
              milesValue,
            )} KM`}</Text>
          </View>
          <View style={styles.SliderView}>
            <Slider
              value={milesValue}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              onValueChange={(value: number) => setMilesValue(value)}
              thumbTintColor={COLORS.Primary}
              maximumTrackTintColor={COLORS.White}
              minimumTrackTintColor={COLORS.Primary}
              style={styles.SliderStyle}
            />
          </View>
        </View>
      </View>

      <View style={CreateProfileStyles.BottomButton}>
        <GradientButton
          Title={'Continue'}
          Disabled={false}
          Navigation={() => {
            navigation.navigate('LoginStack', {
              screen: 'YourStudy',
            });
          }}
        />
      </View>
    </View>
  );
};

export default DistancePreference;

const styles = StyleSheet.create({
  CompatibilityText: {
    ...GROUP_FONT.h3,
    marginVertical: hp('1%'),
    fontFamily: FONTS.Medium,
  },
  DataViewContainer: {
    marginHorizontal: hp('1.2%'),
    marginTop: hp('1%'),
  },
  TitleText: {
    color: COLORS.Primary,
    fontSize: hp('3.3%'),
    fontFamily: FONTS.Bold,
  },
  SliderContainerView: {
    width: '100%',
    alignSelf: 'center',
    // backgroundColor:'red',
    marginVertical: hp('6%'),
    paddingHorizontal: hp('1%'),
    // paddingHorizontal: hp('1.9%'),
  },
  DistancePrefView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: hp('1.9%'),
  },
  SliderStyle: {
    width: '98%',
    height: hp('5%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  SliderInfoText: {
    ...GROUP_FONT.h3,
    fontFamily: FONTS.SemiBold,
  },
  SliderValue: {
    ...GROUP_FONT.h3,
    fontFamily: FONTS.SemiBold,
  },
  LaterCanSaveTextView: {
    marginVertical: hp('1.5%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  LaterCanSaveText: {
    ...GROUP_FONT.body3,
  },
  SliderView: {
    marginVertical: hp('1.5%'),
    width: '92%',
    justifyContent: 'center',
    alignSelf:'center'
  },
});
