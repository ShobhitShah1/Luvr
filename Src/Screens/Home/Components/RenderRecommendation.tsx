import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, memo } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { useTheme } from '../../../Contexts/ThemeContext';

interface RenderLookingViewProps {
  item: {
    id: number;
    title: string;
    image: number;
  };
  IsLoading: boolean;
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const RenderRecommendation: FC<RenderLookingViewProps> = ({ item, IsLoading }) => {
  const { isDark, colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<{ CategoryDetailCards: {} }>>();

  return (
    <GradientBorderView
      style={styles.container}
      gradientProps={{
        colors: isDark ? [colors.White, colors.White] : [getRandomColor(), getRandomColor()],
      }}
    >
      <Pressable
        disabled={IsLoading}
        onPress={() => {
          navigation.navigate('CategoryDetailCards', { item });
        }}
        style={{ flex: 1, justifyContent: 'center', overflow: 'hidden', borderRadius: 27 }}
      >
        <ImageBackground source={item.image} style={styles.imageView}>
          <LinearGradient
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            colors={['rgba(90, 76, 138, 0)', 'rgba(8, 2, 27, 0.8)'].reverse()}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 50 }}
          />
          <LinearGradient
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={isDark ? colors.ButtonGradient : [colors.White, colors.White]}
            style={styles.gradient}
          >
            <Text numberOfLines={2} style={[styles.titleText, { color: colors.TextColor }]}>
              {'View profile'}
              {/* {item?.title} */}
            </Text>
          </LinearGradient>
        </ImageBackground>
      </Pressable>
    </GradientBorderView>
  );
};

export default memo(RenderRecommendation);

const styles = StyleSheet.create({
  container: {
    width: 110,
    height: 135,
    overflow: 'hidden',
    marginVertical: 5,
    borderRadius: 28,
    borderWidth: 1.5,
  },
  imageView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    width: '99%',
    height: '99%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  gradient: {
    bottom: 9,
    width: '85%',
    maxHeight: 45,
    paddingVertical: 4,
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  titleText: {
    width: '88%',
    fontSize: 12.5,
    fontFamily: FONTS.Bold,
    textAlign: 'center',
    color: COLORS.White,
    alignSelf: 'center',
  },
});
