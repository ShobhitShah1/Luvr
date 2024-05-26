import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Skeleton} from 'moti/skeleton';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import CommonIcons from '../../Common/CommonIcons';
import {ActiveOpacity, COLORS, FONTS, GROUP_FONT} from '../../Common/Theme';
import ApiConfig from '../../Config/ApiConfig';
import {DummyImage} from '../../Config/Setting';
import useCalculateAge from '../../Hooks/useCalculateAge';
import UserService from '../../Services/AuthService';
import {ProfileType} from '../../Types/ProfileType';
import {useCustomToast} from '../../Utils/toastUtils';
import BottomTabHeader from '../Home/Components/BottomTabHeader';
import calculateDataPercentage from './Components/calculateDataPercentage';
import TextString from '../../Common/TextString';
import NetInfo from '@react-native-community/netinfo';

const ProfileScreen = () => {
  const userData = useSelector((state: any) => state?.user);
  const {showToast} = useCustomToast();
  const Age = useCalculateAge(userData?.birthdate);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [IsImageLoading, setIsImageLoading] = useState(false);
  const [IsAPILoading, setIsAPILoading] = useState(true);
  const [ProfileData, setProfileData] = useState<ProfileType | undefined>(
    undefined,
  );
  const [percentage, setPercentage] = useState(0);
  const [ErrorFetchingData, setErrorFetchingData] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const InInternetConnected = (await NetInfo.fetch()).isConnected;

    if (!InInternetConnected) {
      showToast(
        TextString.error.toUpperCase(),
        TextString.PleaseCheckYourInternetConnection,
        TextString.error,
      );
      setIsAPILoading(false);
      setRefreshing(false);
      setErrorFetchingData(false);
      return;
    }

    setIsAPILoading(true);
    setErrorFetchingData(false);

    try {
      const userDataForApi = {
        eventName: 'get_profile',
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        setProfileData(APIResponse.data);
        const ProfilePercentage = calculateDataPercentage(APIResponse.data);
        setPercentage(ProfilePercentage);
      } else {
        showToast(
          'Error',
          APIResponse?.error ||
            APIResponse?.message ||
            'Please try again later',
          'error',
        );
        setProfileData({} as ProfileType);
      }
    } catch (error) {
      showToast(
        'Error',
        String(error) || 'Something went wrong. Please try again later.',
        'error',
      );
    } finally {
      setIsAPILoading(false);
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <BottomTabHeader hideSettingAndNotification={true} showSetting={true} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressBackgroundColor={COLORS.White}
            colors={[COLORS.Primary]}
          />
        }
        style={styles.ProfileViewContainer}>
        <View style={styles.ContentView}>
          <View style={styles.ProfileImageView}>
            <AnimatedCircularProgress
              size={220}
              width={5}
              fill={percentage || 0}
              tintColor={COLORS.Primary}
              fillLineCap="round"
              backgroundColor={'transparent'}>
              {() => (
                <View style={styles.ImageContainerView}>
                  <Skeleton
                    show={IsAPILoading || IsImageLoading}
                    colorMode="light"
                    colors={COLORS.LoaderGradient}>
                    {ProfileData?.recent_pik &&
                    ProfileData?.recent_pik?.length !== 0 ? (
                      <FastImage
                        style={styles.ProfileImage}
                        source={{
                          uri:
                            ApiConfig.IMAGE_BASE_URL +
                            ProfileData?.recent_pik[0],
                          priority: FastImage.priority.high,
                        }}
                        fallback={Platform.OS === 'android'}
                      />
                    ) : (
                      <View style={styles.LottieViewStyle}>
                        {!IsAPILoading && (
                          <FastImage
                            onLoadStart={() => setIsImageLoading(true)}
                            onLoad={() => setIsImageLoading(false)}
                            onLoadEnd={() => setIsImageLoading(false)}
                            style={styles.ProfileImage}
                            source={{
                              uri: DummyImage,
                              priority: FastImage.priority.high,
                            }}
                            fallback={Platform.OS === 'android'}
                          />
                        )}
                      </View>
                    )}
                  </Skeleton>
                </View>
              )}
            </AnimatedCircularProgress>
          </View>

          <View style={styles.UserNameAndLocationView}>
            <View style={styles.NameAndBadgeContainer}>
              <Skeleton
                show={IsAPILoading}
                width={300}
                colorMode="light"
                colors={COLORS.LoaderGradient}>
                <View style={styles.NameAndBadgeView}>
                  <Text style={styles.UserNameText}>
                    {!IsAPILoading &&
                      (ProfileData?.full_name || userData?.full_name) &&
                      (ProfileData?.full_name || userData?.full_name) +
                        (Age ? `, ${Age}` : '')}
                  </Text>
                  {!IsAPILoading && (
                    <Image
                      source={CommonIcons.Verification_Icon}
                      style={styles.VerifyIcon}
                    />
                  )}
                </View>
              </Skeleton>
            </View>
            <View style={styles.NameAndBadgeContainer}>
              <Skeleton
                show={IsAPILoading}
                colorMode="light"
                width={250}
                colors={COLORS.LoaderGradient}>
                <Text style={styles.UserCityText}>
                  {IsAPILoading ? '' : ProfileData?.city || ''}
                </Text>
              </Skeleton>
            </View>
          </View>

          <View style={styles.TotalPercentageCompletedView}>
            <View style={styles.PercentageView}>
              <View style={styles.PercentageCountView}>
                <Skeleton
                  show={IsAPILoading}
                  colorMode="light"
                  height={57}
                  colors={COLORS.LoaderGradient}>
                  <View style={styles.PercentageTextFlexView}>
                    <Text style={styles.PercentageCountText}>{`${
                      IsAPILoading ? '' : `${Math.floor(percentage)}%`
                    }`}</Text>
                  </View>
                </Skeleton>
              </View>
              <View style={styles.CompleteProfileTextView}>
                <Text numberOfLines={2} style={styles.CompleteProfileText}>
                  Complete your profile to stand out
                </Text>
              </View>
            </View>
            <View style={styles.EditProfileView}>
              <TouchableOpacity
                activeOpacity={ActiveOpacity}
                onPress={() => navigation.navigate('EditProfile')}
                style={styles.EditButtonView}>
                <Text style={styles.EditButtonText}>Edit profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  LoaderContainer: {
    justifyContent: 'center',
  },
  NameAndBadgeContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 5,
  },
  ProfileImage: {
    width: '101%',
    height: '101%',
    borderRadius: 100,
    alignSelf: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  ImageContainerView: {
    width: 210,
    height: 210,
    borderWidth: 5,
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: Dimensions.get('window').width / 2,
    borderColor: COLORS.White,
  },
  ProfileViewContainer: {
    flex: 1,
  },
  ContentView: {
    marginTop: 100,
  },
  ProfileImageView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  UserNameAndLocationView: {
    marginTop: 21,
    marginVertical: 4,
    justifyContent: 'center',
  },
  NameAndBadgeView: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  UserNameText: {
    ...GROUP_FONT.h1,
    color: COLORS.Black,
    textAlign: 'center',
    maxWidth: '85%',
    paddingTop: 6,
  },
  UserCityText: {
    marginTop: 3,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: FONTS.Medium,
    color: 'rgba(108, 108, 108, 1)',
  },
  VerifyIcon: {
    width: 22,
    height: 22,
    marginLeft: 8,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  TotalPercentageCompletedView: {
    flex: 1,
    width: '85%',
    height: 120,
    marginTop: 30,
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.Primary,
  },
  PercentageView: {
    zIndex: 999,
    width: '100%',
    height: '60%',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    alignSelf: 'center',
    alignContent: 'center',
    // justifyContent: 'center'
  },
  PercentageCountView: {
    width: 57,
    height: 57,
    overflow: 'hidden',
    borderRadius: 100,
    justifyContent: 'center',
    backgroundColor: COLORS.White,
  },
  PercentageTextFlexView: {
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  PercentageCountText: {
    fontSize: 16,
    fontFamily: FONTS.Bold,
    textAlign: 'center',
    color: COLORS.Primary,
    // justifyContent: 'center',
    // alignSelf: 'center',
  },
  CompleteProfileTextView: {
    width: '70%',
    marginHorizontal: 10,
  },
  CompleteProfileText: {
    fontSize: 15,
    fontFamily: FONTS.Bold,
    color: COLORS.White,
  },
  EditProfileView: {
    zIndex: 999,
    width: '100%',
    height: '40%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  EditButtonView: {
    width: 130,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: COLORS.White,
  },
  EditButtonText: {
    ...GROUP_FONT.h3,
    textAlign: 'center',
    color: COLORS.Primary,
  },
  ImageLoaderView: {
    top: '37%',
    left: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageLoader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  LottieViewStyle: {
    // width: '100%',
    // height: '100%',
    // width: 10,
    // height: 10,
    aspectRatio: 1 / 17,
    backgroundColor: COLORS.Primary,
  },
  ErrorViewContainer: {
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  ErrorViewTitleText: {
    ...GROUP_FONT.h2,
    color: COLORS.Primary,
    textAlign: 'center',
  },
  ErrorRefButton: {
    top: 10,
    height: 45,
    width: 250,
    backgroundColor: COLORS.Primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  ErrorRefText: {
    ...GROUP_FONT.h3,
    textAlign: 'center',
    color: COLORS.White,
  },
  ThrowPCGif: {
    width: 300,
    height: 180,
    marginVertical: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
