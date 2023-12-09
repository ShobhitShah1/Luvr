import React, {FC} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS, GROUP_FONT} from '../../../../Common/Theme';
import CommonImages from '../../../../Common/CommonImages';
import CommonIcons from '../../../../Common/CommonIcons';

interface RenderlookingViewProps {
  item: {
    id: number;
    title: string;
    image: any;
  };
  index: number;
  isCategory: boolean;
  isLocation: boolean;
}

const CategoryRenderCard: FC<RenderlookingViewProps> = ({
  item,
  index,
  isCategory,
  isLocation,
}) => {
  const navigation = useNavigation();
  const marginHorizontal = index === 1 || index === 3 ? '4%' : 0;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {}}
      style={[styles.container, {marginHorizontal}]}>
      <ImageBackground
        source={item.image}
        resizeMode="cover"
        style={styles.imageView}
        imageStyle={styles.imageStyle}>
        <LinearGradient
          colors={COLORS.GradientViewForCards}
          locations={[0, 1]}
          style={styles.gradient}>
          <View style={styles.DetailContainerView}>
            <View style={styles.UserInfoView}>
              <Text numberOfLines={2} style={styles.TitleText}>
                {'Rubina'}, {'21'}
              </Text>
              {isLocation && (
                <View style={styles.LocationView}>
                  <Image
                    style={styles.LocationIcon}
                    source={CommonIcons.Location}
                  />
                  <Text style={styles.LocationText}>Surat</Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.LikeCardView}>
              <Image source={CommonImages.LikeCard} style={styles.LikeCard} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
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
    width: '100%',
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
    marginLeft: hp('0.5%')
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
