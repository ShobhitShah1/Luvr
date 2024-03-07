import React, {FC} from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, GROUP_FONT} from '../../../Common/Theme';

interface RenderlookingViewProps {
  item: {
    id: number;
    title: string;
    image: any;
  };
  index: number;
  isFullWidth: boolean;
}

const RenderForYou: FC<RenderlookingViewProps> = ({item, index}) => {
  const marginHorizontal = index === 1 || index === 3 ? '3%' : 0;

  return (
    <View style={[styles.container, {marginHorizontal}]}>
      <ImageBackground
        source={item.image}
        resizeMode="cover"
        style={styles.imageView}
        imageStyle={styles.imageStyle}>
        <LinearGradient
          colors={COLORS.GradientViewForCards}
          locations={[0, 1]}
          style={styles.gradient}>
          <Text style={styles.TitleText}>{item.title}</Text>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default RenderForYou;

const styles = StyleSheet.create({
  container: {
    width: '47%',
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
