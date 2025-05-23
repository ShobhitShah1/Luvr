import Clipboard from '@react-native-clipboard/clipboard';
import React, { memo, useState } from 'react';
import { Image, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';

import CommonIcons from '../../Common/CommonIcons';
import GradientView from '../../Common/GradientView';
import TextString from '../../Common/TextString';
import { FONTS } from '../../Common/Theme';
import { GradientBorderView } from '../../Components/GradientBorder';
import ApiConfig from '../../Config/ApiConfig';
import { APP_NAME } from '../../Config/Setting';
import { useTheme } from '../../Contexts/ThemeContext';
import { useUserData } from '../../Contexts/UserDataContext';
import { useCustomToast } from '../../Utils/toastUtils';
import ProfileAndSettingHeader from '../Profile/Components/profile-and-setting-header';

const whatUserGet = [
  'Like and dislike',
  'Ability to verify Account',
  'This is a free version which should include profile creation',
];

function QRCodeScreen() {
  const { isDark, colors } = useTheme();
  const { showToast } = useCustomToast();
  const { userData } = useUserData();

  const [referralCode] = useState((userData?._id && userData?._id?.toString()?.slice(-8)) || '');

  const handleCopy = () => {
    try {
      Clipboard.setString(referralCode);

      showToast(TextString.success.toUpperCase(), 'Referral code copied to clipboard', 'success');
    } catch (error) {
      showToast(TextString.error.toUpperCase(), 'Failed to copy referral code', 'error');
    }
  };

  const handleShare = async () => {
    try {
      Share.share({
        message: `Join me on ${APP_NAME} and get access to exclusive features! Use my referral code: ${referralCode}\n\nDownload the app now: ${ApiConfig.PLAY_STORE}`,
        title: `${APP_NAME} Invitation`,
      });
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), error?.message?.toString(), 'error');
    }
  };

  return (
    <GradientView>
      <View style={styles.container}>
        <ProfileAndSettingHeader Title="Free Membership" showRightIcon={false} />

        <View style={styles.contentContainer}>
          <Text style={[styles.headerText, { color: colors.TextColor }]}>
            Share 3 people, chance to use gold membership plan for 3 month
          </Text>

          <GradientBorderView
            gradientProps={{ colors: colors.ButtonGradient }}
            style={[styles.qrContainer, { shadowColor: colors.Primary }]}
          >
            <View style={[styles.qrCodeWrapper, { backgroundColor: colors.White }]}>
              <QRCode value={referralCode} size={128} backgroundColor="transparent" />
            </View>
          </GradientBorderView>

          <GradientBorderView
            gradientProps={{ colors: colors.ButtonGradient }}
            style={[styles.referralContainer, { backgroundColor: 'transparent' }]}
          >
            <Text style={[styles.referralLabel, { color: colors.TextColor }]}>Referral Code</Text>
            <View
              style={[
                styles.referralCodeBox,
                { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : colors.White },
              ]}
            >
              <Text style={[styles.referralCode, { color: colors.TextColor }]}>{referralCode}</Text>
              <Pressable onPress={handleCopy}>
                <Text style={[styles.copyText, { color: colors.Primary }]}>Copy</Text>
              </Pressable>
            </View>
          </GradientBorderView>

          <View style={{ alignSelf: 'flex-start', gap: 15, marginBottom: 30, marginHorizontal: 5 }}>
            {whatUserGet.map(res => (
              <View
                key={res?.toString()}
                style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}
              >
                <Image
                  source={CommonIcons.Check}
                  style={{ width: 10, height: 10 }}
                  tintColor={colors.Primary}
                />
                <Text style={[styles.descriptionText, { color: colors.TextColor }]}>
                  {res?.toString()}
                </Text>
              </View>
            ))}
          </View>

          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={colors.ButtonGradient}
            style={styles.shareButton}
          >
            <Pressable onPress={handleShare} style={styles.pressableButton}>
              <Image source={CommonIcons.ic_share} style={styles.shareIcon} />
              <Text style={[styles.shareText, { color: colors.ButtonText }]}>Share</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </View>
    </GradientView>
  );
}

export default memo(QRCodeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  copyText: {
    fontFamily: FONTS.Bold,
    fontSize: 14,
  },
  descriptionText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 13,
  },
  headerText: {
    alignSelf: 'center',
    fontFamily: FONTS.Medium,
    fontSize: 14,
    lineHeight: 23,
    marginBottom: 20,
    textAlign: 'center',
    width: '85%',
  },
  pressableButton: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  qrCodeWrapper: {
    alignItems: 'center',
    borderRadius: 22,
    flex: 1,
    justifyContent: 'center',
  },
  qrContainer: {
    borderRadius: 38,
    borderWidth: 13,
    elevation: 10,
    height: 195,
    marginBottom: 30,
    overflow: 'hidden',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.85,
    shadowRadius: 3.84,
    width: 200,
  },
  referralCode: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
  },
  referralCodeBox: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    marginTop: 3,
    paddingHorizontal: 15,
  },
  referralContainer: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 25,
    marginTop: 5,
    overflow: 'hidden',
    padding: 17,
    width: '95%',
  },
  referralLabel: {
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    marginBottom: 8,
    paddingLeft: 5,
  },
  shareButton: {
    borderRadius: 25,
    height: 53,
    marginBottom: 20,
    width: '45%',
  },
  shareIcon: {
    height: 18,
    marginRight: 5,
    resizeMode: 'contain',
    width: 18,
  },
  shareText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16.5,
  },
});
