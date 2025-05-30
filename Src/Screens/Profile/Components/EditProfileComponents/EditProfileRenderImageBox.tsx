/* eslint-disable react-native/no-inline-styles */
import { Skeleton } from 'moti/skeleton';
import React, { memo, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';
import { GROUP_FONT, SIZES } from '../../../../Common/Theme';
import ApiConfig from '../../../../Config/ApiConfig';
import { useTheme } from '../../../../Contexts/ThemeContext';

type Picture = {
  name: string;
  type: string;
  key: string;
  url: string;
};

type EditProfileRenderImageBoxProps = {
  picture: Picture;
  onDelete?: () => void;
  isLoading?: boolean;
  onChange?: (index: number) => void;
  index: number;
};

const EditProfileRenderImageBox: React.FC<EditProfileRenderImageBoxProps> = ({
  picture,
  isLoading,
  onChange,
  index,
}) => {
  const { isDark, colors } = useTheme();
  const hasPicture = useMemo(() => {
    return picture?.url;
  }, [picture?.url]);

  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  return (
    <View style={[styles.item, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : colors.White }]}>
      <View style={styles.UserImageContainer}>
        <Skeleton
          width={'100%'}
          height={'100%'}
          colors={colors.LoaderGradient}
          show={(isImageLoading || isLoading) && hasPicture ? true : false}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <FastImage
              onLoadStart={() => setIsImageLoading(true)}
              onLoad={() => setIsImageLoading(false)}
              onLoadEnd={() => setIsImageLoading(false)}
              source={
                picture?.url
                  ? {
                      uri: !picture?.url.includes('file:///data/user')
                        ? ApiConfig.IMAGE_BASE_URL + picture?.url
                        : picture?.url,
                      priority: FastImage.priority.high,
                    }
                  : CommonIcons.NoImage
              }
              resizeMode="cover"
              style={
                picture?.url
                  ? styles.ImageHasImageView
                  : [
                      styles.NoImageView,
                      {
                        top: isImageLoading ? 2.5 : undefined,
                      },
                    ]
              }
            />
          </View>
        </Skeleton>
      </View>

      {!isImageLoading && (
        <Pressable
          onPress={() => onChange?.(index)}
          style={[
            styles.BlurViewContainer,
            { borderColor: hasPicture ? colors.White : isDark ? colors.White : colors.Black },
          ]}
        >
          <View style={[styles.addAndDeleteContainerView]}>
            <View style={styles.flexView}>
              <Image
                resizeMode="contain"
                style={[
                  styles.imageView,
                  {
                    tintColor: hasPicture ? colors.White : colors.TextColor,
                    width: hp('1.2%'),
                    height: hp('1.2%'),
                  },
                ]}
                source={hasPicture ? CommonIcons.media_icon : CommonIcons.AddImage}
              />
              <Text style={[styles.addAndRemoveText, { color: hasPicture ? colors.White : colors.TextColor }]}>
                {hasPicture ? 'Change Photo' : 'Add Photo'}
              </Text>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
};

export default memo(EditProfileRenderImageBox);

const styles = StyleSheet.create({
  item: {
    overflow: 'hidden',
    width: '95%',
    height: 150,
    alignItems: 'center',
    borderRadius: hp('1.5%'),
    marginVertical: hp('0.3%'),
  },
  ImageHasImageView: {
    width: '100%',
    height: '100%',
  },
  NoImageView: {
    width: 35,
    height: 35,
    overflow: 'hidden',
    alignSelf: 'center',
    alignItems: 'center',
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
  addAndDeleteContainerView: {},
  flexView: {
    flex: 1,
    flexDirection: 'row',
  },
  imageView: {
    width: hp('1.5%'),
    height: hp('1.5%'),
    alignSelf: 'center',
    justifyContent: 'center',
    marginRight: hp('0.5%'),
  },
  addAndRemoveText: {
    alignSelf: 'center',
    textAlign: 'center',
    ...GROUP_FONT.h3,
    fontSize: 10,
  },
});
