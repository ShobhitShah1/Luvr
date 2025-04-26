/* eslint-disable react-native/no-inline-styles */
import React, { FC, memo } from 'react';
import { Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonIcons from '../../../Common/CommonIcons';
import { COLORS, GROUP_FONT } from '../../../Common/Theme';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';

interface HeaderProps {
  Title: string;
  onUpdatePress?: () => void;
  isLoading?: boolean;
  showRightIcon?: boolean;
  showBackIcon?: boolean;
}

const ProfileAndSettingHeader: FC<HeaderProps> = ({
  Title,
  onUpdatePress,
  isLoading,
  showRightIcon = true,
  showBackIcon = true,
}) => {
  const { colors, isDark } = useTheme();
  const navigation = useCustomNavigation();

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View style={styles.ContentView}>
        {showBackIcon && (
          <Pressable
            disabled={isLoading}
            onPress={() => navigation.canGoBack() && navigation.goBack()}
            style={styles.ViewStyle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              resizeMode="contain"
              tintColor={colors.TextColor}
              style={styles.BackIcon}
              source={CommonIcons.TinderBack}
            />
          </Pressable>
        )}
        <View style={[styles.TitleView, { right: Title === 'Notification' ? 10 : 3 }]}>
          <Text style={[styles.Title, { color: colors.TextColor }]}>{Title}</Text>
        </View>
        {Title !== 'Notification' && showRightIcon ? (
          <Pressable
            disabled={isLoading}
            style={styles.ModalSubmitButton}
            onPress={onUpdatePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={CommonIcons.Check}
              tintColor={isDark ? colors.TextColor : colors.White}
              style={styles.ModalSubmitIcon}
            />
          </Pressable>
        ) : (
          <View style={{ width: 25 }} />
        )}
      </View>
    </View>
  );
};

export default memo(ProfileAndSettingHeader);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: Platform.OS === 'ios' ? hp('12%') : hp('6.5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ContentView: {
    width: '90%',
    top: Platform.OS === 'ios' ? 5 : 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ViewStyle: {
    width: '10%',
    justifyContent: 'center',
  },
  BackIcon: {
    width: 28,
    height: 28,
  },
  TitleView: {
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Title: {
    ...GROUP_FONT.h3,
    fontSize: 16.5,
    lineHeight: 25,
  },
  AddIconAndOption: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  AddIcon: {
    width: hp('2.75%'),
    height: hp('2.75%'),
    right: hp('1.5%'),
  },
  MoreOptionIcon: {
    width: hp('2.6%'),
    height: hp('2.6%'),
  },
  SettingView: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  SettingText: {
    ...GROUP_FONT.h4,
    color: COLORS.Primary,
    textAlign: 'center',
  },
  ModalSubmitButton: {
    width: 25,
    height: 25,
    borderRadius: 500,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.Primary,
  },
  ModalSubmitIcon: {
    width: 13,
    height: 13,
    alignSelf: 'center',
  },
});
