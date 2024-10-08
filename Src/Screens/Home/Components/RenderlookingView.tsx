import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Skeleton} from 'moti/skeleton';
import React, {FC, memo} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, GROUP_FONT} from '../../../Common/Theme';

interface RenderLookingViewProps {
  item: {
    id: number;
    title: string;
    image: number;
  };
  IsLoading: boolean;
}

const RenderLookingView: FC<RenderLookingViewProps> = ({item, IsLoading}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{CategoryDetailCards: {}}>>();

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={IsLoading}
      onPress={() => {
        navigation.navigate('CategoryDetailCards', {item});
      }}
      style={styles.container}>
      <Skeleton
        colorMode="light"
        show={IsLoading}
        colors={COLORS.LoaderGradient}>
        <View>
          <Image
            resizeMode="cover"
            source={item.image}
            style={styles.imageView}
          />
          <LinearGradient
            colors={COLORS.GradientViewForCards}
            style={styles.gradient}>
            {!IsLoading && (
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
    width: '48.5%',
    zIndex: 9999,
    height: 210,
    overflow: 'hidden',
    marginVertical: 5,
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
