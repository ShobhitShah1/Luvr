import Clipboard from '@react-native-clipboard/clipboard';
import React, { useState } from 'react';
import { Image, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import CommonIcons from '../../Common/CommonIcons';
import GradientView from '../../Common/GradientView';
import TextString from '../../Common/TextString';
import { FONTS } from '../../Common/Theme';
import { GradientBorderView } from '../../Components/GradientBorder';
import { APP_NAME } from '../../Config/Setting';
import { useTheme } from '../../Contexts/ThemeContext';
import { useCustomToast } from '../../Utils/toastUtils';
import ProfileAndSettingHeader from '../Profile/Components/ProfileAndSettingHeader';

const QRCodeScreen = () => {
  const { isDark, colors } = useTheme();
  const { showToast } = useCustomToast();

  const [referralCode] = useState('3erfawr234t');

  const handleCopy = async () => {
    try {
      await Clipboard.setString(referralCode);

      showToast(TextString.success.toUpperCase(), 'Referral code copied to clipboard', 'success');
    } catch (error) {
      showToast(TextString.error.toUpperCase(), 'Failed to copy referral code', 'error');
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Join me on ${APP_NAME} and get access to exclusive features! Use my referral code: ${referralCode}\n\nDownload the app now: https://example.com/app`, // Replace with your app's download link
        title: `${APP_NAME} Invitation`,
      });

      if (result.action === Share.sharedAction) {
        showToast(TextString.success.toUpperCase(), 'Referral shared successfully', 'success');
      }
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
              <QRCode value="3erfawr234t" size={125} backgroundColor="transparent" />
            </View>
          </GradientBorderView>

          <GradientBorderView
            gradientProps={{ colors: colors.ButtonGradient }}
            style={[styles.referralContainer, { backgroundColor: isDark ? 'transparent' : colors.White }]}
          >
            <Text style={[styles.referralLabel, { color: colors.TextColor }]}>Referral Code</Text>
            <View
              style={[
                styles.referralCodeBox,
                { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(240, 236, 255, 1)' },
              ]}
            >
              <Text style={[styles.referralCode, { color: colors.TextColor }]}>3erfawr234t</Text>
              <Pressable onPress={handleCopy}>
                <Text style={[styles.copyText, { color: colors.Primary }]}>Copy</Text>
              </Pressable>
            </View>
          </GradientBorderView>

          <Text style={[styles.descriptionText, { color: colors.TextColor }]}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since
          </Text>

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
};

export default QRCodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerText: {
    width: '85%',
    lineHeight: 23,
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
    fontFamily: FONTS.Medium,
  },
  qrContainer: {
    width: 195,
    height: 190,
    borderWidth: 13,
    borderRadius: 38,
    overflow: 'hidden',
    marginBottom: 30,

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.85,
    shadowRadius: 3.84,
    elevation: 10,
  },
  qrCodeWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  referralContainer: {
    width: '95%',
    borderWidth: 1,
    padding: 17,
    borderRadius: 20,
    marginBottom: 30,
    marginTop: 5,
    overflow: 'hidden',
  },
  referralLabel: {
    marginBottom: 8,
    paddingLeft: 5,
    fontSize: 14,
    fontFamily: FONTS.Medium,
  },
  referralCodeBox: {
    marginTop: 3,
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  referralCode: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },
  copyText: {
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
  },
  descriptionText: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 14,
    lineHeight: 23,
    fontFamily: FONTS.Medium,
  },
  shareButton: {
    height: 45,
    width: '45%',
    borderRadius: 25,
    marginBottom: 20,
  },
  pressableButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    width: 18,
    height: 18,
    marginRight: 5,
    resizeMode: 'contain',
  },
  shareText: {
    fontSize: 16,
    fontFamily: FONTS.Medium,
  },
});
