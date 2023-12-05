import React, {FC} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';
import {
  ActiveOpacity,
  COLORS,
  GROUP_FONT,
  SIZES,
} from '../../../../Common/Theme';

interface ChooseFromModalProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  OnOptionPress: (option: string) => void; // Updated the OnOptionPress to accept a parameter
}

const ChooseFromModal: FC<ChooseFromModalProps> = ({
  isModalVisible,
  toggleModal,
  OnOptionPress,
}) => {
  return (
    <Modal
      testID={'modal'}
      // backdropColor="transparent"
      animationIn={'slideInUp'}
      animationInTiming={500}
      animationOutTiming={1000}
      animationOut={'slideOutDown'}
      useNativeDriver={true}
      onBackButtonPress={toggleModal}
      onBackdropPress={toggleModal}
      isVisible={isModalVisible}
      swipeDirection={['up', 'left', 'right', 'down']}
      style={styles.container}>
      <View style={styles.ModalView}>
        <View style={styles.ButtonContainerView}>
          {/* Camera */}
          <TouchableOpacity
            onPress={() => OnOptionPress('Camera')}
            activeOpacity={ActiveOpacity}
            style={styles.ButtonView}>
            <Image
              source={CommonIcons.CancelPhoneNumber}
              style={styles.IconView}
            />
            <Text style={styles.SelectText}>Select Image From Camera</Text>
          </TouchableOpacity>

          {/* Gallery */}
          <TouchableOpacity
            onPress={() => OnOptionPress('Gallery')}
            activeOpacity={ActiveOpacity}
            style={styles.ButtonView}>
            <Image
              source={CommonIcons.CancelPhoneNumber}
              style={styles.IconView}
            />
            <Text style={styles.SelectText}>Select Image From Gallery</Text>
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
    height: hp(23),
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.White,
    borderRadius: SIZES.radius,
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
    width: hp('3%'),
    height: hp('3%'),
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
});
