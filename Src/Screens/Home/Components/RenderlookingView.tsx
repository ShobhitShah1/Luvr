import React, { FC, memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, GROUP_FONT } from '../../../Common/Theme';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import { HomeListProps } from '../../../Types/Interface';

const RenderLookingView: FC<HomeListProps> = ({ item }) => {
  const { isDark, colors } = useTheme();
  const navigation = useCustomNavigation();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('CategoryDetailCards', { item });
      }}
      style={[styles.container, { borderColor: isDark ? colors.White : 'transparent' }]}
    >
      <View>
        <Image resizeMode="cover" source={item.image} style={styles.imageView} />
        <LinearGradient colors={COLORS.GradientViewForCards} style={styles.gradient}>
          <Text numberOfLines={2} style={styles.TitleText}>
            {item?.title}
          </Text>
        </LinearGradient>
      </View>
    </Pressable>
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
    borderWidth: 1,
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
