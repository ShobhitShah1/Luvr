import React, { memo } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import CommonLogos from '../../../Common/CommonLogos';
import { COLORS, FONTS } from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import type { ProfileType } from '../../../Types/ProfileType';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
};

function RenderRecommendation({ item }: { item: ProfileType }) {
  const { isDark, colors } = useTheme();
  const navigation = useCustomNavigation();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('ExploreCardDetail', { props: item });
      }}
      style={[styles.container, { borderColor: isDark ? colors.White : getRandomColor() }]}
    >
      <View style={{ flex: 1, justifyContent: 'center', overflow: 'hidden', borderRadius: 27 }}>
        <ImageBackground
          source={
            item.recent_pik?.[0]
              ? { uri: ApiConfig.IMAGE_BASE_URL + item.recent_pik[0] }
              : CommonLogos.AppIcon
          }
          style={styles.imageView}
        >
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
              View profile
            </Text>
          </LinearGradient>
        </ImageBackground>
      </View>
    </Pressable>
  );
}

export default memo(RenderRecommendation);

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    borderWidth: 1.5,
    height: 135,
    marginVertical: 5,
    overflow: 'hidden',
    width: 110,
  },
  gradient: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    bottom: 9,
    justifyContent: 'center',
    maxHeight: 45,
    paddingVertical: 4,
    width: '85%',
  },
  imageStyle: {
    alignSelf: 'center',
    height: '99%',
    justifyContent: 'center',
    width: '99%',
  },
  imageView: {
    alignItems: 'center',
    alignSelf: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    width: '100%',
  },
  titleText: {
    alignSelf: 'center',
    color: COLORS.White,
    fontFamily: FONTS.Bold,
    fontSize: 12.5,
    textAlign: 'center',
    width: '88%',
  },
});
