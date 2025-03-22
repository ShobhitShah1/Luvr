import React, { FC } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonIcons from '../../../Common/CommonIcons';
import { COLORS, FONTS, deviceHeightWithStatusbar } from '../../../Common/Theme';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { ReportOrBlockInterface } from '../../../Types/Interface';
import { useTheme } from '../../../Contexts/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

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
            {
              backgroundColor: isDark ? 'rgba(13, 1, 38, 0.9)' : colors.White,
            },
          ]}
        >
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
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
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              colors={isDark ? colors.ButtonGradient : [colors.White, colors.White]}
              style={styles.actionButton}
            >
              <Pressable
                style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}
                onPress={onBlockProfileClick}
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
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              colors={isDark ? colors.ButtonGradient : [colors.White, colors.White]}
              style={styles.actionButton}
            >
              <Pressable
                onPress={() => {
                  setReportAndBlockModal(false);
                  setShowReportModalView(!ShowReportModalView);
                }}
                style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}
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

export default ReportOrBlockModal;

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeAreaContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: Dimensions.get('screen').width - 50,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 10,
  },
  closeIcon: {
    width: 26,
    height: 26,
  },
  title: {
    fontSize: 19,
    fontFamily: FONTS.Bold,
    marginVertical: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,

    // borderColor: 'rgba(100, 100, 100, 0.2)',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 2,
  },
  actionIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  actionText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
  },
  cancelButton: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelText: {
    fontSize: 15,
    fontFamily: FONTS.Medium,
  },
});
