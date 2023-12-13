import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';
import CommonImages from '../../../../Common/CommonImages';
import {ActiveOpacity, COLORS, FONTS} from '../../../../Common/Theme';
import {CardDetailType} from '../../../../Types/CardDetailType';

interface RenderlookingViewProps {
  item: CardDetailType;
  index: number;
}

const CategoryRenderCard: FC<RenderlookingViewProps> = ({item, index}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{ExploreCardDetail: {}}>>();
  const marginHorizontal = index === 1 || index === 3 ? '4%' : 0;

  const OnPressCard = () => {
    navigation.navigate('ExploreCardDetail', {props: item});
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={OnPressCard}
      style={[styles.container, {marginHorizontal}]}>
      <FastImage
        source={{
          uri: item.images[0],
          priority: FastImage.priority.high,
        }}
        resizeMode="cover"
        style={styles.imageView}>
        <LinearGradient
          colors={COLORS.GradientViewForCards}
          locations={[0, 1]}
          style={styles.gradient}>
          <View style={styles.DetailContainerView}>
            <View style={styles.UserInfoView}>
              <Text numberOfLines={2} style={styles.TitleText}>
                {item.name}, {item.age}
              </Text>
              {item.location && (
                <View style={styles.LocationView}>
                  <Image
                    style={styles.LocationIcon}
                    source={CommonIcons.Location}
                  />
                  <Text numberOfLines={1} style={styles.LocationText}>
                    {item.location}
                  </Text>
                </View>
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
    fontFamily: FONTS.Bold,
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
});
