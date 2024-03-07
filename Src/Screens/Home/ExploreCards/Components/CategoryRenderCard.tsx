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
import {ProfileType} from '../../../../Types/ProfileType';

interface RenderLookingViewProps {
  item: ProfileType;
  index: number;
  isRecentlyActive?: boolean;
}

const CategoryRenderCard: FC<RenderLookingViewProps> = ({
  item,
  index,
  isRecentlyActive,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{ExploreCardDetail: {}}>>();
  const marginHorizontal = index === 1 || index === 3 ? '4%' : 0;
  const [IsImageLoading, setIsImageLoading] = useState(false);

  const OnPressCard = () => {
    navigation.navigate('ExploreCardDetail', {props: item});
  };
  // console.log('item', item);
  // const ImagePath =
  //   item?.recent_pik && item?.recent_pik?.length !== 0
  //     ? {uri: item?.recent_pik[0]}
  //     : CommonImages.WelcomeBackground;
  const ImagePath =
    item?.recent_pik && item?.recent_pik?.length !== 0
      ? {uri: ApiConfig.IMAGE_BASE_URL + item?.recent_pik[0]}
      : CommonImages.WelcomeBackground;

  const Age = useCalculateAge(item.birthdate);
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={OnPressCard}
      style={[styles.container, {marginHorizontal}]}>
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
              style={styles.LikeCardView}>
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
    marginVertical: hp('1%'),
    justifyContent: 'space-between',
  },
  UserInfoView: {
    width: '75%',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  TitleText: {
    fontFamily: FONTS.Bold,
    fontSize: hp('2.3%'),
    lineHeight: hp('3.5%'),
    color: COLORS.White,
    marginHorizontal: hp('2%'),
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
    marginLeft: hp('0.5%'),
    fontFamily: FONTS.Medium,
    fontSize: hp('1.5%'),
    color: COLORS.White,
  },
  LikeCardView: {
    width: '25%',
    overflow: 'hidden',
    justifyContent: 'center',
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
