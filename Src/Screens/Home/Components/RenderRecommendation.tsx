import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Skeleton } from 'moti/skeleton';
import React, { FC, memo, useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, GROUP_FONT } from '../../../Common/Theme';
import { useTheme } from '../../../Contexts/ThemeContext';
import { GradientBorderView } from '../../../Components/GradientBorder';

interface RenderLookingViewProps {
  item: {
    id: number;
    title: string;
    image: number;
  };
  IsLoading: boolean;
}

// Function to generate random hex color
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

  // Generate random border color, white for dark mode
  const borderColor = useMemo(() => {
    return isDark ? 'white' : getRandomColor();
  }, [isDark]);

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
        style={{ flex: 1, justifyContent: 'center', overflow: 'hidden', borderRadius: 19 }}
      >
        <Skeleton colorMode="light" show={IsLoading} colors={COLORS.LoaderGradient}>
          <View>
            <Image resizeMode="cover" source={item.image} style={styles.imageView} />
            <LinearGradient colors={COLORS.GradientViewForCards} style={styles.gradient}>
              {!IsLoading && (
                <Text numberOfLines={2} style={styles.TitleText}>
                  {item?.title}
                </Text>
              )}
            </LinearGradient>
          </View>
        </Skeleton>
      </Pressable>
    </GradientBorderView>
  );
};

export default memo(RenderRecommendation);

const styles = StyleSheet.create({
  container: {
    width: 125,
    height: 135,
    overflow: 'hidden',
    marginVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  imageView: {
    width: '100%',
    height: '100%',
    // borderRadius: 20,
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
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    paddingVertical: 5,
    overflow: 'hidden',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  TitleText: {
    width: '88%',
    ...GROUP_FONT.h2,
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    color: COLORS.White,
    alignSelf: 'center',
  },
});
