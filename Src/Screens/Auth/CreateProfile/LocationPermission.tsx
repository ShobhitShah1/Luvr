import {useNavigation} from '@react-navigation/native';
import React, {FC, memo, useState} from 'react';
import {Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import CommonImages from '../../../Common/CommonImages';
import TextString from '../../../Common/TextString';
import {COLORS, FONTS} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import {useLocationPermission} from '../../../Hooks/useLocationPermission';
import {updateField} from '../../../Redux/Action/userActions';
import UserService from '../../../Services/AuthService';
import {transformUserDataForApi} from '../../../Services/dataTransformService';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {useCustomToast} from '../../../Utils/toastUtils';
import CreateProfileStyles from './styles';

const LocationPermission: FC = () => {
  const navigation = useNavigation<any>();
  const {showToast} = useCustomToast();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state?.user);
  const {requestLocationPermission} = useLocationPermission();

  const [IsLocationLoading, setIsLocationLoading] = useState(false);

  const navigateToNextScreen = async () => {
    setIsLocationLoading(true);

    try {
      await requestLocationPermission()
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

                    await handleNavigation();
                  }
                },
                error => {
                  reject(error);
                },
                {enableHighAccuracy: true, timeout: 15000, maximumAge: 100},
              );
            });
          }
        })
        .catch(error => {
          showToast(
            TextString.error.toUpperCase(),
            String(error?.message || error),
            'error',
          );
        });
    } catch (error: any) {
      showToast(
        TextString.error.toUpperCase(),
        String(
          error?.message ||
            'Unable to find your location please try gain letter',
        ),
        'error',
      );
    } finally {
      setIsLocationLoading(false);
    }
  };

  const handleNavigation = async () => {
    try {
      const userDataForApi = transformUserDataForApi(userData);
      const userDataWithValidation = {
        ...userDataForApi,
        validation: true,
      };

      const APIResponse = await UserService.UserRegister(
        userDataWithValidation,
      );

      if (APIResponse.data?.token) {
        dispatch(
          updateField(LocalStorageFields.Token, APIResponse.data?.token),
        );
        navigation.replace('BottomTab');
      } else {
        navigation.replace('LoginStack');
      }
    } catch (error: any) {
      showToast(
        TextString.error.toUpperCase(),
        String(error?.message || error),
        TextString.error,
      );
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
          Title={'Continue'}
          Disabled={false}
          Navigation={() => {
            setIsLocationLoading(true);
            setTimeout(() => navigateToNextScreen(), 0);
          }}
          isLoading={IsLocationLoading}
        />
      </View>
    </View>
  );
};

export default memo(LocationPermission);

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
