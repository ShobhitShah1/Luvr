import React, { memo, useState, useCallback } from 'react';
import type { FC } from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, View, Text } from 'react-native';
import type { ImageErrorEventData, NativeSyntheticEvent } from 'react-native';

import { COLORS } from '../../../../Common/Theme';
import ApiConfig from '../../../../Config/ApiConfig';
import { DummyImage } from '../../../../Config/Setting';

interface UserImagesProps {
  Images: string;
  index: number;
}

const RenderUserImagesView: FC<UserImagesProps> = ({ Images, index }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const imageUrl = Images ? `${ApiConfig.IMAGE_BASE_URL}${Images}` : DummyImage;

  const handleLoadStart = useCallback(() => {
    setIsImageLoading(true);
    setErrorMessage(null);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsImageLoading(false);
  }, []);

  const handleError = useCallback((errorEvent: NativeSyntheticEvent<ImageErrorEventData>) => {
    console.error('Image loading error:', errorEvent.nativeEvent.error);
    setIsImageLoading(false);

    const errorMessage = errorEvent.nativeEvent.error;
    if (errorMessage.includes('Network')) {
      setErrorMessage('Network error. Please check your connection.');
    } else if (errorMessage.includes('404')) {
      setErrorMessage('Image not found.');
    } else if (errorMessage.includes('timeout')) {
      setErrorMessage('Request timed out. Please try again.');
    } else {
      setErrorMessage('Failed to load image. Please try again.');
    }
  }, []);

  return (
    <View style={styles.ImageContainer} key={index}>
      <Image
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        style={styles.UserProfileImages}
        source={{
          uri: imageUrl,
          cache: 'force-cache',
        }}
        resizeMethod="resize"
        progressiveRenderingEnabled={true}
      />

      {isImageLoading && (
        <View style={styles.Loader}>
          <ActivityIndicator size="large" color={COLORS.Primary} />
        </View>
      )}

      {errorMessage && (
        <View style={styles.ErrorContainer}>
          <Text style={styles.ErrorText}>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
};

export default memo(RenderUserImagesView);

const styles = StyleSheet.create({
  ErrorContainer: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    padding: 20,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  ErrorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  ImageContainer: {
    alignItems: 'center',
    flex: 1,
    overflow: 'hidden',
    width: '90%',
  },
  Loader: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  RetryText: {
    color: COLORS.Primary,
    fontSize: 14,
    textAlign: 'center',
  },
  UserProfileImages: {
    flex: 1,
    height: '100%',
    resizeMode: 'contain',
    width: Dimensions.get('window').width,
  },
});
