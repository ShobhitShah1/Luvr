import React, { FC, memo, useState } from 'react';
import { Image, Text, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import CommonIcons from '../../../Common/CommonIcons';
import GradientView from '../../../Common/GradientView';
import TextString from '../../../Common/TextString';
import { FONTS } from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import { useTheme } from '../../../Contexts/ThemeContext';
import createThemedStyles from '../../../Hooks/createThemedStyles';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import { useLocationPermission } from '../../../Hooks/useLocationPermission';
import { useThemedStyles } from '../../../Hooks/useThemedStyles';
import { updateField } from '../../../Redux/Action/actions';
import UserService from '../../../Services/AuthService';
import { transformUserDataForApi } from '../../../Services/dataTransformService';
import { LocalStorageFields } from '../../../Types/LocalStorageFields';
import { useCustomToast } from '../../../Utils/toastUtils';
import CreateProfileStyles from './styles';

const LocationPermission: FC = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const style = useThemedStyles(styles);

  const navigation = useCustomNavigation();
  const { showToast } = useCustomToast();

  const userData = useSelector((state: any) => state?.user);
  const { requestLocationPermission, showBlockedAlert } = useLocationPermission();

  const [IsLocationLoading, setIsLocationLoading] = useState(false);

  const navigateToNextScreen = async () => {
    setIsLocationLoading(true);

    try {
      const isLocationGranted = await requestLocationPermission(userData?.isVerified);

      if (isLocationGranted) {
        await new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { coords } = position;
                if (coords) {
                  await Promise.all([
                    dispatch(updateField(LocalStorageFields.longitude, coords.longitude)),
                    dispatch(updateField(LocalStorageFields.latitude, coords.latitude)),
                  ]);

                  // Check if user is logged in before proceeding
                  if (userData?.isVerified) {
                    await handleNavigation();
                  } else {
                    // For non-logged in users, just store location and proceed
                    navigation.replace('BottomTab', {});
                  }
                  resolve(true);
                }
              } catch (error) {
                reject(error);
              }
            },
            (error) => {
              reject(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 100 }
          );
        });
      } else {
        // If permission is denied but not blocked, show toast and stop loading
        showToast('Location Permission', 'Please allow location access to continue using the app', 'warning');
        setIsLocationLoading(false);
      }
    } catch (error: any) {
      showToast(
        TextString.error.toUpperCase(),
        String(error?.message || 'Unable to find your location please try again later'),
        'error'
      );
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

      const APIResponse = await UserService.UserRegister(userDataWithValidation);

      if (APIResponse.data?.token) {
        dispatch(updateField(LocalStorageFields.Token, APIResponse.data?.token));
        navigation.replace('BottomTab', {});
      } else {
        navigation.replace('LoginStack', {});
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), TextString.error);
      setIsLocationLoading(false);
    }
  };

  return (
    <GradientView>
      <View style={style.container}>
        <View style={style.MiddleImageView}>
          <Image
            source={isDark ? CommonIcons.ic_dark_location : CommonIcons.ic_light_location}
            style={style.LocationImage}
          />
        </View>

        <View style={style.MiddleTextView}>
          <Text style={[style.TitleText, { color: colors.TitleText }]}>Allow your location</Text>
          <Text style={[style.DescriptionText, { color: colors.TextColor }]}>
            {userData?.isVerified
              ? "Location access is required to use the app. You won't be able to match with people otherwise."
              : 'Set your location to see nearby people. You can change this later in settings.'}
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
    </GradientView>
  );
};

export default memo(LocationPermission);

const styles = createThemedStyles((colors) => ({
  container: {
    flex: 1,
    paddingHorizontal: hp('1.3%'),
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
    color: colors.TitleText,
  },
  DescriptionText: {
    width: '85%',
    top: hp('1%'),
    fontFamily: FONTS.Regular,
    color: colors.Black,
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
}));
