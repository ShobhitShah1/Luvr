import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { memo, useState } from 'react';
import type { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';

import GradientView from '../../../Common/GradientView';
import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CustomSlider from '../../../Components/CustomSlider';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import { updateField } from '../../../Redux/Action/actions';
import { LocalStorageFields } from '../../../Types/LocalStorageFields';

import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const DistancePreference: FC = () => {
  const { colors } = useTheme();

  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user);
  const navigation = useCustomNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [milesValue, setMilesValue] = useState<number>(userData.radius ? userData.radius : 75);

  const onChangeKM = (value: number) => {
    const roundedValue = parseFloat((value * 100).toFixed(2));
    setMilesValue(roundedValue);
  };

  const onNextPress = () => {
    try {
      setIsLoading(true);
      dispatch(updateField(LocalStorageFields.radius, milesValue));

      setTimeout(() => {
        navigation.navigate('LoginStack', {
          screen: 'YourEducation',
        });
      }, 200);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientView>
      <View style={CreateProfileStyles.Container}>
        <CreateProfileHeader ProgressCount={4} Skip={false} />

        <View style={styles.DataViewContainer}>
          <View style={CreateProfileStyles.ContentView}>
            <Text style={[styles.TitleText, { color: colors.TitleText }]}>
              Set your distance {'\n'}Preference
            </Text>
            <Text style={[styles.CompatibilityText, { color: colors.TextColor }]}>
              Adjusting distance, It's like searching by location.
            </Text>
          </View>

          <View style={styles.SliderContainerView}>
            <View style={styles.DistancePrefView}>
              <Text style={[styles.SliderInfoText, { color: colors.TextColor }]}>
                Distance Preference
              </Text>
              <Text
                style={[styles.SliderValue, { color: colors.TextColor }]}
              >{`${milesValue} KM`}</Text>
            </View>
            <View style={styles.SliderView}>
              <CustomSlider
                defaultProgress={(milesValue ?? 0) / 100}
                onProgressChange={onChangeKM}
              />
            </View>
          </View>
        </View>

        <View style={CreateProfileStyles.BottomButton}>
          <GradientButton
            Title="Continue"
            isLoading={isLoading}
            Disabled={isLoading}
            Navigation={() => onNextPress()}
          />
        </View>
      </View>
    </GradientView>
  );
};

export default memo(DistancePreference);

const styles = StyleSheet.create({
  CompatibilityText: {
    ...GROUP_FONT.h3,
    fontFamily: FONTS.Medium,
    marginVertical: hp('1%'),
  },
  DataViewContainer: {
    marginHorizontal: hp('1.2%'),
    marginTop: hp('1%'),
  },
  DistancePrefView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: hp('1.9%'),
  },
  LaterCanSaveText: {
    ...GROUP_FONT.body3,
  },
  LaterCanSaveTextView: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: hp('1.5%'),
  },
  SliderContainerView: {
    width: '100%',
    alignSelf: 'center',
    // backgroundColor:'red',
    marginVertical: hp('6%'),
    paddingHorizontal: hp('1%'),
    // paddingHorizontal: hp('1.9%'),
  },
  SliderInfoText: {
    ...GROUP_FONT.h3,
    fontFamily: FONTS.SemiBold,
  },
  SliderStyle: {
    alignSelf: 'center',
    height: hp('5%'),
    justifyContent: 'center',
    top: 50,
    width: '98%',
  },
  SliderValue: {
    ...GROUP_FONT.h3,
    fontFamily: FONTS.SemiBold,
  },
  SliderView: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: hp('3.5%'),
    width: '92%',
  },
  TitleText: {
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
    fontSize: hp('3.3%'),
  },
});
