import React, { FC, memo, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageErrorEventData,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  Text,
} from 'react-native';
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
  ImageContainer: {
    flex: 1,
    width: '90%',
    overflow: 'hidden',
    alignItems: 'center',
  },
  UserProfileImages: {
    flex: 1,
    height: '100%',
    resizeMode: 'contain',
    width: Dimensions.get('window').width,
  },
  Loader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ErrorContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  ErrorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  RetryText: {
    color: COLORS.Primary,
    fontSize: 14,
    textAlign: 'center',
  },
});
