import { Skeleton } from 'moti/skeleton';
import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import LinearGradient from 'react-native-linear-gradient';

import CommonIcons from '../../Common/CommonIcons';
import GradientView from '../../Common/GradientView';
import { COLORS, FONTS, GROUP_FONT } from '../../Common/Theme';
import { GradientBorderView } from '../../Components/GradientBorder';
import ApiConfig from '../../Config/ApiConfig';
import { DummyImage } from '../../Config/Setting';
import { useTheme } from '../../Contexts/ThemeContext';
import { useUserData } from '../../Contexts/UserDataContext';
import useCalculateAge from '../../Hooks/useCalculateAge';
import { useCustomNavigation } from '../../Hooks/useCustomNavigation';
import { debouncedGetProfileData } from '../../Utils/profileUtils';
import BottomTabHeader from '../Home/Components/BottomTabHeader';

import calculateDataPercentage from './Components/calculate-data-percentage';

function ProfileScreen() {
  const { userData } = useUserData();
  const { colors, isDark } = useTheme();
  const navigation = useCustomNavigation();

  const userAge = useCalculateAge(userData?.birthdate);

  const [isImageLoading, setIsImageLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setPercentage(calculateDataPercentage(userData));
  }, [userData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await debouncedGetProfileData(0);
    setPercentage(calculateDataPercentage(userData));
    setRefreshing(false);
  }, []);

  return (
    <GradientView>
      <View style={styles.container}>
        <BottomTabHeader
          isShare={true}
          hideSettingAndNotification={true}
          hideDonation={true}
          showTitle={true}
          showSetting={true}
        />
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
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
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
                    <Skeleton
                      show={isImageLoading}
                      colorMode="light"
                      colors={colors.LoaderGradient}
                    >
                      {userData?.recent_pik && userData?.recent_pik?.length !== 0 ? (
                        <Image
                          style={styles.ProfileImage}
                          source={{ uri: ApiConfig.IMAGE_BASE_URL + userData?.recent_pik[0] }}
                        />
                      ) : (
                        <View style={styles.LottieViewStyle}>
                          <Image
                            onLoadStart={() => setIsImageLoading(true)}
                            onLoad={() => setIsImageLoading(false)}
                            onLoadEnd={() => setIsImageLoading(false)}
                            style={styles.ProfileImage}
                            source={{ uri: DummyImage }}
                          />
                        </View>
                      )}
                    </Skeleton>
                  </View>
                )}
              </AnimatedCircularProgress>
            </View>

            <View style={styles.UserNameAndLocationView}>
              <View style={styles.NameAndBadgeContainer}>
                <Skeleton show={false} width={300} colorMode="light" colors={colors.LoaderGradient}>
                  <View style={styles.NameAndBadgeView}>
                    <Text style={[styles.UserNameText, { color: colors.TextColor }]}>
                      {userData?.full_name && userData?.full_name + (userAge ? `, ${userAge}` : '')}
                    </Text>
                    <Image source={CommonIcons.Verification_Icon} style={styles.VerifyIcon} />
                  </View>
                </Skeleton>
              </View>
              <View style={styles.NameAndBadgeContainer}>
                <Skeleton show={false} colorMode="light" width={250} colors={colors.LoaderGradient}>
                  <Text style={[styles.UserCityText, { color: colors.TextColor }]}>
                    {false ? '' : userData?.city || ''}
                  </Text>
                </Skeleton>
              </View>
            </View>

            <LinearGradient
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={
                isDark
                  ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']
                  : [colors.Primary, colors.Primary]
              }
              style={[styles.TotalPercentageCompletedView, { borderWidth: 0 }]}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.PercentageView}>
                  <GradientBorderView
                    style={[
                      styles.PercentageCountView,
                      !isDark && { backgroundColor: colors.White },
                    ]}
                  >
                    <Skeleton
                      show={false}
                      colorMode="light"
                      height={57}
                      colors={colors.LoaderGradient}
                    >
                      <View style={styles.PercentageTextFlexView}>
                        <Text
                          style={[styles.PercentageCountText, { color: colors.TextColor }]}
                        >{`${`${Math.floor(percentage)}%`}`}</Text>
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
                      <Text style={[styles.EditButtonText, { color: colors.TextColor }]}>
                        Edit profile
                      </Text>
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
}

export default memo(ProfileScreen);

const styles = StyleSheet.create({
  CompleteProfileText: {
    color: COLORS.White,
    fontFamily: FONTS.Bold,
    fontSize: 15,
  },
  CompleteProfileTextView: {
    marginHorizontal: 10,
    width: '70%',
  },
  ContentView: {
    marginTop: Platform.select({ ios: 60, android: 95 }),
  },
  EditButtonText: {
    ...GROUP_FONT.h3,
    color: COLORS.Primary,
    textAlign: 'center',
  },
  EditButtonView: {
    backgroundColor: COLORS.White,
    borderRadius: 20,
    height: 35,
    justifyContent: 'center',
    width: 130,
  },
  EditProfileView: {
    alignItems: 'flex-end',
    bottom: 3,
    height: '40%',
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 0,
    width: '100%',
    zIndex: 999,
  },
  ImageContainerView: {
    borderRadius: Dimensions.get('window').width / 2,
    height: 210,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 210,
  },
  LottieViewStyle: {
    // width: '100%',
    // height: '100%',
    // width: 10,
    // height: 10,
    aspectRatio: 1 / 17,
    backgroundColor: COLORS.Primary,
  },
  NameAndBadgeContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 5,
  },
  NameAndBadgeView: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  PercentageCountText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    textAlign: 'center',
  },
  PercentageCountView: {
    borderRadius: 100,
    borderWidth: 2,
    height: 57,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 57,
  },
  PercentageTextFlexView: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  PercentageView: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    height: '60%',
    overflow: 'hidden',
    width: '100%',
    zIndex: 999,
  },
  ProfileImage: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 100,
    height: '101%',
    justifyContent: 'center',
    resizeMode: 'contain',
    width: '101%',
  },
  ProfileImageView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ProfileViewContainer: {
    flex: 1,
  },
  TotalPercentageCompletedView: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    flex: 1,
    height: 120,
    marginTop: 30,
    padding: 10,
    width: '85%',
  },
  UserNameAndLocationView: {
    justifyContent: 'center',
    marginTop: 21,
    marginVertical: 4,
  },
  UserNameText: {
    ...GROUP_FONT.h1,
    color: COLORS.Black,
    maxWidth: '85%',
    paddingTop: 6,
    textAlign: 'center',
  },
  VerifyIcon: {
    alignItems: 'flex-end',
    height: 22,
    justifyContent: 'center',
    marginLeft: 8,
    width: 22,
  },
  container: {
    flex: 1,
  },
});
