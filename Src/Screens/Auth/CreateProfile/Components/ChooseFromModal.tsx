import { BlurView } from '@react-native-community/blur';
import React, { memo } from 'react';
import type { FC } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import CommonIcons from '../../../../Common/CommonIcons';
import CommonImages from '../../../../Common/CommonImages';
import GradientView from '../../../../Common/GradientView';
import { COLORS, GROUP_FONT, SIZES } from '../../../../Common/Theme';
import { gradientEnd, gradientStart } from '../../../../Config/Setting';
import { useTheme } from '../../../../Contexts/ThemeContext';

interface ChooseFromModalProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  OnOptionPress: (option: string) => void;
}

function BlurredBackdrop({ toggleModal }: { toggleModal: () => void }) {
  return (
    <Pressable onPress={toggleModal} style={styles.blurContainer}>
      <BlurView
        style={styles.blurView}
        blurAmount={1}
        blurType="dark"
        reducedTransparencyFallbackColor="transparent"
      />
    </Pressable>
  );
}

const ChooseFromModal: FC<ChooseFromModalProps> = ({
  isModalVisible,
  toggleModal,
  OnOptionPress,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <Modal
      hasBackdrop
      testID="modal"
      backdropColor="transparent"
      animationIn="slideInUp"
      animationInTiming={300}
      animationOutTiming={300}
      backdropOpacity={1}
      customBackdrop={<BlurredBackdrop toggleModal={toggleModal} />}
      animationOut="slideOutDown"
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
        colors={
          isDark
            ? ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.35)']
            : [colors.White, colors.White]
        }
        style={styles.ModalView}
      >
        <View style={{}}>
          <View style={styles.TopViewContainer}>
            <View style={styles.TopTitleViewContainer}>
              <Text style={[styles.TitleText, { color: colors.TitleText }]}>Add photos from</Text>
              <Text style={[styles.DescriptionText, { color: colors.TextColor }]}>
                Select source for upload photos
              </Text>
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
              style={[
                styles.ButtonView,
                { backgroundColor: isDark ? colors.White : 'rgba(255, 155, 82, 1)' },
              ]}
            >
              <Image
                resizeMode="contain"
                tintColor={isDark ? colors.Black : colors.White}
                source={CommonImages.Gallery_Icon}
                style={styles.IconView}
              />
              <View style={styles.TextView}>
                <Text style={[styles.Title, { color: isDark ? colors.Black : colors.White }]}>
                  Upload from
                </Text>
                <Text style={[styles.Pick, { color: isDark ? colors.Black : colors.White }]}>
                  Gallery
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => OnOptionPress('Camera')}
              style={[
                styles.ButtonView,
                { backgroundColor: isDark ? colors.White : 'rgba(95, 197, 255, 1)' },
              ]}
            >
              <Image
                resizeMode="contain"
                tintColor={isDark ? colors.Black : colors.White}
                source={CommonImages.Camera_Icon}
                style={styles.IconView}
              />
              <View style={styles.TextView}>
                <Text style={[styles.Title, { color: isDark ? colors.Black : colors.White }]}>
                  Capture from
                </Text>
                <Text style={[styles.Pick, { color: isDark ? colors.Black : colors.White }]}>
                  Camera
                </Text>
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
  ButtonContainerView: {
    borderRadius: SIZES.radius,
  },
  ButtonView: {
    alignSelf: 'center',
    backgroundColor: COLORS.Primary,
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    height: hp('7.5%'),
    justifyContent: 'center',
    marginVertical: hp(1),
    overflow: 'hidden',
    width: '80%',
  },

  CloseButton: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  CloseButtonIcon: {
    height: 23,
    justifyContent: 'center',
    width: 23,
  },
  DescriptionText: {
    ...GROUP_FONT.body3,
    fontSize: 13,
    top: 3,
  },
  IconView: {
    alignSelf: 'center',
    height: hp('4.5%'),
    justifyContent: 'center',
    width: hp('4.5%'),
  },
  ModalView: {
    alignSelf: 'center',
    borderRadius: SIZES.radius,
    bottom: hp('4%'),
    justifyContent: 'center',
    paddingVertical: hp('2.5%'),
    width: '85%',
  },
  Pick: {
    ...GROUP_FONT.h3,
    color: COLORS.White,
    fontSize: 12,
    marginHorizontal: hp('1%'),
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
  TitleText: {
    ...GROUP_FONT.h2,
  },

  TopTitleViewContainer: {
    width: '80%',
  },
  TopViewContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('3%'),
    paddingHorizontal: hp('2.7%'),
    width: '100%',
  },
  blurContainer: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  blurView: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
