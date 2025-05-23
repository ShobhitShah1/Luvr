import React from 'react';
import type { FC } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { COLORS, GROUP_FONT } from '../../../Common/Theme';

interface RenderlookingViewProps {
  item: {
    id: number;
    title: string;
    image: any;
  };
  index: number;
  isFullWidth: boolean;
}

const RenderForYou: FC<RenderlookingViewProps> = ({ item, index }) => {
  const marginHorizontal = index === 1 || index === 3 ? '3%' : 0;

  return (
    <View style={[styles.container, { marginHorizontal }]}>
      <ImageBackground
        source={item.image}
        resizeMode="cover"
        style={styles.imageView}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={COLORS.GradientViewForCards}
          locations={[0, 1]}
          style={styles.gradient}
        >
          <Text style={styles.TitleText}>{item.title}</Text>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default RenderForYou;

const styles = StyleSheet.create({
  TitleText: {
    width: '100%',
    ...GROUP_FONT.h2,
    bottom: hp('2%'),
    color: COLORS.White,
    marginHorizontal: hp('2%'),
  },
  container: {
    borderRadius: hp('3%'),
    height: hp('23%'),
    marginVertical: '1%',
    overflow: 'hidden',
    width: '47%',
  },
  gradient: {
    flex: 0.5,
    justifyContent: 'flex-end',
    // borderRadius: hp('5%'),
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
