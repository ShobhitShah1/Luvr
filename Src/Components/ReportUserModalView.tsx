import { BlurView } from '@react-native-community/blur';
import React, { memo } from 'react';
import type { FC } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';

import CommonIcons from '../Common/CommonIcons';
import { COLORS, deviceHeightWithStatusbar, FONTS } from '../Common/Theme';
import { gradientEnd, gradientStart } from '../Config/Setting';
import { useTheme } from '../Contexts/ThemeContext';

import { reportReasons } from './Data';
import { GradientBorderView } from './GradientBorder';

interface ReportUserProps {
  Visible: boolean;
  setVisibility: (value: boolean) => void;
  SelectedReportReason: string;
  setSelectedReportReason: (name: string) => void;
  onReportPress: () => void;
}

export function BlurredBackdrop() {
  return (
    <View style={styles.blurContainer}>
      <BlurView
        blurAmount={5}
        blurType="dark"
        style={styles.blurView}
        reducedTransparencyFallbackColor="transparent"
      />
    </View>
  );
}

const ReportUserModalView: FC<ReportUserProps> = ({
  Visible,
  setVisibility,
  SelectedReportReason,
  setSelectedReportReason,
  onReportPress,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <Modal
      isVisible={Visible}
      useNativeDriver={true}
      deviceHeight={deviceHeightWithStatusbar}
      statusBarTranslucent={true}
      useNativeDriverForBackdrop={true}
      onBackdropPress={() => setVisibility(false)}
      hasBackdrop={true}
      onBackButtonPress={() => setVisibility(false)}
      customBackdrop={<BlurredBackdrop />}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? 'rgba(18, 18, 19, 0.7)' : colors.White },
        ]}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View>
            <View style={styles.titleView}>
              <View />
              <Text style={[styles.titleText, { color: colors.TitleText }]}>Report Profile</Text>
              <Pressable
                onPress={() => setVisibility(false)}
                style={styles.closeModalIconView}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image source={CommonIcons.CloseModal} style={styles.closeModalIcon} />
              </Pressable>
            </View>
            <Text style={[styles.titleSubText, { color: colors.TextColor }]}>
              Don't Worry, your feedback is anonymous and they won't know that you've report them
            </Text>
          </View>

          <View style={styles.reasonsViewContainer}>
            <FlatList
              data={reportReasons}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                const selected = SelectedReportReason === item.name;

                return (
                  <GradientBorderView
                    key={index}
                    style={[
                      styles.reasonsTextView,
                      {
                        borderRadius: 16,
                        overflow: 'hidden',
                        backgroundColor: isDark ? 'transparent' : colors.lightFiledBackground,
                      },
                    ]}
                    gradientProps={{
                      colors: selected
                        ? colors.ButtonGradient
                        : isDark
                        ? colors.UnselectedGradient
                        : ['transparent', 'transparent'],
                    }}
                  >
                    <Pressable
                      style={{ flex: 1, justifyContent: 'center', paddingVertical: 10 }}
                      onPress={() => setSelectedReportReason(item.name)}
                    >
                      <View style={styles.reasonTextFlexView}>
                        <Text
                          style={[
                            styles.reasonText,
                            {
                              color: colors.TextColor,
                              fontFamily: selected ? FONTS.Bold : FONTS.Medium,
                            },
                          ]}
                        >
                          {item.name}
                        </Text>
                        {selected && (
                          <Image
                            tintColor={colors.Primary}
                            source={CommonIcons.CheckMark}
                            style={styles.tickMarkImage}
                          />
                        )}
                      </View>
                    </Pressable>
                  </GradientBorderView>
                );
              }}
            />
          </View>

          <View style={styles.buttonView}>
            <LinearGradient
              start={gradientStart}
              end={gradientEnd}
              colors={colors.ButtonGradient}
              style={styles.reportButtonView}
            >
              <Pressable
                onPress={onReportPress}
                style={styles.reportButton}
                disabled={!!(SelectedReportReason === '' || SelectedReportReason.length === 0)}
              >
                <Text
                  style={[
                    styles.reportButtonText,
                    { color: isDark ? colors.TextColor : colors.White },
                  ]}
                >
                  Report
                </Text>
              </Pressable>
            </LinearGradient>

            <Pressable onPress={() => setVisibility(false)} style={styles.cancelButtonView}>
              <Text style={[styles.cancelButtonText, { color: colors.TitleText }]}>Cancel</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default memo(ReportUserModalView);

const styles = StyleSheet.create({
  blurContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
  },
  blurView: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  buttonView: {
    alignItems: 'center',
    height: '14%',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: COLORS.Primary,
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    textAlign: 'center',
  },
  cancelButtonView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalIcon: {
    height: 28,
    resizeMode: 'contain',
    width: 28,
  },
  closeModalIconView: {
    zIndex: 9999,
  },
  container: {
    borderRadius: 20,
    height: '90%',
    overflow: 'hidden',
    paddingVertical: 7,
    width: '100%',
  },
  reasonText: {
    fontFamily: FONTS.Medium,
    fontSize: 14,
    padding: 10,
    width: '90%',
  },
  reasonTextFlexView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  reasonsTextView: {
    alignSelf: 'center',
    borderRadius: 30,
    borderWidth: 1,
    justifyContent: 'center',
    marginVertical: 4,
    paddingHorizontal: 5,
    width: '90%',
  },
  reasonsViewContainer: {
    height: '73%',
  },
  reportButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  reportButtonText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    textAlign: 'center',
  },
  reportButtonView: {
    alignItems: 'center',
    borderRadius: 25,
    bottom: 5,
    height: 50,
    justifyContent: 'center',
    width: 200,
  },
  tickMarkImage: {
    alignItems: 'center',
    height: 25,
    justifyContent: 'center',
    resizeMode: 'contain',
    right: 10,
    width: 25,
  },
  titleSubText: {
    alignSelf: 'center',
    color: COLORS.DescriptionGray,
    fontFamily: FONTS.SemiBold,
    fontSize: 13.5,
    marginBottom: 13,
    marginTop: 3,
    opacity: 0.8,
    textAlign: 'center',
    width: '90%',
    zIndex: 9999,
  },
  titleText: {
    fontFamily: FONTS.Bold,
    fontSize: 20,
    left: 15,
    textAlign: 'center',
    zIndex: 9999,
  },
  titleView: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    width: '100%',
  },
});
