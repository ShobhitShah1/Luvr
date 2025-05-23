import FastImage from '@d11/react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import React, { memo, useState } from 'react';
import type { FC } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import CommonIcons from '../../../../Common/CommonIcons';
import CommonImages from '../../../../Common/CommonImages';
import TextString from '../../../../Common/TextString';
import { COLORS, FONTS } from '../../../../Common/Theme';
import ApiConfig from '../../../../Config/ApiConfig';
import { useTheme } from '../../../../Contexts/ThemeContext';
import useCalculateAge from '../../../../Hooks/useCalculateAge';
import { useCustomNavigation } from '../../../../Hooks/useCustomNavigation';
import { onSwipeRight } from '../../../../Redux/Action/actions';
import { store } from '../../../../Redux/Store/store';
import UserService from '../../../../Services/AuthService';
import type { ProfileType } from '../../../../Types/ProfileType';
import { useCustomToast } from '../../../../Utils/toastUtils';

interface RenderLookingViewProps {
  item: ProfileType;
  index: number;
  isRecentlyActive?: boolean;
  FetchAPIData: () => void;
  setIsAPILoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentCardIndex: React.Dispatch<React.SetStateAction<number>>;
  setItsMatchModalView: React.Dispatch<React.SetStateAction<boolean>>;
}

const CategoryRenderCard: FC<RenderLookingViewProps> = ({
  item,
  index,
  isRecentlyActive,
  FetchAPIData,
  setIsAPILoading,
  setCurrentCardIndex,
  setItsMatchModalView,
}) => {
  const { colors } = useTheme();
  const { showToast } = useCustomToast();

  const navigation = useCustomNavigation();

  const [IsImageLoading, setIsImageLoading] = useState(false);

  const onPressCard = () => {
    navigation.navigate('ExploreCardDetail', { props: item });
  };

  const imagePath =
    item?.recent_pik && item?.recent_pik?.length !== 0
      ? { uri: ApiConfig.IMAGE_BASE_URL + item?.recent_pik[0] }
      : { uri: ApiConfig.PLACEHOLDER_IMAGE };

  const Age = useCalculateAge(item.birthdate);

  const onLikePress = async () => {
    setIsAPILoading(true);
    setCurrentCardIndex(index);

    if ((await NetInfo.fetch()).isConnected) {
      showToast(
        TextString.error.toUpperCase(),
        TextString.PleaseCheckYourInternetConnection,
        TextString.error,
      );

      return;
    }

    try {
      const userDataForApi = { eventName: 'like', like_to: item._id };

      const APIResponse = await UserService.UserRegister(userDataForApi);

      if (APIResponse?.code === 200) {
        if (APIResponse.data?.status === 'match') {
          setItsMatchModalView(true);
        }

        store.dispatch(onSwipeRight(String(item._id)));
        FetchAPIData();
      } else {
        showToast(
          TextString.error.toUpperCase(),
          APIResponse?.message || 'Please try again letter',
          TextString.error,
        );

        setItsMatchModalView(false);
        setIsAPILoading(false);
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), TextString.error);
      setItsMatchModalView(false);
      setIsAPILoading(false);
    }
  };

  return (
    <Pressable onPress={onPressCard} style={styles.container}>
      {IsImageLoading && (
        <View style={styles.ImageLoaderView}>
          <ActivityIndicator size={30} color={colors.Primary} style={styles.Loader} />
        </View>
      )}
      <FastImage
        source={imagePath}
        onLoadStart={() => setIsImageLoading(true)}
        onLoad={() => setIsImageLoading(false)}
        resizeMode="cover"
        style={styles.imageView}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        >
          <View style={styles.DetailContainerView}>
            <View style={styles.UserInfoView}>
              <Text numberOfLines={2} style={styles.TitleText}>
                {item?.full_name || 'User'}, {Age || 0}
              </Text>
              {isRecentlyActive ? (
                <View style={styles.LocationView}>
                  <View style={styles.IsActiveIndicator} />
                  <Text numberOfLines={1} style={styles.LocationText}>
                    Recently active
                  </Text>
                </View>
              ) : (
                item?.city && (
                  <View style={styles.LocationView}>
                    <Image style={styles.LocationIcon} source={CommonIcons.Location} />
                    <Text numberOfLines={1} style={styles.LocationText}>
                      {item?.city || 'Location'}
                    </Text>
                  </View>
                )
              )}
            </View>

            <Pressable
              style={styles.LikeCardView}
              onPress={() => {
                onLikePress();
              }}
            >
              <Image source={CommonImages.LikeCard} style={styles.LikeCard} />
            </Pressable>
          </View>
        </LinearGradient>
      </FastImage>
    </Pressable>
  );
};

export default memo(CategoryRenderCard);

const styles = StyleSheet.create({
  DetailContainerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1.5%'),
    width: '100%',
  },
  ImageLoaderView: {
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 999,
  },
  IsActiveIndicator: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 255, 71, 1)',
    borderColor: COLORS.White,
    borderRadius: 500,
    borderWidth: 1.5,
    height: 14,
    justifyContent: 'center',
    width: 14,
  },
  LikeCard: {
    alignSelf: 'flex-start',
    height: hp('4.6%'),
    width: hp('4.6%'),
  },
  LikeCardView: {
    // right: 1,
    width: '28%',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  Loader: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  LocationIcon: {
    height: hp('2%'),
    width: hp('2%'),
  },
  LocationText: {
    color: COLORS.White,
    fontFamily: FONTS.Medium,
    fontSize: hp('1.5%'),
    marginLeft: hp('0.5%'),
    width: '80%',
  },
  LocationView: {
    width: '85%',
    overflow: 'hidden',
    // alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: hp('2%'),
  },
  TitleText: {
    color: COLORS.White,
    fontFamily: FONTS.Bold,
    fontSize: hp('2.3%'),
    lineHeight: hp('3.5%'),
    marginBottom: hp('0.5%'),
    marginHorizontal: hp('2%'),
  },
  UserInfoView: {
    justifyContent: 'center',
    overflow: 'hidden',
    width: '72%',
  },
  container: {
    borderRadius: hp('3%'),
    height: hp('25%'),
    marginBottom: '2%',
    marginVertical: '1%',
    overflow: 'hidden',
    width: '48%',
  },
  gradient: {
    flex: 0.5,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    alignSelf: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  imageView: {
    height: '100%',
    justifyContent: 'flex-end',
    width: '100%',
  },
});
