/* eslint-disable react-hooks/exhaustive-deps */
import NetInfo from '@react-native-community/netinfo';
import { Skeleton } from 'moti/skeleton';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import CommonIcons from '../../Common/CommonIcons';
import GradientView from '../../Common/GradientView';
import TextString from '../../Common/TextString';
import { COLORS, FONTS, GROUP_FONT } from '../../Common/Theme';
import { GradientBorderView } from '../../Components/GradientBorder';
import ApiConfig from '../../Config/ApiConfig';
import { DummyImage } from '../../Config/Setting';
import { useTheme } from '../../Contexts/ThemeContext';
import useCalculateAge from '../../Hooks/useCalculateAge';
import { useCustomNavigation } from '../../Hooks/useCustomNavigation';
import UserService from '../../Services/AuthService';
import { ProfileType } from '../../Types/ProfileType';
import { useCustomToast } from '../../Utils/toastUtils';
import BottomTabHeader from '../Home/Components/BottomTabHeader';
import calculateDataPercentage from './Components/calculateDataPercentage';

const ProfileScreen = () => {
  const { colors, isDark } = useTheme();
  const { showToast } = useCustomToast();
  const userData = useSelector((state: any) => state?.user);
  const Age = useCalculateAge(userData?.birthdate);
  const navigation = useCustomNavigation();

  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isLoading, setIsAPILoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileType>(userData?.userData);
  const [percentage, setPercentage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!userData?.userData?.full_name || !userData?.full_name) {
      setIsAPILoading(true);
    }
    fetchProfileData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const InInternetConnected = (await NetInfo.fetch()).isConnected;

    if (!InInternetConnected) {
      setIsAPILoading(false);
      setRefreshing(false);
      throw new Error(TextString.PleaseCheckYourInternetConnection);
    }

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
        setProfileData({} as ProfileType);
        throw new Error(APIResponse?.error || APIResponse?.message);
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), 'error');
    } finally {
      setIsAPILoading(false);
      setRefreshing(false);
    }
  };

  return (
    <GradientView>
      <View style={styles.container}>
        <BottomTabHeader hideSettingAndNotification={true} hideDonation={true} showTitle={true} showSetting={true} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressBackgroundColor={colors.White}
              colors={[colors.Primary]}
            />
          }
          style={styles.ProfileViewContainer}
        >
          <View style={styles.ContentView}>
            <View style={styles.ProfileImageView}>
              <AnimatedCircularProgress
                width={5}
                size={220}
                fillLineCap="round"
                fill={percentage || 1}
                tintColor={colors.Primary}
                backgroundColor={colors.White}
              >
                {() => (
                  <View style={styles.ImageContainerView}>
                    <Skeleton show={isLoading || isImageLoading} colorMode="light" colors={colors.LoaderGradient}>
                      {profileData?.recent_pik && profileData?.recent_pik?.length !== 0 ? (
                        <Image
                          style={styles.ProfileImage}
                          source={{ uri: ApiConfig.IMAGE_BASE_URL + profileData?.recent_pik[0] }}
                        />
                      ) : (
                        <View style={styles.LottieViewStyle}>
                          {!isLoading && (
                            <Image
                              onLoadStart={() => setIsImageLoading(true)}
                              onLoad={() => setIsImageLoading(false)}
                              onLoadEnd={() => setIsImageLoading(false)}
                              style={styles.ProfileImage}
                              source={{ uri: DummyImage }}
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
                <Skeleton show={isLoading} width={300} colorMode="light" colors={colors.LoaderGradient}>
                  <View style={styles.NameAndBadgeView}>
                    <Text style={[styles.UserNameText, { color: colors.TextColor }]}>
                      {!isLoading &&
                        (profileData?.full_name || userData?.full_name) &&
                        (profileData?.full_name || userData?.full_name) + (Age ? `, ${Age}` : '')}
                    </Text>
                    {!isLoading && <Image source={CommonIcons.Verification_Icon} style={styles.VerifyIcon} />}
                  </View>
                </Skeleton>
              </View>
              <View style={styles.NameAndBadgeContainer}>
                <Skeleton show={isLoading} colorMode="light" width={250} colors={colors.LoaderGradient}>
                  <Text style={[styles.UserCityText, { color: colors.TextColor }]}>
                    {isLoading ? '' : profileData?.city || ''}
                  </Text>
                </Skeleton>
              </View>
            </View>

            <LinearGradient
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={isDark ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)'] : [colors.Primary, colors.Primary]}
              style={[styles.TotalPercentageCompletedView, { borderWidth: 0 }]}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.PercentageView}>
                  <GradientBorderView
                    style={[styles.PercentageCountView, !isDark && { backgroundColor: colors.White }]}
                  >
                    <Skeleton show={isLoading} colorMode="light" height={57} colors={colors.LoaderGradient}>
                      <View style={styles.PercentageTextFlexView}>
                        <Text style={[styles.PercentageCountText, { color: colors.TextColor }]}>{`${
                          isLoading ? '' : `${Math.floor(percentage)}%`
                        }`}</Text>
                      </View>
                    </Skeleton>
                  </GradientBorderView>
                  <View style={styles.CompleteProfileTextView}>
                    <Text numberOfLines={2} style={styles.CompleteProfileText}>
                      Complete your profile to stand out
                    </Text>
                  </View>
                </View>
                <View style={styles.EditProfileView}>
                  <LinearGradient
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={isDark ? colors.ButtonGradient : [colors.White, colors.White]}
                    style={styles.EditButtonView}
                  >
                    <Pressable
                      onPress={() => navigation.navigate('EditProfile')}
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <Text style={[styles.EditButtonText, { color: colors.TextColor }]}>Edit profile</Text>
                    </Pressable>
                  </LinearGradient>
                </View>
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
    </GradientView>
  );
};

export default memo(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: Dimensions.get('window').width / 2,
  },
  ProfileViewContainer: {
    flex: 1,
  },
  ContentView: {
    marginTop: 95,
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
  },
  PercentageCountView: {
    width: 57,
    height: 57,
    borderWidth: 2,
    overflow: 'hidden',
    borderRadius: 100,
    justifyContent: 'center',
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
    position: 'absolute',
    bottom: 3,
    right: 0,
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
