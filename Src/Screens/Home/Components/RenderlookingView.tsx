import React, { FC, memo } from 'react';
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, GROUP_FONT } from '../../../Common/Theme';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { useTheme } from '../../../Contexts/ThemeContext';
import { HomeListProps } from '../../../Types/Interface';

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
  container: {
    width: 125,
    height: 125,
    overflow: 'hidden',
    marginVertical: 5,
    borderRadius: 20,
    borderWidth: 2,
  },
  pressable: {
    flex: 1,
    flexGrow: 1,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    borderRadius: 18, // Reduced from parent's borderRadius
  },
  imageView: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 16, // Further reduced to show parent's border
  },
  gradient: {
    bottom: -5,
    left: 0,
    right: 0,
    width: '100%',
    height: '70%',
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
    bottom: 10,
  },
});
