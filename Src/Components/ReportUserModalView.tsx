import { BlurView } from '@react-native-community/blur';
import React, { FC, memo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonIcons from '../Common/CommonIcons';
import { COLORS, deviceHeightWithStatusbar, FONTS } from '../Common/Theme';
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

export const BlurredBackdrop = () => (
  <View style={styles.blurContainer}>
    <BlurView blurAmount={5} blurType="dark" style={styles.blurView} reducedTransparencyFallbackColor="transparent" />
  </View>
);

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
      <View style={[styles.container, { backgroundColor: isDark ? 'rgba(18, 18, 19, 0.7)' : colors.White }]}>
        <SafeAreaView style={{ flex: 1 }}>
          <View>
            <View style={styles.titleView}>
              <View />
              <Text style={[styles.titleText, { color: colors.TitleText }]}>Report Profile</Text>
              <Pressable onPress={() => setVisibility(false)} style={styles.closeModalIconView}>
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
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              colors={colors.ButtonGradient}
              style={styles.reportButtonView}
            >
              <Pressable
                onPress={onReportPress}
                style={{ flex: 1, justifyContent: 'center' }}
                disabled={SelectedReportReason === '' || SelectedReportReason.length === 0 ? true : false}
              >
                <Text style={[styles.reportButtonText, { color: colors.TextColor }]}>Report</Text>
              </Pressable>
            </LinearGradient>

            <Pressable onPress={() => setVisibility(false)} style={styles.cancelButtonView}>
              <Text style={[styles.cancelButtonText, { color: colors.TextColor }]}>Cancel</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default memo(ReportUserModalView);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '90%',
    overflow: 'hidden',
    borderRadius: 20,
    paddingVertical: 7,
  },
  titleView: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  titleText: {
    left: 15,
    fontSize: 20,
    zIndex: 9999,
    textAlign: 'center',
    fontFamily: FONTS.Bold,
  },
  titleSubText: {
    marginTop: 3,
    zIndex: 9999,
    opacity: 0.8,
    width: '90%',
    fontSize: 13.5,
    marginBottom: 13,
    textAlign: 'center',
    alignSelf: 'center',
    color: COLORS.DescriptionGray,
    fontFamily: FONTS.SemiBold,
  },
  closeModalIconView: {
    zIndex: 9999,
  },
  closeModalIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  reasonsViewContainer: {
    height: '73%',
  },
  reasonsTextView: {
    width: '90%',
    borderWidth: 1,
    borderRadius: 30,
    marginVertical: 8,
    alignSelf: 'center',
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  reasonTextFlexView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    justifyContent: 'space-between',
  },
  reasonText: {
    padding: 10,
    width: '90%',
    fontSize: 14,
    fontFamily: FONTS.Medium,
  },
  tickMarkImage: {
    width: 25,
    height: 25,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  buttonView: {
    height: '14%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportButtonView: {
    width: 200,
    height: 50,
    bottom: 5,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportButtonText: {
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
  },
  cancelButtonView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: COLORS.Primary,
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
  },
  blurContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  blurView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
