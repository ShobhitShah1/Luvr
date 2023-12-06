/* eslint-disable react/no-unstable-nested-components */
import React, {FC} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonImages from '../../../../Common/CommonImages';
import {
  ActiveOpacity,
  COLORS,
  GROUP_FONT,
  SIZES,
} from '../../../../Common/Theme';
import {BlurView} from '@react-native-community/blur';

interface ChooseFromModalProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  OnOptionPress: (option: string) => void;
}

const ChooseFromModal: FC<ChooseFromModalProps> = ({
  isModalVisible,
  toggleModal,
  OnOptionPress,
}) => {
  const BlurredBackdrop = () => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={toggleModal}
      style={styles.blurContainer}>
      <BlurView
        style={styles.blurView}
        blurAmount={1}
        blurType="dark"
        reducedTransparencyFallbackColor="transparent"
      />
    </TouchableOpacity>
  );

  return (
    <Modal
      testID={'modal'}
      animationIn={'slideInUp'}
      animationInTiming={300}
      animationOutTiming={300}
      backdropOpacity={1}
      customBackdrop={<BlurredBackdrop />}
      animationOut={'slideOutDown'}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      onBackButtonPress={toggleModal}
      onBackdropPress={toggleModal}
      isVisible={isModalVisible}
      swipeDirection={['up', 'left', 'right', 'down']}
      style={styles.container}>
      <View style={styles.ModalView}>
        <View style={styles.TopViewContainer}>
          <View style={styles.TopTitleViewContainer}>
            <Text style={styles.TitleText}>Select Any Option..</Text>
            <Text style={styles.DescriptionText}>
              You can select any option to upload pics.
            </Text>
          </View>

          <TouchableOpacity style={styles.CloseButton} onPress={() => {}}>
            <Text style={styles.CloseText}>Close</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ButtonContainerView}>
          {/* Camera */}
          <TouchableOpacity
            onPress={() => OnOptionPress('Camera')}
            activeOpacity={ActiveOpacity}
            style={styles.ButtonView}>
            <Image
              resizeMode="contain"
              source={CommonImages.Camera_Icon}
              style={styles.IconView}
            />
            <Text style={styles.SelectText}>Select Image Camera</Text>
          </TouchableOpacity>

          {/* Gallery */}
          <TouchableOpacity
            onPress={() => OnOptionPress('Gallery')}
            activeOpacity={ActiveOpacity}
            style={styles.ButtonView}>
            <Image
              resizeMode="contain"
              source={CommonImages.Gallery_Icon}
              style={styles.IconView}
            />
            <Text style={styles.SelectText}>Select Image Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ChooseFromModal;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  ModalView: {
    width: '90%',
    bottom: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    paddingVertical: hp('2.5%'),
    backgroundColor: COLORS.White,
  },

  TopViewContainer: {
    width: '100%',
    paddingHorizontal: hp('4%'),
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
  },
  CloseButton: {
    width: '20%',
    backgroundColor: 'red',
  },
  CloseText: {
    ...GROUP_FONT.h3,
    textAlign: 'center',
  },

  ButtonContainerView: {
    borderRadius: SIZES.radius,
  },
  ButtonView: {
    width: '90%',
    height: hp(7),
    overflow: 'hidden',
    alignSelf: 'center',
    marginVertical: hp(1),
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.Primary,
  },
  IconView: {
    width: hp('3.5%'),
    height: hp('3.5%'),
    alignSelf: 'center',
    tintColor: COLORS.White,
    justifyContent: 'center',
  },
  SelectText: {
    ...GROUP_FONT.h3,
    color: COLORS.White,
    alignSelf: 'center',
    justifyContent: 'center',
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
