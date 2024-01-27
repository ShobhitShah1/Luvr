/* eslint-disable react-native/no-inline-styles */
import {Skeleton} from 'moti/skeleton';
import React, {useState} from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';
import {COLORS, GROUP_FONT, SIZES} from '../../../../Common/Theme';
import ApiConfig from '../../../../Config/ApiConfig';
import FastImage from 'react-native-fast-image';
import {BlurView} from '@react-native-community/blur';

type Picture = {
  name: string;
  type: string;
  key: string;
  url: string;
};

type EditProfileRenderImageBoxProps = {
  picture: Picture;
  onDelete?: () => void;
  onAdd?: () => void;
};

const EditProfileRenderImageBox: React.FC<EditProfileRenderImageBoxProps> = ({
  picture,
}) => {
  const hasPicture = !!picture?.url;
  const [IsImageLoading, setIsImageLoading] = useState<boolean>(false);
  return (
    <View style={styles.item} key={picture?.url}>
      <Animated.View style={styles.UserImageContainer}>
        <Skeleton
          width={'100%'}
          height={'100%'}
          show={IsImageLoading ? true : false}
          colors={COLORS.LoaderGradient}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
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
      </Animated.View>

      {!IsImageLoading && (
        <View
          style={[
            styles.BlurViewContainer,
            {
              borderColor: hasPicture ? COLORS.White : COLORS.Black,
            },
          ]}>
          {/* <BlurView
            // blurType="light"
            blurAmount={1}
            style={styles.BlurView}
            overlayColor="#00000000"
            reducedTransparencyFallbackColor="#00000000"> */}
          <View style={[styles.AddAndDeleteContainerView]}>
            <View style={styles.FlexView}>
              <Image
                resizeMode="cover"
                style={[
                  styles.ImageView,
                  {
                    tintColor: hasPicture ? COLORS.White : COLORS.Black,
                    width: hasPicture ? hp('1.4%') : hp('1.4%'),
                    height: hasPicture ? hp('1.4%') : hp('1.4%'),
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
          {/* </BlurView> */}
        </View>
      )}
    </View>
  );
};

export default EditProfileRenderImageBox;

const styles = StyleSheet.create({
  item: {
    overflow: 'hidden',
    width: '95%',
    height: 150,
    alignItems: 'center',
    // justifyContent: 'center',
    borderRadius: hp('1.5%'),
    marginVertical: hp('0.3%'),
    backgroundColor: COLORS.White,
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
    // paddingHorizontal: 10,
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
    // backgroundColor: 'red',
    // backgroundColor: 'transparent',
  },
  FlexView: {
    flex: 1,
    flexDirection: 'row',
  },
  ImageView: {
    width: hp('1.5%'),
    height: hp('1.5%'),
    alignSelf: 'center',
    justifyContent: 'center',
    marginRight: hp('0.5%'),
  },
  AddAndRemoveText: {
    alignSelf: 'center',
    textAlign: 'center',
    ...GROUP_FONT.h3,
    fontSize: 11,
  },
});

// /* eslint-disable react-native/no-inline-styles */
// import React, {useState} from 'react';
// import {
//   ActivityIndicator,
//   Animated,
//   Image,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import CommonIcons from '../../../../Common/CommonIcons';
// import {COLORS, GROUP_FONT, SIZES} from '../../../../Common/Theme';

// type Picture = {
//   name: string;
//   type: string;
//   key: string;
//   url: string;
// };

// type EditProfileRenderImageBoxProps = {
//   picture: Picture;
//   onDelete?: () => void;
//   onAdd?: () => void;
// };

// const EditProfileRenderImageBox: React.FC<EditProfileRenderImageBoxProps> = ({
//   picture,
// }) => {
//   const hasPicture = !!picture.url;
//   const [IsImageLoading, setIsImageLoading] = useState<boolean>(false);
//   return (
//     <View style={styles.item} key={picture?.url}>
//       <Animated.View style={styles.UserImageContainer}>
//         {IsImageLoading && (
//           <ActivityIndicator
//             color={COLORS.Primary}
//             size={23}
//             style={{
//               zIndex: 9999,
//               position: 'absolute',
//               justifyContent: 'center',
//               alignSelf: 'center',
//             }}
//           />
//         )}
//         <Image
//           onLoadStart={() => setIsImageLoading(true)}
//           onLoad={() => setIsImageLoading(false)}
//           source={picture?.url ? {uri: picture?.url} : CommonIcons.NoImage}
//           resizeMode="cover"
//           style={picture?.url ? styles.ImageHasImageView : styles.NoImageView}
//         />
//       </Animated.View>

//       <View
//         style={[
//           styles.BlurViewContainer,
//           {
//             borderColor: hasPicture ? COLORS.White : COLORS.Black,
//           },
//         ]}>
//         {/* <BlurView
//           // blurType="light"
//           blurAmount={1}
//           style={styles.BlurView}
//           overlayColor="#00000000"
//           reducedTransparencyFallbackColor="#00000000"> */}
//         <View style={[styles.AddAndDeleteContainerView]}>
//           <View style={styles.FlexView}>
//             <Image
//               resizeMode="cover"
//               style={[
//                 styles.ImageView,
//                 {
//                   tintColor: hasPicture ? COLORS.White : COLORS.Black,
//                   width: hasPicture ? hp('1.3%') : hp('1.4%'),
//                   height: hasPicture ? hp('1.3%') : hp('1.4%'),
//                 },
//               ]}
//               source={
//                 hasPicture ? CommonIcons.DeleteImage : CommonIcons.AddImage
//               }
//             />
//             <Text
//               style={[
//                 styles.AddAndRemoveText,
//                 {
//                   color: hasPicture ? COLORS.White : COLORS.Black,
//                   fontSize: hasPicture ? 11 : 12,
//                 },
//               ]}>
//               {hasPicture ? 'Delete Photo' : 'Add Photo'}
//             </Text>
//           </View>
//         </View>
//         {/* </BlurView> */}
//       </View>
//     </View>
//   );
// };

// export default EditProfileRenderImageBox;

// const styles = StyleSheet.create({
//   item: {
//     overflow: 'hidden',
//     width: '95%',
//     height: 150,
//     alignItems: 'center',
//     // justifyContent: 'center',
//     borderRadius: hp('1.5%'),
//     marginVertical: hp('0.3%'),
//     backgroundColor: COLORS.White,
//   },
//   ImageHasImageView: {
//     width: '100%',
//     height: '100%',
//   },
//   NoImageView: {
//     width: 35,
//     height: 35,
//     overflow: 'hidden',
//     alignSelf: 'center',
//     justifyContent: 'center',
//     bottom: 15,
//   },
//   item_text: {
//     ...GROUP_FONT.h4,
//   },
//   UserImageContainer: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     overflow: 'hidden',
//     borderRadius: hp('1.5%'),
//     justifyContent: 'center',
//   },
//   ImageAddAndDeleteView: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignSelf: 'center',
//   },
//   BlurViewContainer: {
//     flex: 1,
//     bottom: 10,
//     height: 35,
//     // paddingHorizontal: 10,
//     width: '85%',
//     overflow: 'hidden',
//     alignSelf: 'center',
//     position: 'absolute',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: hp('0.13%'),
//     borderRadius: SIZES.radius,
//   },
//   BlurView: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     alignSelf: 'center',
//     overflow: 'hidden',
//     borderWidth: 1,
//     justifyContent: 'center',
//   },
//   AddAndDeleteContainerView: {
//     // backgroundColor: 'red',
//     // backgroundColor: 'transparent',
//   },
//   FlexView: {
//     flex: 1,
//     flexDirection: 'row',
//   },
//   ImageView: {
//     width: hp('1.5%'),
//     height: hp('1.5%'),
//     alignSelf: 'center',
//     justifyContent: 'center',
//     marginRight: hp('0.5%'),
//   },
//   AddAndRemoveText: {
//     alignSelf: 'center',
//     textAlign: 'center',
//     ...GROUP_FONT.h3,
//     fontSize: 12,
//   },
// });
