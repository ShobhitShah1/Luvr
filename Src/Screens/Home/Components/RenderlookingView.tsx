import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Skeleton} from 'moti/skeleton';
import React, {FC, memo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
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
  const [IsImageLoading, setIsImageLoading] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={IsLoading}
      onPress={() => {
        navigation.navigate('CategoryDetailCards', {item});
      }}
      style={[styles.container, {marginHorizontal}]}>
      <Skeleton
        colorMode="light"
        show={IsLoading || IsImageLoading}
        colors={COLORS.LoaderGradient}>
        <View>
          <FastImage
            onLoadStart={() => setIsImageLoading(true)}
            onLoad={() => setIsImageLoading(false)}
            onLoadEnd={() => setIsImageLoading(false)}
            source={{uri: item?.image, priority: FastImage.priority.high}}
            resizeMode="cover"
            style={styles.imageView}
          />
          <LinearGradient
            colors={COLORS.GradientViewForCards}
            style={styles.gradient}>
            {!IsLoading && !IsImageLoading && (
              <Text numberOfLines={2} style={styles.TitleText}>
                {item?.title}
              </Text>
            )}
          </LinearGradient>
        </View>
      </Skeleton>
    </TouchableOpacity>
  );
};

export default memo(RenderLookingView);

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
    bottom: 0,
    width: '100%',
    paddingVertical: 5,
    overflow: 'hidden',
    position: 'absolute',
  },
  TitleText: {
    width: '85%',
    ...GROUP_FONT.h2,
    fontSize: 19,
    lineHeight: 21,
    color: COLORS.White,
    marginHorizontal: hp('1.5%'),
  },
});
