/* eslint-disable react-native/no-inline-styles */
import React, { FC, memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';
import CommonImages from '../../../../Common/CommonImages';
import { COLORS, GROUP_FONT, SIZES } from '../../../../Common/Theme';
import { BlurredBackdrop } from '../../../../Components/BlurredBackdrop';
import { gradientEnd, gradientStart } from '../../../../Config/Setting';
import { useTheme } from '../../../../Contexts/ThemeContext';

interface ChooseFromModalProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  OnOptionPress: (option: string) => void;
}

const ChooseFromModal: FC<ChooseFromModalProps> = ({ isModalVisible, toggleModal, OnOptionPress }) => {
  const { colors, isDark } = useTheme();

  return (
    <Modal
      hasBackdrop
      testID={'modal'}
      backdropColor="transparent"
      animationIn={'slideInUp'}
      animationInTiming={300}
      animationOutTiming={300}
      backdropOpacity={1}
      customBackdrop={<BlurredBackdrop toggleModal={toggleModal} />}
      animationOut={'slideOutDown'}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      onBackButtonPress={toggleModal}
      onBackdropPress={toggleModal}
      isVisible={isModalVisible}
      swipeDirection={['up', 'left', 'right', 'down']}
      style={styles.container}
    >
      <LinearGradient
        start={gradientStart}
        end={gradientEnd}
        colors={isDark ? ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.35)'] : [colors.White, colors.White]}
        style={styles.ModalView}
      >
        <View style={{}}>
          <View style={styles.TopViewContainer}>
            <View style={styles.TopTitleViewContainer}>
              <Text style={[styles.TitleText, { color: colors.TitleText }]}>Add photos from</Text>
              <Text style={[styles.DescriptionText, { color: colors.TextColor }]}>Select source for upload photos</Text>
            </View>

            <Pressable
              hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
              style={styles.CloseButton}
              onPress={toggleModal}
            >
              <Image source={CommonIcons.CloseModal} style={styles.CloseButtonIcon} />
            </Pressable>
          </View>

          <View style={styles.ButtonContainerView}>
            <Pressable
              onPress={() => OnOptionPress('Gallery')}
              style={[styles.ButtonView, { backgroundColor: isDark ? colors.White : 'rgba(255, 155, 82, 1)' }]}
            >
              <Image
                resizeMode="contain"
                tintColor={isDark ? colors.Black : colors.White}
                source={CommonImages.Gallery_Icon}
                style={styles.IconView}
              />
              <View style={styles.TextView}>
                <Text style={[styles.Title, { color: isDark ? colors.Black : colors.White }]}>Upload from</Text>
                <Text style={[styles.Pick, { color: isDark ? colors.Black : colors.White }]}>Gallery</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => OnOptionPress('Camera')}
              style={[styles.ButtonView, { backgroundColor: isDark ? colors.White : 'rgba(95, 197, 255, 1)' }]}
            >
              <Image
                resizeMode="contain"
                tintColor={isDark ? colors.Black : colors.White}
                source={CommonImages.Camera_Icon}
                style={styles.IconView}
              />
              <View style={styles.TextView}>
                <Text style={[styles.Title, { color: isDark ? colors.Black : colors.White }]}>Capture from</Text>
                <Text style={[styles.Pick, { color: isDark ? colors.Black : colors.White }]}>Camera</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </Modal>
  );
};

export default memo(ChooseFromModal);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  ModalView: {
    width: '85%',
    bottom: hp('4%'),
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    paddingVertical: hp('2.5%'),
  },

  TopViewContainer: {
    width: '100%',
    paddingHorizontal: hp('2.7%'),
    marginBottom: hp('3%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  TopTitleViewContainer: {
    width: '80%',
  },
  TitleText: {
    ...GROUP_FONT.h2,
  },
  DescriptionText: {
    ...GROUP_FONT.body3,
    fontSize: 13,
    top: 3,
  },
  CloseButton: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  CloseButtonIcon: {
    justifyContent: 'center',
    width: 23,
    height: 23,
  },

  ButtonContainerView: {
    borderRadius: SIZES.radius,
  },
  ButtonView: {
    width: '80%',
    height: hp('7.5%'),
    overflow: 'hidden',
    alignSelf: 'center',
    marginVertical: hp(1),
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.Primary,
  },
  IconView: {
    width: hp('4.5%'),
    height: hp('4.5%'),
    alignSelf: 'center',
    justifyContent: 'center',
  },

  TextView: {
    justifyContent: 'center',
    // alignSelf:'center',
    marginHorizontal: hp('1.6%'),
  },
  Title: {
    ...GROUP_FONT.h4,
    color: COLORS.White,
    fontSize: 13,
    marginHorizontal: hp('1%'),
  },
  Pick: {
    ...GROUP_FONT.h3,
    color: COLORS.White,
    fontSize: 12,
    marginHorizontal: hp('1%'),
  },
  blurContainer: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  blurView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
