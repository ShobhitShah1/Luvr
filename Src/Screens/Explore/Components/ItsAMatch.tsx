/* eslint-disable react-native/no-inline-styles */
import {Image} from 'moti';
import React, {FC, useState} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import CommonIcons from '../../../Common/CommonIcons';
import {ProfileType} from '../../../Types/ProfileType';
import ApiConfig from '../../../Config/ApiConfig';
import {ActiveOpacity, COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import {SwiperCard} from '../../../Types/SwiperCard';
import {APP_NAME, DummyImage} from '../../../Config/Setting';
import CommonImages from '../../../Common/CommonImages';
import {BlurView} from '@react-native-community/blur';

interface ItsAMatchProps {
  user: SwiperCard | undefined;
  onSayHiClick: () => void;
  setItsMatch: React.Dispatch<React.SetStateAction<boolean>>;
}

const ItsAMatch: FC<ItsAMatchProps> = ({user, onSayHiClick, setItsMatch}) => {
  const userData = useSelector((state: any) => state?.user);
  const [shoot, setShoot] = useState(true);
  const [IsImageLoading, setIsImageLoading] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}>
      <StatusBar
      // translucent
      // backgroundColor={'rgba(0,0,0,0.5)'}
      // barStyle={'light-content'}
      />
      {/* <BlurView
        style={{
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignSelf: 'center',
          width: '100%',
        }}
        blurAmount={2}
        blurType="materialDark"> */}
      <ImageBackground
        imageStyle={styles.BackgroundImageStyle}
        source={CommonImages.ItsAMatch}
        style={styles.BackgroundImageContainer}>
        <View style={{}}>
          <View style={styles.ItsAMatchTextView}>
            <Text style={styles.ItsAMatchText}>It’s a match!</Text>
            <Text style={styles.ItsAMatchDescriptionText}>
              You and {user?.full_name || `${APP_NAME} User`} have liked each
              other.
            </Text>
          </View>
          <View style={styles.MatchedProfileView}>
            <FastImage
              resizeMode="cover"
              onLoadStart={() => setIsImageLoading(true)}
              onLoadEnd={() => setIsImageLoading(false)}
              onLoad={() => setIsImageLoading(false)}
              source={{
                uri:
                  userData?.userData?.recent_pik &&
                  userData?.userData?.recent_pik?.length !== 0
                    ? ApiConfig.IMAGE_BASE_URL +
                      userData?.userData?.recent_pik[0]
                    : DummyImage,
                priority: FastImage.priority.high,
              }}
              style={[styles.UserProfileImage]}
            />
            <Image
              source={CommonIcons.like_button}
              style={[styles.LikeButtonImage]}
            />
            <FastImage
              resizeMode="cover"
              onLoadStart={() => setIsImageLoading(true)}
              onLoadEnd={() => setIsImageLoading(false)}
              onLoad={() => setIsImageLoading(false)}
              source={{
                uri:
                  user?.recent_pik?.length !== 0
                    ? ApiConfig.IMAGE_BASE_URL + user?.recent_pik[0]
                    : DummyImage,
                priority: FastImage.priority.high,
              }}
              style={[styles.UserProfileImage]}
            />
          </View>
          <View style={styles.ButtonsContainerView}>
            <TouchableOpacity
              onPress={onSayHiClick}
              activeOpacity={ActiveOpacity}
              style={styles.SendMessageButton}>
              <Text style={styles.SendMessageText}>Send a message</Text>
            </TouchableOpacity>
            <Text
              onPress={() => setItsMatch(false)}
              style={styles.KeepSwipingText}>
              Keep swiping
            </Text>
          </View>
        </View>
      </ImageBackground>
      {/* </BlurView> */}
    </View>
  );
};

export default ItsAMatch;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
  },
  BackgroundContainer: {
    width: '80%',
    height: 250,
    padding: 10,
    borderRadius: 15,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  SubContainer: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  MatchedProfileView: {
    width: '90%',
    marginVertical: 10,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  UserProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 500,
    borderWidth: 2,
    borderColor: COLORS.White,
    marginHorizontal: -33,
  },
  LikeButtonImage: {
    width: 40,
    height: 40,
    right: 5,
    zIndex: 9999,
  },
  BackgroundImageStyle: {
    width: '100%',
    alignSelf: 'center',
    opacity: 1,
    // backgroundColor: 'transparent',
  },
  BackgroundImageContainer: {
    // backgroundColor: 'transparent',
    width: '90%',
    paddingTop: 10,
    paddingBottom: 20,
    overflow: 'hidden',
    borderRadius: 15,
    alignSelf: 'center',
    zIndex: 9999,
    opacity: 1,
  },
  ItsAMatchTextView: {
    marginVertical: 5,
  },
  ItsAMatchText: {
    fontSize: 28,
    textAlign: 'center',
    color: COLORS.Primary,
    fontFamily: FONTS.Pacifico_Regular,
  },
  ItsAMatchDescriptionText: {
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
    color: COLORS.Black,
    fontSize: 14.5,
  },
  ButtonsContainerView: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  SendMessageButton: {
    width: 220,
    height: 50,
    marginVertical: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.Primary,
  },
  SendMessageText: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.White,
    fontFamily: FONTS.SemiBold,
  },
  KeepSwipingText: {
    marginVertical: 5,
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
  },
});
