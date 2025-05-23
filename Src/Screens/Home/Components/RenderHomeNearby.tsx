import React, { memo } from 'react';
import type { FC } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import CommonLogos from '../../../Common/CommonLogos';
import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import type { ProfileType } from '../../../Types/ProfileType';

interface RenderLookingViewProps {
  item: ProfileType;
}

const RenderHomeNearby: FC<RenderLookingViewProps> = ({ item }) => {
  const navigation = useCustomNavigation();
  const { colors } = useTheme();

  const handlePress = () => {
    navigation.navigate('ExploreCardDetail', { props: item });
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.cardContainer}>
        <Image
          source={
            item?.recent_pik?.[0]
              ? { uri: ApiConfig.IMAGE_BASE_URL + item?.recent_pik?.[0] }
              : CommonLogos.AppIcon
          }
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <LinearGradient colors={colors.GradientViewForCards} style={styles.overlay} />

        {/* <View style={styles.likeContainer}>
          <Image source={CommonIcons.ic_red_heart} style={{ width: 20, height: 20 }} resizeMode="contain" />
          <Text style={styles.likeCount}>{item?.likes_into?.length || 10}</Text>
        </View> */}

        <View style={styles.infoContainer}>
          {item?.full_name?.trim() && (
            <Text style={styles.nameText}>{item?.full_name?.trim()}</Text>
          )}
          {item?.education?.digree?.trim() && (
            <Text numberOfLines={1} style={styles.jobText}>
              {item?.education?.digree?.trim()}
            </Text>
          )}
        </View>

        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>{item?.city?.trim()}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default memo(RenderHomeNearby);

const styles = StyleSheet.create({
  backgroundImage: {
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  cardContainer: {
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  container: {
    height: 200,
    marginTop: 8,
    width: 200,
  },
  infoContainer: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    paddingBottom: 32,
    position: 'absolute',
    right: 0,
    zIndex: 2,
  },
  jobText: {
    color: COLORS.Primary,
    fontSize: 14,
    textAlign: 'center',
    width: '90%',
  },
  likeContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.White,
    borderRadius: 20,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 5,
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 3,
  },
  likeCount: {
    color: COLORS.Black,
    fontFamily: FONTS.Bold,
    fontSize: 16,
    marginLeft: 2,
  },
  locationContainer: {
    bottom: 10,
    position: 'absolute',
    right: 10,
    zIndex: 2,
  },
  locationText: {
    color: COLORS.White,
    fontWeight: 'bold',
  },
  nameText: {
    ...GROUP_FONT.h2,
    color: COLORS.White,
    marginBottom: 4,
    textAlign: 'center',
    width: '90%',
  },
  overlay: {
    bottom: 0,
    height: '50%',
    left: 0,
    position: 'absolute',
    right: 0,
  },
});
