// AddUserPhoto.tsx
import {BlurView} from '@react-native-community/blur';
import React from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';
import {COLORS, GROUP_FONT, SIZES} from '../../../../Common/Theme';

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

const AddUserPhoto: React.FC<AddUserPhotoProps> = ({picture}) => {
  const hasPicture = !!picture.url;

  return (
    <View style={styles.item} key={picture?.url}>
      <Animated.View style={styles.UserImageContainer}>
        <Image
          source={picture?.url ? {uri: picture?.url} : CommonIcons.NoImage}
          resizeMode="cover"
          style={picture?.url ? styles.ImageHasImageView : styles.NoImageView}
        />
      </Animated.View>

      <View
        style={[
          styles.BlurViewContainer,
          {
            borderColor: hasPicture ? COLORS.White : COLORS.Black,
          },
        ]}>
        <BlurView
          blurType="light"
          blurAmount={1}
          style={styles.BlurView}
          overlayColor="transparent"
          reducedTransparencyFallbackColor="transparent">
          <View style={styles.AddAndDeleteContainerView}>
            <View style={styles.FlexView}>
              <Image
                resizeMode="cover"
                style={[
                  styles.ImageView,
                  {
                    tintColor: hasPicture ? COLORS.White : COLORS.Black,
                  },
                ]}
                source={
                  hasPicture ? CommonIcons.DeleteImage : CommonIcons.AddImage
                }
              />
              <Text
                style={[
                  styles.AddAndRemoveText,
                  {
                    color: hasPicture ? COLORS.White : COLORS.Black,
                  },
                ]}>
                {hasPicture ? 'Delete Photo' : 'Add Photo'}
              </Text>
            </View>
          </View>
        </BlurView>
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
    marginHorizontal: hp('0.6%'),
    marginVertical: hp('0.3%'),
    backgroundColor: COLORS.White,
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
  UserImageContainer: {
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
