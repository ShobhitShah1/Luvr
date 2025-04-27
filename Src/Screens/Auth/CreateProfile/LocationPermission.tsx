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
  const { requestLocationPermission } = useLocationPermission();

  const [IsLocationLoading, setIsLocationLoading] = useState(false);

  const navigateToNextScreen = async () => {
    setIsLocationLoading(true);

    try {
      await requestLocationPermission()
        .then((isLocationGranted) => {
          if (isLocationGranted) {
            return new Promise((resolve, reject) => {
              Geolocation.getCurrentPosition(
                async (position) => {
                  const { coords } = position;
                  if (coords) {
                    await Promise.all([
                      dispatch(updateField(LocalStorageFields.longitude, coords.longitude)),
                      dispatch(updateField(LocalStorageFields.latitude, coords.latitude)),
                    ]);

                    await handleNavigation();
                  }
                },
                (error) => {
                  reject(error);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 100 }
              );
            });
          }
        })
        .catch((error) => {
          showToast(TextString.error.toUpperCase(), String(error?.message || error), 'error');
        });
    } catch (error: any) {
      showToast(
        TextString.error.toUpperCase(),
        String(error?.message || 'Unable to find your location please try gain letter'),
        'error'
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

      const APIResponse = await UserService.UserRegister(userDataWithValidation);

      if (APIResponse.data?.token) {
        dispatch(updateField(LocalStorageFields.Token, APIResponse.data?.token));
        navigation.replace('BottomTab');
      } else {
        navigation.replace('LoginStack');
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), TextString.error);
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
            Set your location to see nearby people. You won’t be able to match with people otherwise.
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
