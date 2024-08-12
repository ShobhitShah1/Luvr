import React, {FC} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import CommonIcons from '../../../Common/CommonIcons';
import {
  ActiveOpacity,
  COLORS,
  deviceHeightWithStatusbar,
  FONTS,
} from '../../../Common/Theme';
import {BlurredBackdrop} from '../../../Components/ReportUserModalView';
import {ReportOrBlockInterface} from '../../../Types/Interface';

const ReportOrBlockModal: FC<ReportOrBlockInterface> = ({
  isVisible,
  setReportAndBlockModal,
  setShowReportModalView,
  onBlockProfileClick,
  ShowReportModalView,
}) => {
  const closeModal = () => {
    setReportAndBlockModal(false);
  };

  return (
    <ReactNativeModal
      deviceHeight={deviceHeightWithStatusbar}
      customBackdrop={<BlurredBackdrop />}
      statusBarTranslucent={true}
      useNativeDriver={true}
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      style={styles.modalContainer}
      presentationStyle="overFullScreen">
      <SafeAreaView style={styles.BlockAndReportProfileView}>
        <View style={styles.blockAndReportContentView}>
          <TouchableOpacity
            activeOpacity={ActiveOpacity}
            style={styles.blockAndReportCloseButton}
            onPress={() => setReportAndBlockModal(false)}>
            <Image source={CommonIcons.CloseModal} style={styles.closeIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onBlockProfileClick}
            activeOpacity={ActiveOpacity}
            style={styles.BlockAndReportButtonView}>
            <Image
              resizeMode="contain"
              style={styles.BlockAndReportIcon}
              source={CommonIcons.block_profile_icon}
            />
            <Text style={styles.BlockAndReportText}>Block Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setReportAndBlockModal(false);
              setShowReportModalView(!ShowReportModalView);
            }}
            activeOpacity={ActiveOpacity}
            style={styles.BlockAndReportButtonView}>
            <Image
              resizeMode="contain"
              style={styles.BlockAndReportIcon}
              source={CommonIcons.report_profile_icon}
            />
            <Text style={styles.BlockAndReportText}>Report Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ReactNativeModal>
  );
};

export default ReportOrBlockModal;

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    flex: 1,
  },
  BlockAndReportProfileView: {
    width: '100%',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  BlockAndReportButtonView: {
    width: '47%',
    overflow: 'hidden',
    height: hp('7.5%'),
    marginVertical: hp('2%'),
    borderRadius: hp('5%'),
    backgroundColor: COLORS.White,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.Black,
    paddingHorizontal: hp('1%'),
    marginHorizontal: hp('0.5%'),
  },
  BlockAndReportIcon: {
    width: hp('2.4%'),
    height: hp('2.4%'),
  },
  BlockAndReportText: {
    fontFamily: FONTS.Bold,
    color: COLORS.Black,
    fontSize: hp('1.8%'),
    marginHorizontal: hp('0.5%'),
  },
  blockAndReportContentView: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%',
    borderRadius: 10,
    flexDirection: 'row',
  },
  blockAndReportCloseButton: {
    position: 'absolute',
    top: 10,
    right: 5,
    width: 50,
    height: 50,
  },
  closeIcon: {
    width: 35,
    height: 35,
  },
});
