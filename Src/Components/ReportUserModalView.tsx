/* eslint-disable react/no-unstable-nested-components */
import {BlurView} from '@react-native-community/blur';
import React, {FC} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import CommonIcons from '../Common/CommonIcons';
import {ActiveOpacity, COLORS, FONTS} from '../Common/Theme';
import {reportReasons} from './Data';

interface ReportUserProps {
  Visible: boolean;
  setVisibility: (value: boolean) => void;
  SelectedReportReason: string;
  setSelectedReportReason: (name: string) => void;
  onReportPress: () => void;
}

const ReportUserModalView: FC<ReportUserProps> = ({
  Visible,
  setVisibility,
  SelectedReportReason,
  setSelectedReportReason,
  onReportPress,
}) => {
  const BlurredBackdrop = () => (
    <View style={styles.blurContainer}>
      <BlurView
        style={styles.blurView}
        blurAmount={5}
        blurType="dark"
        reducedTransparencyFallbackColor="transparent"
      />
    </View>
  );

  return (
    <Modal
      isVisible={Visible}
      onBackdropPress={() => setVisibility(false)}
      hasBackdrop
      customBackdrop={<BlurredBackdrop />}>
      <View style={styles.Container}>
        <View style={styles.TitleView}>
          <Text style={styles.TitleText}>Report Profile</Text>
          <Text style={styles.TitleSubText}>
            Don't Worry, your feedback is anonymous and they won't know that
            you've report them
          </Text>
          <TouchableOpacity
            onPress={() => setVisibility(false)}
            activeOpacity={ActiveOpacity}
            style={styles.CloseModalIconView}>
            <Image
              source={CommonIcons.CloseModal}
              style={styles.CloseModalIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.ReasonsViewContainer}>
          <FlatList
            data={reportReasons}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={styles.ReasonsTextView}
                  onPress={() => setSelectedReportReason(item.name)}
                  activeOpacity={ActiveOpacity}
                  key={index}>
                  <View style={styles.ReasonTextFlexView}>
                    <Text
                      style={[
                        styles.ReasonText,
                        {
                          color:
                            SelectedReportReason === item.name
                              ? COLORS.Black
                              : COLORS.DescriptionGray,
                          fontFamily:
                            SelectedReportReason === item.name
                              ? FONTS.Bold
                              : FONTS.Medium,
                        },
                      ]}>
                      {item.name}
                    </Text>
                    {SelectedReportReason === item.name && (
                      <Image
                        source={CommonIcons.CheckMark}
                        style={styles.TickMarkImage}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View style={styles.ButtonView}>
          <TouchableOpacity
            activeOpacity={ActiveOpacity}
            onPress={onReportPress}
            disabled={
              SelectedReportReason === '' || SelectedReportReason.length === 0
                ? true
                : false
            }
            style={styles.ReportButtonView}>
            <Text style={styles.ReportButtonText}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setVisibility(false)}
            style={styles.CancelButtonView}>
            <Text style={styles.CancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ReportUserModalView;

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    height: '90%',
    overflow: 'hidden',
    backgroundColor: COLORS.White,
    borderRadius: 20,
  },
  TitleView: {
    height: '15%',
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  TitleText: {
    zIndex: 9999,
    textAlign: 'center',
    color: COLORS.Black,
    fontFamily: FONTS.Bold,
    fontSize: 20,
  },
  TitleSubText: {
    paddingVertical: 2,
    zIndex: 9999,
    textAlign: 'center',
    opacity: 0.8,
    color: COLORS.DescriptionGray,
    fontFamily: FONTS.Bold,
    fontSize: 14,
  },
  CloseModalIconView: {
    top: 15,
    right: 15,
    zIndex: 9999,
    position: 'absolute',
  },
  CloseModalIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  ReasonsViewContainer: {
    height: '71%',
  },
  ReasonsTextView: {
    width: '90%',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 30,
    marginVertical: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.Secondary,
  },
  ReasonTextFlexView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    justifyContent: 'space-between',
  },
  ReasonText: {
    color: COLORS.DescriptionGray,
    padding: 10,
    fontFamily: FONTS.Medium,
    fontSize: 14,
    width: '90%',
  },
  TickMarkImage: {
    width: 25,
    height: 25,
    right: 5,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  ButtonView: {
    height: '14%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ReportButtonView: {
    width: 200,
    height: 50,
    marginVertical: 7,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.Primary,
  },
  ReportButtonText: {
    textAlign: 'center',
    color: COLORS.White,
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
  },
  CancelButtonView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  CancelButtonText: {
    textAlign: 'center',
    color: COLORS.Primary,
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
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
