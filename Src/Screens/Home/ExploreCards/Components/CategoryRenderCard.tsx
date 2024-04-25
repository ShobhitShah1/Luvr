import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';
import CommonImages from '../../../../Common/CommonImages';
import {ActiveOpacity, COLORS, FONTS} from '../../../../Common/Theme';
import ApiConfig from '../../../../Config/ApiConfig';
import useCalculateAge from '../../../../Hooks/useCalculateAge';
import {onSwipeRight} from '../../../../Redux/Action/userActions';
import {store} from '../../../../Redux/Store/store';
import UserService from '../../../../Services/AuthService';
import {ProfileType} from '../../../../Types/ProfileType';
import {useCustomToast} from '../../../../Utils/toastUtils';
import NetInfo from '@react-native-community/netinfo';
import TextString from '../../../../Common/TextString';

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
  const navigation =
    useNavigation<NativeStackNavigationProp<{ExploreCardDetail: {}}>>();
  const [IsImageLoading, setIsImageLoading] = useState(false);
  const {showToast} = useCustomToast();

  const OnPressCard = () => {
    navigation.navigate('ExploreCardDetail', {props: item});
  };

  const ImagePath =
    item?.recent_pik && item?.recent_pik?.length !== 0
      ? {uri: ApiConfig.IMAGE_BASE_URL + item?.recent_pik[0]}
      : CommonImages.WelcomeBackground;

  const Age = useCalculateAge(item.birthdate);

  const onLikePress = async () => {
    setIsAPILoading(true);
    setCurrentCardIndex(index);

    const InInternetConnected = (await NetInfo.fetch()).isConnected;

    if (!InInternetConnected) {
      showToast(
        TextString.error.toUpperCase(),
        TextString.PleaseCheckYourInternetConnection,
        TextString.error,
      );
      return;
    }

    try {
      const userDataForApi = {
        eventName: 'like',
        like_to: item._id,
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        console.log('LikeUserAPI APIResponse Data ---:>', APIResponse.data);
        if (APIResponse.data?.status === 'match') {
          setItsMatchModalView(true);
        } else {
          setItsMatchModalView(false);
          // setIsAPILoading(false);
        }
        store.dispatch(onSwipeRight(String(item._id)));
        FetchAPIData();
      } else {
        showToast(
          'Something went wrong',
          APIResponse?.message || 'Please try again letter',
          'error',
        );
        setItsMatchModalView(false);
        setIsAPILoading(false);
      }
    } catch (error) {
      console.log('Something Went Wrong With Feting API Data');
      setItsMatchModalView(false);
      setIsAPILoading(false);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={OnPressCard}
      style={[styles.container, {}]}>
      {IsImageLoading && (
        <View style={styles.ImageLoaderView}>
          <ActivityIndicator
            size={30}
            color={COLORS.Primary}
            style={styles.Loader}
          />
        </View>
      )}
      <FastImage
        source={ImagePath}
        onLoadStart={() => setIsImageLoading(true)}
        onLoad={() => setIsImageLoading(false)}
        resizeMode="cover"
        style={styles.imageView}>
        <LinearGradient
          colors={COLORS.GradientViewForCards}
          locations={[0, 1]}
          style={styles.gradient}>
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
                    <Image
                      style={styles.LocationIcon}
                      source={CommonIcons.Location}
                    />
                    <Text numberOfLines={1} style={styles.LocationText}>
                      {item?.city || 'Location'}
                    </Text>
                  </View>
                )
              )}
            </View>

            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              style={styles.LikeCardView}
              onPress={() => {
                setIsAPILoading(true);
                setTimeout(() => {
                  onLikePress();
                }, 0);
              }}>
              <Image source={CommonImages.LikeCard} style={styles.LikeCard} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </FastImage>
    </TouchableOpacity>
  );
};

export default CategoryRenderCard;

const styles = StyleSheet.create({
  container: {
    width: '48%',
    height: hp('25%'),
    overflow: 'hidden',
    marginVertical: '1%',
    marginBottom: '2%',
    borderRadius: hp('3%'),
  },
  imageView: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  gradient: {
    flex: 0.5,
    justifyContent: 'flex-end',
  },
  DetailContainerView: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: hp('1.5%'),
    justifyContent: 'space-between',
  },
  UserInfoView: {
    width: '72%',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  TitleText: {
    fontFamily: FONTS.Bold,
    fontSize: hp('2.3%'),
    lineHeight: hp('3.5%'),
    color: COLORS.White,
    marginHorizontal: hp('2%'),
    marginBottom: hp('0.5%'),
  },
  LocationView: {
    width: '85%',
    overflow: 'hidden',
    // alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: hp('2%'),
  },
  LocationIcon: {
    width: hp('2%'),
    height: hp('2%'),
  },
  LocationText: {
    width: '80%',
    color: COLORS.White,
    fontSize: hp('1.5%'),
    marginLeft: hp('0.5%'),
    fontFamily: FONTS.Medium,
  },
  LikeCardView: {
    // right: 1,
    width: '28%',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  LikeCard: {
    alignSelf: 'flex-start',
    width: hp('4.6%'),
    height: hp('4.6%'),
  },
  ImageLoaderView: {
    zIndex: 999,
    top: 0,
    bottom: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  Loader: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  IsActiveIndicator: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderRadius: 500,
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: COLORS.White,
    backgroundColor: 'rgba(0, 255, 71, 1)',
  },
});
