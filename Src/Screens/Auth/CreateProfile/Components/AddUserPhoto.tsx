import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import CommonIcons from '../../../../Common/CommonIcons';
import { COLORS, GROUP_FONT, SIZES } from '../../../../Common/Theme';
import { useTheme } from '../../../../Contexts/ThemeContext';

type Picture = {
  name: string;
  type: string;
  key: string;
  url: string;
};

type AddUserPhotoProps = {
  picture: Picture;
  onDelete?: () => void;
  onAdd?: () => void;
};

const AddUserPhoto: React.FC<AddUserPhotoProps> = ({ picture }) => {
  const { colors, isDark } = useTheme();

  const hasPicture = !!picture.url;
  const [IsImageLoading, setIsImageLoading] = useState<boolean>(false);

  return (
    <View
      style={[styles.item, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : colors.White }]}
      key={picture?.url}
    >
      <View style={styles.userImageContainer}>
        {IsImageLoading && (
          <ActivityIndicator
            color={colors.Primary}
            size={23}
            style={{
              zIndex: 9999,
              position: 'absolute',
              justifyContent: 'center',
              alignSelf: 'center',
            }}
          />
        )}
        <Image
          onLoadStart={() => setIsImageLoading(true)}
          onLoad={() => setIsImageLoading(false)}
          source={picture?.url ? { uri: picture?.url } : CommonIcons.NoImage}
          resizeMode="cover"
          tintColor={picture?.url ? undefined : 'rgba(198, 198, 198, 0.5)'}
          style={picture?.url ? styles.ImageHasImageView : styles.NoImageView}
        />
      </View>

      <View
        style={[
          styles.BlurViewContainer,
          {
            // backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : colors.White,
            borderColor: hasPicture
              ? colors.White
              : isDark
              ? 'rgba(198, 198, 198, 0.5)'
              : colors.Black,
          },
        ]}
      >
        <View style={styles.AddAndDeleteContainerView}>
          <View style={styles.FlexView}>
            <Image
              resizeMode="cover"
              style={[
                styles.ImageView,
                {
                  tintColor: hasPicture ? colors.White : colors.TextColor,
                },
              ]}
              source={hasPicture ? CommonIcons.DeleteImage : CommonIcons.AddImage}
            />
            <Text
              style={[
                styles.AddAndRemoveText,
                {
                  color: hasPicture ? colors.White : colors.TextColor,
                },
              ]}
            >
              {hasPicture ? 'Delete Photo' : 'Add Photo'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddUserPhoto;

const styles = StyleSheet.create({
  AddAndDeleteContainerView: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  AddAndRemoveText: {
    alignSelf: 'center',
    textAlign: 'center',
    ...GROUP_FONT.h3,
  },
  BlurView: {
    alignSelf: 'center',
    borderWidth: 1,
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  BlurViewContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: SIZES.radius,
    borderWidth: hp('0.13%'),
    bottom: 10,
    flex: 1,
    height: 35,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    width: '85%',
  },
  FlexView: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  ImageAddAndDeleteView: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ImageHasImageView: {
    height: '100%',
    width: '100%',
  },
  ImageView: {
    alignSelf: 'center',
    height: hp('2%'),
    marginHorizontal: hp('0.5%'),
    width: hp('2%'),
  },
  NoImageView: {
    alignSelf: 'center',
    bottom: 15,
    height: '30%',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '30%',
  },
  item: {
    alignItems: 'center',
    borderRadius: hp('1.5%'),
    height: hp('19%'),
    justifyContent: 'center',
    marginVertical: hp('0.3%'),
    overflow: 'hidden',
    width: hp('19%'),
    // backgroundColor: colors.White,
  },
  item_text: {
    ...GROUP_FONT.h4,
  },
  userImageContainer: {
    borderRadius: hp('1.5%'),
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
});
