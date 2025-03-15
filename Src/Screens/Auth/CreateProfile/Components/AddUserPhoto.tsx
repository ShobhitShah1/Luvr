/* eslint-disable react-native/no-inline-styles */
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
            borderColor: hasPicture ? colors.White : isDark ? 'rgba(198, 198, 198, 0.5)' : colors.Black,
          },
        ]}
      >
        <View style={[styles.AddAndDeleteContainerView]}>
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
  item: {
    overflow: 'hidden',
    width: hp('19%'),
    height: hp('19%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp('1.5%'),
    marginVertical: hp('0.3%'),
    // backgroundColor: colors.White,
  },
  ImageHasImageView: {
    width: '100%',
    height: '100%',
  },
  NoImageView: {
    width: '30%',
    height: '30%',
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
    bottom: 15,
  },
  item_text: {
    ...GROUP_FONT.h4,
  },
  userImageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: hp('1.5%'),
    justifyContent: 'center',
  },
  ImageAddAndDeleteView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  BlurViewContainer: {
    flex: 1,
    bottom: 10,
    height: 35,
    width: '85%',
    overflow: 'hidden',
    alignSelf: 'center',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: hp('0.13%'),
    borderRadius: SIZES.radius,
  },
  BlurView: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    justifyContent: 'center',
  },
  AddAndDeleteContainerView: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  FlexView: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ImageView: {
    width: hp('2%'),
    height: hp('2%'),
    alignSelf: 'center',
    marginHorizontal: hp('0.5%'),
  },
  AddAndRemoveText: {
    alignSelf: 'center',
    textAlign: 'center',
    ...GROUP_FONT.h3,
  },
});
