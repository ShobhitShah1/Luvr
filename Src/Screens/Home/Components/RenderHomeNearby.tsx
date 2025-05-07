import React, { FC, memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CommonLogos from '../../../Common/CommonLogos';
import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import { ProfileType } from '../../../Types/ProfileType';

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
            item?.recent_pik?.[0] ? { uri: ApiConfig.IMAGE_BASE_URL + item?.recent_pik?.[0] } : CommonLogos.AppIcon
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
          {item?.full_name?.trim() && <Text style={styles.nameText}>{item?.full_name?.trim()}</Text>}
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
  container: {
    width: 200,
    height: 200,
    marginTop: 8,
  },
  cardContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  likeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.White,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: 'center',
    zIndex: 3,
  },
  likeCount: {
    marginLeft: 2,
    fontSize: 16,
    color: COLORS.Black,
    fontFamily: FONTS.Bold,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    paddingBottom: 32,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  nameText: {
    ...GROUP_FONT.h2,
    color: COLORS.White,
    marginBottom: 4,
    textAlign: 'center',
    width: '90%',
  },
  jobText: {
    width: '90%',
    fontSize: 14,
    color: COLORS.Primary,
    textAlign: 'center',
  },
  locationContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 2,
  },
  locationText: {
    fontWeight: 'bold',
    color: COLORS.White,
  },
});
