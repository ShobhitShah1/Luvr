import React, { memo } from 'react';
import type { FC } from 'react';
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS, GROUP_FONT } from '../../../Common/Theme';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { useTheme } from '../../../Contexts/ThemeContext';
import type { HomeListProps } from '../../../Types/Interface';

const RenderLookingView: FC<HomeListProps> = ({ item, onCategoryPress, selectedCategory }) => {
  const { isDark, colors } = useTheme();

  const gradientColors =
    selectedCategory === item.title
      ? isDark
        ? colors.ButtonGradient
        : [colors.Primary, colors.Primary]
      : ['transparent', 'transparent'];

  return (
    <GradientBorderView gradientProps={{ colors: gradientColors }} style={styles.container}>
      <Pressable onPress={() => onCategoryPress(item)} style={styles.pressable}>
        <Image resizeMode="cover" source={item.image} style={styles.imageView} />
        <LinearGradient colors={COLORS.GradientViewForCards} style={styles.gradient}>
          <Text numberOfLines={2} style={styles.TitleText}>
            {item?.title}
          </Text>
        </LinearGradient>
      </Pressable>
    </GradientBorderView>
  );
};

export default memo(RenderLookingView);

const styles = StyleSheet.create({
  TitleText: {
    width: '88%',
    ...GROUP_FONT.h2,
    alignSelf: 'center',
    bottom: 10,
    color: COLORS.White,
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
  },
  container: {
    borderRadius: 20,
    borderWidth: 2,
    height: 128,
    marginVertical: 5,
    overflow: 'hidden',
    width: 128,
  },
  gradient: {
    alignItems: 'center',
    bottom: -5,
    height: '70%',
    justifyContent: 'flex-end',
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    width: '100%',
  },
  imageView: {
    alignSelf: 'center',
    borderRadius: 16,
    height: '100%',
    justifyContent: 'center',
    width: '100%', // Further reduced to show parent's border
  },
  pressable: {
    borderRadius: 18,
    flex: 1,
    flexGrow: 1,
    height: '100%',
    overflow: 'hidden',
    width: '100%', // Reduced from parent's borderRadius
  },
});
