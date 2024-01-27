import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonImages from '../../../Common/CommonImages';
import {COLORS, FONTS} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import {useLocationPermission} from '../../../Hooks/useLocationPermission';
import CreateProfileStyles from './styles';
import Geolocation from 'react-native-geolocation-service';
import {useCustomToast} from '../../../Utils/toastUtils';
import {updateField} from '../../../Redux/Action/userActions';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {useDispatch} from 'react-redux';

const LocationPermission: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const {showToast} = useCustomToast();
  const dispatch = useDispatch();
  const {locationPermission, requestLocationPermission} =
    useLocationPermission();
  const [IsLocationLoading, setIsLocationLoading] = useState(false);

  const onNextPress = async () => {
    if (locationPermission) {
      setIsLocationLoading(true);
      navigateToNextScreen();
    } else {
      const requestPermission = await requestLocationPermission();
      if (requestPermission) {
        setIsLocationLoading(true);
        navigateToNextScreen();
      } else {
        setIsLocationLoading(false);
      }
    }
  };

  const navigateToNextScreen = async () => {
    setIsLocationLoading(true);
    try {
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          async position => {
            const {coords} = position;
            if (coords) {
              await Promise.all([
                dispatch(
                  updateField(LocalStorageFields.longitude, coords.longitude),
                ),
                dispatch(
                  updateField(LocalStorageFields.latitude, coords.latitude),
                ),
              ]);

              setTimeout(() => {
                navigation.replace('LoginStack', {
                  screen: 'IdentifyYourSelf',
                });
                setIsLocationLoading(false);
              }, 0);
            }
          },
          error => {
            reject(error);
            setTimeout(() => {
              setIsLocationLoading(false);
            }, 0);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      });
    } catch (error: any) {
      console.error(error, error?.message);
      showToast(
        'Something went wrong',
        String(
          error?.message ??
            'Unable to find your location please try gain letter',
        ),
        'error',
      );
      setTimeout(() => {
        setIsLocationLoading(false);
      }, 0);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.Secondary} barStyle={'dark-content'} />
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
            setIsLocationLoading(true);
            onNextPress();
          }}
          isLoading={IsLocationLoading}
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
