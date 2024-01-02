/* eslint-disable react-hooks/exhaustive-deps */
import React, {FC, useEffect} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../Common/CommonIcons';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import useCalculateAge from '../../../Hooks/useCalculateAge';
import {SwiperCard} from '../../../Types/SwiperCard';
import {DummyImage} from '../../../Config/Setting';

interface RenderCardProps {
  CurrentCardIndex: number;
  card: number;
  setFirstImageLoading: (loading: boolean) => void;
  firstImageLoading: boolean;
  currentImageIndex: number;
  cardData: SwiperCard;
  startInterval: any;
  stopInterval: any;
}

const RenderSwiperCard: FC<RenderCardProps> = ({
  CurrentCardIndex,
  cardData,
  card,
  setFirstImageLoading,
  firstImageLoading,
  currentImageIndex,
  startInterval,
  stopInterval,
}) => {
  const opacity = useSharedValue(0);
  const IsFirstCard = CurrentCardIndex === card;
  const Age = useCalculateAge(cardData?.birthdate);
  const YourInto = ['Cricket', 'Gaming', 'Coding'];

  // useEffect(() => {
  //   const fadeInDuration = 300; // Adjust the duration as needed

  //   translateX.value = withTiming(0, {}, finished => {
  //     if (finished) {
  //       runOnJS(setFirstImageLoading)(false);
  //       // Reset opacity for the next fade-in
  //       opacity.value = withTiming(1, {duration: 200});
  //     }
  //   });

  //   runOnJS(setFirstImageLoading)(true);

  //   // Simulate loading delay
  //   setTimeout(() => {
  //     opacity.value = withTiming(1, {duration: fadeInDuration});
  //   }, 200);

  //   // Simulate loading delay
  //   setTimeout(() => {
  //     runOnJS(setFirstImageLoading)(false);
  //     translateX.value = withTiming(0, {duration: 600}); // Slide out the image
  //   }, 700);
  // }, [currentImageIndex]);

  useEffect(() => {
    opacity.value = withSpring(1, {}, finished => {
      if (finished) {
        runOnJS(setFirstImageLoading)(false);
      }
    });

    runOnJS(setFirstImageLoading)(true);

    setTimeout(() => {
      runOnJS(setFirstImageLoading)(false);
      opacity.value = withSpring(1);
    }, 0);
  }, [currentImageIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  }, [opacity.value]);

  const handlePressIn = () => {
    stopInterval();
  };

  const handlePressOut = () => {
    startInterval();
  };

  const ImageLoading = () => {
    setFirstImageLoading(true);
    stopInterval();
  };

  const ImageLoaded = () => {
    setFirstImageLoading(false);
    startInterval();
  };

  const getCardImageUrl = (
    ImageCardData: any,
    isFirstCard: any,
    currentCardNumber: any,
  ) => {
    const defaultImageUrl = DummyImage;
    const imageIndex = isFirstCard ? currentCardNumber : 0;

    return (
      (ImageCardData?.recent_pik[imageIndex] &&
        `${ApiConfig.IMAGE_BASE_URL}${ImageCardData?.recent_pik[imageIndex]}`) ||
      defaultImageUrl
    );
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <View style={styles.card}>
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <FastImage
            onLoadStart={ImageLoading}
            onLoad={ImageLoaded}
            resizeMode="cover"
            source={{
              uri: getCardImageUrl(cardData, IsFirstCard, currentImageIndex),
            }}
            style={styles.ImageStyle}
          />
        </Animated.View>

        <View style={styles.CardBottomDetailView}>
          <View style={styles.TitleView}>
            <Text style={styles.TitleText}>
              {`${cardData?.full_name ? cardData?.full_name : 'User'}, ${
                Age ? Age : 0
              }`}
            </Text>
            <Image
              source={CommonIcons.Verification_Icon}
              style={styles.VerifyIconImage}
            />
          </View>

          <View style={styles.LocationView}>
            <Image
              tintColor={'rgba(198, 198, 198, 1)'}
              style={styles.LocationIcon}
              source={CommonIcons.Location}
            />
            <Text numberOfLines={1} style={styles.LocationText}>
              {cardData?.city || 'Somewhere in earth'}
            </Text>
          </View>

          <View style={styles.MultipleBoxFlexView}>
            {YourInto?.map((interestedInItem, index) => {
              return (
                <View key={index} style={styles.MultipleBoxView}>
                  <Text style={styles.MultipleDetailText} key={index}>
                    {interestedInItem}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {firstImageLoading && (
          <View style={styles.LoadingImageView}>
            <ActivityIndicator size="large" color={COLORS.Primary} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RenderSwiperCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    zIndex: 9999,
    justifyContent: 'center',
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  ImageStyle: {
    width: '100%',
    height: '100%',
  },
  CardBottomDetailView: {
    bottom: 0,
    zIndex: 9999,
    width: '90%',
    alignSelf: 'center',
    marginVertical: 15,
    position: 'absolute',
  },
  TitleView: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
  },
  TitleText: {
    ...GROUP_FONT.h2,
    color: COLORS.White,
  },
  VerifyIconImage: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  LocationView: {
    width: '85%',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  LocationIcon: {
    width: hp('2%'),
    height: hp('2%'),
  },
  LocationText: {
    width: '80%',
    marginLeft: hp('0.5%'),
    fontFamily: FONTS.Bold,
    fontSize: hp('1.5%'),
    color: 'rgba(198, 198, 198, 1)',
  },
  MultipleBoxFlexView: {
    flexDirection: 'row',
    width: '85%',
    flexWrap: 'wrap',
  },
  MultipleBoxView: {
    marginTop: hp('1%'),
    borderRadius: hp('2%'),
    borderWidth: hp('0.2%'),
    marginRight: hp('0.5%'),
    paddingHorizontal: hp('0.9%'),
    borderColor: 'rgba(198, 198, 198, 1)',
  },
  MultipleDetailText: {
    fontSize: hp('1.5%'),
    alignSelf: 'flex-end',
    fontFamily: FONTS.Bold,
    justifyContent: 'center',
    paddingVertical: hp('0.8%'),
    color: 'rgba(255, 255, 255, 1)',
  },
  LoadingImageView: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});

// import React, {FC, useRef} from 'react';
// import {
//   ActivityIndicator,
//   Animated,
//   PanResponder,
//   StyleSheet,
//   Text,
//   TouchableWithoutFeedback,
//   View,
// } from 'react-native';
// import FastImage from 'react-native-fast-image';
// import {COLORS, GROUP_FONT} from '../../../Common/Theme';
// import ApiConfig from '../../../Config/ApiConfig';
// import {SwiperCard} from '../../../Types/SwiperCard';

// interface RenderCardProps {
//   CurrentCardIndex: number;
//   card: number;
//   setFirstImageLoading: (loading: boolean) => void;
//   firstImageLoading: boolean;
//   currentImageIndex: number;
//   cardData: SwiperCard;
//   startInterval: any;
//   stopInterval: any;
// }

// const RenderSwiperCard: FC<RenderCardProps> = ({
//   CurrentCardIndex,
//   cardData,
//   card,
//   firstImageLoading,
//   setFirstImageLoading,
//   currentImageIndex,
//   startInterval,
//   stopInterval,
// }) => {
//   //* Press In Stop Timer For Image Looping
//   const handlePressIn = () => {
//     stopInterval();
//     console.log('Press In');
//   };

//   //* Press Out Start Timer For Image Looping
//   const handlePressOut = () => {
//     startInterval();
//     console.log('Press Out');
//   };

//   //* Image Loading Stop Timer
//   const ImageLoading = () => {
//     setFirstImageLoading(true);
//     stopInterval();
//   };

//   //* Image Loaded Start Timer
//   const ImageLoaded = () => {
//     setFirstImageLoading(false);
//     startInterval();
//   };

//   //* Check Card Right And Left Side
//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => {
//         stopInterval();
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         // startInterval();
//         const {dx} = gestureState;
//         console.log(dx);
//         if (dx > 50) {
//           // Swiped right, show next image
//           // You might want to add additional checks to avoid going beyond the array boundaries
//           // For example, check if currentImageIndex < cardData.images.length - 1
//           console.log('LEFT');
//           setFirstImageLoading(true);
//           setTimeout(() => {
//             setFirstImageLoading(false);
//           }, 500); // Simulating loading for demo purposes
//         } else if (dx < -50) {
//           // Swiped left, show previous image
//           // You might want to add additional checks to avoid going below 0
//           // For example, check if currentImageIndex > 0
//           console.log('RIGHT');
//           setFirstImageLoading(true);
//           setTimeout(() => {
//             setFirstImageLoading(false);
//           }, 500); // Simulating loading for demo purposes
//         }
//       },
//     }),
//   ).current;

//   //* Render First Card For Image Animation
//   if (CurrentCardIndex === card) {
//     return (
//       <TouchableWithoutFeedback
//         style={[styles.card]}
//         onPressIn={handlePressIn}
//         onPressOut={handlePressOut}>
//         <Animated.View style={[styles.card]} {...panResponder.panHandlers}>
//           <React.Fragment>
//             <FastImage
//               onLoadStart={ImageLoading}
//               onLoad={ImageLoaded}
//               onLoadEnd={ImageLoaded}
//               resizeMode="cover"
//               source={{
//                 uri: `${
//                   ApiConfig.IMAGE_BASE_URL +
//                   cardData?.recent_pik[currentImageIndex]
//                 }`,
//                 priority: FastImage.priority.high,
//               }}
//               style={styles.ImageStyle}
//             />

//             <View style={styles.CardBottomDetailView}>
//               <View style={styles.TitleView}>
//                 <Text style={styles.TitleText}>
//                   {(cardData?.full_name, cardData?.radius)}
//                 </Text>
//               </View>
//             </View>

//             {firstImageLoading && (
//               <View style={styles.LoadingImageView}>
//                 <ActivityIndicator size="large" color={COLORS.Primary} />
//               </View>
//             )}
//           </React.Fragment>
//         </Animated.View>
//       </TouchableWithoutFeedback>
//     );
//   }

//   //* 2nd Card (Bellow)
//   return (
//     <View style={[styles.card]}>
//       <FastImage
//         resizeMode="cover"
//         source={{
//           uri: `${ApiConfig.IMAGE_BASE_URL + cardData?.recent_pik[0]}`,
//           priority: FastImage.priority.high,
//         }}
//         style={styles.ImageStyle}
//       />
//     </View>
//   );
// };

// export default RenderSwiperCard;

// const styles = StyleSheet.create({
//   card: {
//     flex: 1,
//     justifyContent: 'center',
//     // alignItems: 'center',
//     zIndex: 9999,
//   },
//   topCard: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   ImageStyle: {
//     width: '100%',
//     height: '100%',
//   },
//   CardBottomDetailView: {
//     bottom: 0,
//     zIndex: 9999,
//     width: '90%',
//     alignSelf: 'center',
//     position: 'absolute',
//   },
//   TitleView: {
//     marginVertical: 5,
//     justifyContent: 'center',
//   },
//   TitleText: {
//     ...GROUP_FONT.h2,
//     color: COLORS.White,
//   },

//   // Loader
//   LoadingImageView: {
//     position: 'absolute',
//     justifyContent: 'center',
//     alignSelf: 'center',
//     top: 0,
//     right: 0,
//     bottom: 0,
//     left: 0,
//   },
// });
