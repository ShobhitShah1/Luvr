import React, { memo } from 'react';
import type { FC } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeModal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';

import CommonIcons from '../../../Common/CommonIcons';
import { COLORS, FONTS, deviceHeightWithStatusbar } from '../../../Common/Theme';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { gradientEnd, gradientStart } from '../../../Config/Setting';
import { useTheme } from '../../../Contexts/ThemeContext';
import type { ReportOrBlockInterface } from '../../../Types/Interface';

const ReportOrBlockModal: FC<ReportOrBlockInterface> = ({
  isVisible,
  setReportAndBlockModal,
  setShowReportModalView,
  onBlockProfileClick,
  ShowReportModalView,
}) => {
  const { colors, isDark } = useTheme();

  const closeModal = () => {
    setReportAndBlockModal(false);
  };

  return (
    <ReactNativeModal
      deviceHeight={deviceHeightWithStatusbar}
      statusBarTranslucent={true}
      useNativeDriver={true}
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      style={styles.modalContainer}
      animationIn="fadeIn"
      animationOut="fadeOut"
    >
      <SafeAreaView style={styles.safeAreaContainer}>
        <GradientBorderView
          style={[
            styles.modalContent,
            { backgroundColor: isDark ? 'rgba(13, 1, 38, 0.9)' : colors.White },
          ]}
        >
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: 10,
            }}
          >
            <Text style={[styles.title, { color: colors.TitleText }]}>Choose an Action</Text>

            <Pressable
              style={styles.closeButton}
              onPress={closeModal}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Image source={CommonIcons.CloseModal} style={styles.closeIcon} />
            </Pressable>
          </View>

          <View style={styles.buttonContainer}>
            <LinearGradient
              start={gradientStart}
              end={gradientEnd}
              colors={isDark ? colors.ButtonGradient : [colors.White, colors.White]}
              style={styles.actionButton}
            >
              <Pressable
                style={styles.button}
                onPress={onBlockProfileClick}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image
                  resizeMode="contain"
                  tintColor={colors.TextColor}
                  style={styles.actionIcon}
                  source={CommonIcons.block_profile_icon}
                />
                <Text style={[styles.actionText, { color: colors.TextColor }]}>Block Profile</Text>
              </Pressable>
            </LinearGradient>

            <LinearGradient
              start={gradientStart}
              end={gradientEnd}
              colors={isDark ? colors.ButtonGradient : [colors.White, colors.White]}
              style={styles.actionButton}
            >
              <Pressable
                onPress={() => {
                  setReportAndBlockModal(false);
                  setShowReportModalView(!ShowReportModalView);
                }}
                style={styles.button}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image
                  resizeMode="contain"
                  tintColor={colors.TextColor}
                  style={styles.actionIcon}
                  source={CommonIcons.report_profile_icon}
                />
                <Text style={[styles.actionText, { color: colors.TextColor }]}>Report Profile</Text>
              </Pressable>
            </LinearGradient>
          </View>

          <Pressable onPress={closeModal} style={styles.cancelButton}>
            <Text style={[styles.cancelText, { color: colors.TextColor }]}>Cancel</Text>
          </Pressable>
        </GradientBorderView>
      </SafeAreaView>
    </ReactNativeModal>
  );
};

export default memo(ReportOrBlockModal);

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 10,
    padding: 15,
  },
  actionIcon: {
    height: 20,
    marginRight: 10,
    width: 20,
  },
  actionText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
  },
  button: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  buttonContainer: {
    gap: 15,
    width: '100%',
  },
  cancelButton: {
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cancelText: {
    fontFamily: FONTS.Medium,
    fontSize: 15,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 10,
    zIndex: 10,
  },
  closeIcon: {
    height: 26,
    width: 26,
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
  },
  modalContent: {
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 2,
    width: Dimensions.get('screen').width - 50,
  },
  safeAreaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontFamily: FONTS.Bold,
    fontSize: 19,
    marginVertical: 10,
    textAlign: 'center',
  },
});
