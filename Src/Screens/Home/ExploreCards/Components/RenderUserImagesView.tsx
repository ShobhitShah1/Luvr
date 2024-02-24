import React, {FC, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ApiConfig from '../../../../Config/ApiConfig';
import {DummyImage} from '../../../../Config/Setting';
import {COLORS} from '../../../../Common/Theme';

interface UserImagesProps {
  Images: string;
}

const RenderUserImagesView: FC<UserImagesProps> = ({Images}) => {
  const [IsImageLoading, setIsImageLoading] = useState(false);
  return (
    <View>
      <FastImage
        onLoadStart={() => setIsImageLoading(true)}
        onLoadEnd={() => setIsImageLoading(false)}
        resizeMode="cover"
        style={styles.UserProfileImages}
        source={{
          uri: Images ? `${ApiConfig.IMAGE_BASE_URL}${Images}` : DummyImage,
          priority: FastImage.priority.high,
        }}
        fallback={Platform.OS === 'android'}
      />
      {IsImageLoading && (
        <View style={styles.Loader}>
          <ActivityIndicator size={'large'} color={COLORS.Primary} />
        </View>
      )}
    </View>
  );
};

export default RenderUserImagesView;

const styles = StyleSheet.create({
  UserProfileImages: {
    height: 350,
    width: Dimensions.get('window').width * 0.9,
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
});
