import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Skeleton} from 'moti/skeleton';
import React, {FC} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, GROUP_FONT} from '../../../Common/Theme';

interface RenderLookingViewProps {
  item: {
    id: number;
    title: string;
    image: any;
  };
  index: number;
  IsLoading: boolean;
}

const RenderLookingView: FC<RenderLookingViewProps> = ({
  item,
  index,
  IsLoading,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{CategoryDetailCards: {}}>>();
  const marginHorizontal = index % 2 === 0 ? 0 : '3%';

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        !IsLoading && navigation.navigate('CategoryDetailCards', {item});
      }}
      style={[styles.container, {marginHorizontal}]}>
      <Skeleton
        // transition={{
        //   translateX: {
        //     type: 'timing',
        //   },
        // }}
        show={IsLoading}
        colorMode="light"
        colors={COLORS.LoaderGradient}>
        <ImageBackground
          source={item?.image}
          resizeMode="cover"
          style={styles.imageView}
          imageStyle={styles.imageStyle}>
          <LinearGradient
            colors={COLORS.GradientViewForCards}
            locations={[0, 1]}
            style={styles.gradient}>
            <Text style={styles.TitleText}>{item?.title}</Text>
          </LinearGradient>
        </ImageBackground>
      </Skeleton>
    </TouchableOpacity>
  );
};

export default RenderLookingView;

const styles = StyleSheet.create({
  container: {
    width: '47%',
    zIndex: 9999,
    height: hp('23%'),
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
    // borderRadius: hp('5%'),
  },
  TitleText: {
    width: '100%',
    ...GROUP_FONT.h2,
    color: COLORS.White,
    marginHorizontal: hp('2%'),
    bottom: hp('2%'),
  },
});
