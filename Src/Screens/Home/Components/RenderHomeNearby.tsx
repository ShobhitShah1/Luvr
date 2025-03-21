import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Skeleton } from 'moti/skeleton';
import React, { FC, memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, GROUP_FONT } from '../../../Common/Theme';
import { useTheme } from '../../../Contexts/ThemeContext';

interface RenderLookingViewProps {
  item: any;
  IsLoading: boolean;
}

const RenderHomeNearby: FC<RenderLookingViewProps> = ({ item, IsLoading }) => {
  const { isDark, colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<{ CategoryDetailCards: {} }>>();

  const handlePress = () => {};

  return (
    <Pressable style={styles.container} onPress={handlePress} disabled={IsLoading}>
      <View style={styles.cardContainer}>
        {/* Background Image */}
        <Image source={item.image} style={styles.backgroundImage} resizeMode="cover" />

        {/* Overlay for better text visibility */}
        <LinearGradient colors={colors.GradientViewForCards} style={styles.overlay} />

        {/* Like Counter */}
        <View style={styles.likeContainer}>
          {/* <Ionicons name="heart" size={16} color="red" /> */}
          <Text style={styles.likeCount}>{item.likes || 10}</Text>
        </View>

        {/* Profile Info - positioned at bottom */}
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{item.name || 'Adan Smith'}</Text>
          <Text style={styles.jobText}>{item.job || 'Engineer'}</Text>
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>{item.location || 'USA'}</Text>
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
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  likeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.White,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    zIndex: 3,
  },
  likeCount: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: COLORS.Black,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 10,
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
  },
  jobText: {
    // ...GROUP_FONT.body,
    color: COLORS.Primary,
    // marginBottom: 4,
    textAlign: 'center',
  },
  locationContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 2,
  },
  locationText: {
    // ...GROUP_FONT.body,
    fontWeight: 'bold',
    color: COLORS.White,
  },
});
