import {useNavigation} from '@react-navigation/native';
import React, {FC, useState} from 'react';
import {Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import CommonImages from '../../../Common/CommonImages';
import {COLORS, FONTS} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import {updateField} from '../../../Redux/Action/userActions';
import UserService from '../../../Services/AuthService';
import {transformUserDataForApi} from '../../../Services/dataTransformService';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {useCustomToast} from '../../../Utils/toastUtils';
import CreateProfileStyles from './styles';
import {useLocationPermission} from '../../../Hooks/useLocationPermission';

const LocationPermission: FC = () => {
  const navigation = useNavigation();
  const {showToast} = useCustomToast();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state?.user);
  const {requestLocationPermission} = useLocationPermission();

  const [IsLocationLoading, setIsLocationLoading] = useState(false);

  const onNextPress = async () => {
    navigateToNextScreen();
  };

  const navigateToNextScreen = async () => {
    setIsLocationLoading(true);
    try {
      requestLocationPermission()
        .then(isLocationGranted => {
          if (isLocationGranted) {
            return new Promise((resolve, reject) => {
              Geolocation.getCurrentPosition(
                async position => {
                  const {coords} = position;
                  if (coords) {
                    await Promise.all([
                      dispatch(
                        updateField(
                          LocalStorageFields.longitude,
                          coords.longitude,
                        ),
                      ),
                      dispatch(
                        updateField(
                          LocalStorageFields.latitude,
                          coords.latitude,
                        ),
                      ),
                    ]);

                    setTimeout(() => {
                      handleNavigation();
                    }, 0);
                  }
                },
                error => {
                  reject(error);
                  setTimeout(() => {
                    setIsLocationLoading(false);
                  }, 0);
                },
                {enableHighAccuracy: true, timeout: 15000, maximumAge: 100},
              );
            });
          } else {
            setIsLocationLoading(false);
          }
        })
        .catch(error => {
          console.log('Location Permisstion Error', error);
          setIsLocationLoading(false);
        });
    } catch (error: any) {
      console.error(error, error?.message);
      showToast(
        'Something went wrong',
        String(
          error?.message ||
            'Unable to find your location please try gain letter',
        ),
        'error',
      );
      setTimeout(() => {
        setIsLocationLoading(false);
      }, 0);
    }
  };

  const handleNavigation = async () => {
    const userDataForApi = transformUserDataForApi(userData);
    const userDataWithValidation = {
      ...userDataForApi,
      validation: true,
    };
    const APIResponse = await UserService.UserRegister(userDataWithValidation);

    if (APIResponse?.data?.token) {
      await dispatch(
        updateField(LocalStorageFields.Token, APIResponse.data?.token),
      );
      setTimeout(() => {
        navigation.replace('BottomTab');
      }, 0);
    } else {
      navigation.replace('LoginStack');
    }
    setIsLocationLoading(false);
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
