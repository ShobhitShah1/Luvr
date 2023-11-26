// import Slider from '@react-native-community/slider';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const DistancePreference: FC = () => {
  let ProgressCount: number = 0.5;
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const [milesValue, setMilesValue] = useState<number>(0.75);

  const calculateMiles = (value: number): number => {
    const maxMiles = 100;
    return Math.round(value * maxMiles);
  };

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={ProgressCount} Skip={false} />

      <View style={CreateProfileStyles.ContentView}>
        <Text style={CreateProfileStyles.TitleText}>
          Your Distance Preference?
        </Text>
        <Text style={styles.CompatibilityText}>
          Use the slider to set the maximum distance you would like potential
          matches to be located.
        </Text>
      </View>

      <View style={styles.SliderContainerView}>
        <View style={styles.DistancePrefView}>
          <Text style={styles.SliderInfoText}>Distance Preference</Text>
          <Text style={styles.SliderValue}>{`${calculateMiles(
            milesValue,
          )} mi`}</Text>
        </View>
        {/* <Slider
          value={milesValue}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          onValueChange={value => setMilesValue(value)}
          thumbTintColor={COLORS.Primary}
          maximumTrackTintColor={COLORS.Black}
          minimumTrackTintColor={COLORS.Primary}
          style={styles.SliderStyle}
        /> */}
      </View>

      <View style={CreateProfileStyles.BottomButton}>
        <View style={styles.LaterCanSaveTextView}>
          <Text style={styles.LaterCanSaveText}>
            You can change preferences later in Setting
          </Text>
        </View>
        <GradientButton
          Title={'Next'}
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
    fontFamily: FONTS.Regular,
  },
  SliderContainerView: {
    width: '100%',
    marginVertical: hp('2%'),
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
    ...GROUP_FONT.body3,
  },
  SliderValue: {
    ...GROUP_FONT.body3,
  },
  LaterCanSaveTextView: {
    marginVertical: hp('1.5%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  LaterCanSaveText: {
    ...GROUP_FONT.body3,
  },
});
