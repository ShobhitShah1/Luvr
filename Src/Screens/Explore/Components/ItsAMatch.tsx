import { Image } from 'moti';
import React, { FC, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeModal from 'react-native-modal';
import { useSelector } from 'react-redux';
import CommonIcons from '../../../Common/CommonIcons';
import { COLORS, deviceHeightWithStatusbar, FONTS } from '../../../Common/Theme';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { BlurredBackdrop } from '../../../Components/ReportUserModalView';
import ApiConfig from '../../../Config/ApiConfig';
import { APP_NAME, DummyImage } from '../../../Config/Setting';
import { useTheme } from '../../../Contexts/ThemeContext';
import { ProfileType } from '../../../Types/ProfileType';

interface ItsAMatchProps {
  user: ProfileType | null;
  onSayHiClick: () => void;
  setItsMatch: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseModalClick: () => void;
  onClose: () => void;
  isVisible: boolean;
}

const ItsAMatch: FC<ItsAMatchProps> = ({ user, onSayHiClick, onCloseModalClick, onClose, isVisible }) => {
  const { colors, isDark } = useTheme();

  const userData = useSelector((state: any) => state?.user);

  const myProfile = useMemo(() => {
    return userData?.userData?.recent_pik && userData?.userData?.recent_pik?.length !== 0
      ? ApiConfig.IMAGE_BASE_URL + userData?.userData?.recent_pik[0]
      : DummyImage;
  }, [userData]);

  const likedProfile = useMemo(() => {
    return user?.recent_pik?.length !== 0 ? ApiConfig.IMAGE_BASE_URL + user?.recent_pik[0] : DummyImage;
  }, [user]);

  return (
    <ReactNativeModal
      isVisible={isVisible}
      customBackdrop={<BlurredBackdrop />}
      statusBarTranslucent={true}
      deviceHeight={deviceHeightWithStatusbar}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      hasBackdrop={true}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={[styles.modalContainer, { backgroundColor: isDark ? 'rgba(13, 1, 38, 0.7)' : 'rgba(18, 18, 19, 0.65)' }]}
    >
      <GradientBorderView
        style={[
          styles.BackgroundImageContainer,
          {
            borderWidth: 2,
            backgroundColor: isDark ? 'rgba(13, 1, 38, 0.5)' : colors.White,
          },
        ]}
      >
        <View style={styles.BackgroundImageContainer}>
          <View>
            <View style={styles.ItsAMatchTextView}>
              <Text style={[styles.ItsAMatchText, { color: colors.TitleText }]}>It’s a match!</Text>
              <Text style={[styles.ItsAMatchDescriptionText, { color: colors.TextColor }]}>
                You and {user?.full_name || `${APP_NAME} User`} have liked each other.
              </Text>
            </View>
            <View style={styles.MatchedProfileView}>
              <Image resizeMode="cover" source={{ uri: myProfile }} style={[styles.UserProfileImage]} />
              <Image source={CommonIcons.like_button} style={[styles.LikeButtonImage]} />
              <Image resizeMode="cover" source={{ uri: likedProfile }} style={[styles.UserProfileImage]} />
            </View>
            <View style={styles.ButtonsContainerView}>
              <LinearGradient
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={colors.ButtonGradient}
                style={styles.SendMessageButton}
              >
                <Pressable onPress={onSayHiClick} style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.SendMessageText}>Send a message</Text>
                </Pressable>
              </LinearGradient>
              <Text onPress={onCloseModalClick} style={[styles.KeepSwipingText, { color: colors.TextColor }]}>
                Keep swiping
              </Text>
            </View>
          </View>
        </View>
      </GradientBorderView>
    </ReactNativeModal>
  );
};

export default ItsAMatch;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    margin: 0,
  },
  container: {
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
  },
  BackgroundImageContainer: {
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
