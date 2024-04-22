import React, {FC, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import {COLORS} from '../../../../Common/Theme';
import ApiConfig from '../../../../Config/ApiConfig';
import {DummyImage} from '../../../../Config/Setting';

interface UserImagesProps {
  Images: string;
}

const RenderUserImagesView: FC<UserImagesProps> = ({Images}) => {
  const [IsImageLoading, setIsImageLoading] = useState(false);
  return (
    <View>
      <Image
        onLoadStart={() => setIsImageLoading(true)}
        onLoadEnd={() => setIsImageLoading(false)}
        style={styles.UserProfileImages}
        source={{
          uri: Images ? `${ApiConfig.IMAGE_BASE_URL}${Images}` : DummyImage,
          cache: 'force-cache',
        }}
        resizeMethod="scale"
        progressiveRenderingEnabled={true}
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
    flex: 1,
    height: '100%',
    resizeMode: 'contain',
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
