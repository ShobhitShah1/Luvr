import React, { memo } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import CommonLogos from '../../../Common/CommonLogos';
import { COLORS, FONTS } from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import { useTheme } from '../../../Contexts/ThemeContext';
import { ProfileType } from '../../../Types/ProfileType';
import LinearGradient from 'react-native-linear-gradient';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const RenderRecommendation = ({ item }: { item: ProfileType }) => {
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
          source={item.recent_pik?.[0] ? { uri: ApiConfig.IMAGE_BASE_URL + item.recent_pik[0] } : CommonLogos.AppIcon}
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
