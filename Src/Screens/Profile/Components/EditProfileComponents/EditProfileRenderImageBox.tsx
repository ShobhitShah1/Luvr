import FastImage from '@d11/react-native-fast-image';
import { Skeleton } from 'moti/skeleton';
import React, { memo, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
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
  isLoading?: boolean;
};

const EditProfileRenderImageBox: React.FC<EditProfileRenderImageBoxProps> = ({
  picture,
  isLoading,
}) => {
  const { isDark, colors } = useTheme();
  const hasPicture = useMemo(() => {
    return picture?.url;
  }, [picture?.url]);

  const [IsImageLoading, setIsImageLoading] = useState<boolean>(false);

  return (
    <View
      style={[styles.item, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : colors.White }]}
    >
      <View style={styles.UserImageContainer}>
        <Skeleton
          width="100%"
          height="100%"
          colors={colors.LoaderGradient}
          show={!!((IsImageLoading || isLoading) && hasPicture)}
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
                        top: IsImageLoading ? 2.5 : undefined,
                      },
                    ]
              }
            />
          </View>
        </Skeleton>
      </View>

      {!IsImageLoading && !hasPicture && (
        <View
          style={[
            styles.BlurViewContainer,
            { borderColor: hasPicture ? colors.White : isDark ? colors.White : colors.Black },
          ]}
        >
          <View style={styles.addAndDeleteContainerView}>
            <View style={styles.flexView}>
              <Image
                resizeMode="cover"
                style={[
                  styles.imageView,
                  {
                    tintColor: hasPicture ? colors.White : colors.TextColor,
                    width: hasPicture ? hp('1.4%') : hp('1.4%'),
                    height: hasPicture ? hp('1.4%') : hp('1.4%'),
                  },
                ]}
                source={hasPicture ? CommonIcons.DeleteImage : CommonIcons.AddImage}
              />
              <Text
                style={[
                  styles.addAndRemoveText,
                  { color: hasPicture ? colors.White : colors.TextColor },
                ]}
              >
                {hasPicture ? 'Delete Photo' : 'Add Photo'}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default memo(EditProfileRenderImageBox);

const styles = StyleSheet.create({
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

  ImageHasImageView: {
    height: '100%',
    width: '100%',
  },
  NoImageView: {
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 15,
    height: 35,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 35,
  },
  UserImageContainer: {
    borderRadius: hp('1.5%'),
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  addAndDeleteContainerView: {},
  addAndRemoveText: {
    alignSelf: 'center',
    textAlign: 'center',
    ...GROUP_FONT.h3,
    fontSize: 11,
  },
  flexView: {
    flex: 1,
    flexDirection: 'row',
  },
  imageView: {
    alignSelf: 'center',
    height: hp('1.5%'),
    justifyContent: 'center',
    marginRight: hp('0.5%'),
    width: hp('1.5%'),
  },
  item: {
    alignItems: 'center',
    borderRadius: hp('1.5%'),
    height: 150,
    marginVertical: hp('0.3%'),
    overflow: 'hidden',
    width: '95%',
  },
});
