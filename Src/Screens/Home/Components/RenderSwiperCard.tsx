import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {FC} from 'react';
import FastImage from 'react-native-fast-image';
import {COLORS, GROUP_FONT} from '../../../Common/Theme';

interface RenderCardProps {
  CurrentCardIndex: number;
  card: number;
  setFirstImageLoading: (loading: boolean) => void;
  firstImageLoading: boolean;
  currentImageIndex: number;
  cardIndex: Card[];
}

interface Card {
  images: string[];
}

const RenderSwiperCard: FC<RenderCardProps> = ({
  CurrentCardIndex,
  cardIndex,
  card,
  firstImageLoading,
  setFirstImageLoading,
  currentImageIndex,
}) => {
  if (CurrentCardIndex === card) {
    return (
      <Animated.View style={[styles.card]}>
        <Text style={styles.topCardTitle}>
          Image Index Is: {currentImageIndex}
        </Text>

        <FastImage
          onLoadStart={() => setFirstImageLoading(true)}
          onLoad={() => setFirstImageLoading(false)}
          onLoadEnd={() => setFirstImageLoading(false)}
          resizeMode="cover"
          source={{
            uri: cardIndex?.images[currentImageIndex],
            priority: FastImage.priority.high,
          }}
          style={{width: '100%', height: '100%'}}
        />

        {firstImageLoading && (
          <View
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignSelf: 'center',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}>
            <ActivityIndicator size="large" color={COLORS.Primary} />
          </View>
        )}
      </Animated.View>
    );
  }
  return (
    <View style={[styles.card]}>
      <FastImage
        resizeMode="cover"
        source={{uri: cardIndex?.images[0], priority: FastImage.priority.high}}
        style={{width: '100%', height: '100%'}}
      />
    </View>
  );
};

export default RenderSwiperCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  topCardTitle: {
    position: 'absolute',
    top: 50,
    zIndex: 9999,
    ...GROUP_FONT.h1,
    color: COLORS.White,
  },
});
