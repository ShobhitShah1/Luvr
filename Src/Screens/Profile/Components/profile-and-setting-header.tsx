import React, { memo } from 'react';
import type { FC } from 'react';
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
  AddIcon: {
    height: hp('2.75%'),
    right: hp('1.5%'),
    width: hp('2.75%'),
  },
  AddIconAndOption: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '10%',
  },
  BackIcon: {
    height: 28,
    width: 28,
  },
  ContentView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: Platform.OS === 'ios' ? 5 : 1,
    width: '90%',
  },
  ModalSubmitButton: {
    alignSelf: 'center',
    backgroundColor: COLORS.Primary,
    borderRadius: 500,
    height: 25,
    justifyContent: 'center',
    width: 25,
  },
  ModalSubmitIcon: {
    alignSelf: 'center',
    height: 15,
    resizeMode: 'contain',
    width: 15,
  },
  MoreOptionIcon: {
    height: hp('2.6%'),
    width: hp('2.6%'),
  },
  SettingText: {
    ...GROUP_FONT.h4,
    color: COLORS.Primary,
    textAlign: 'center',
  },
  SettingView: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  Title: {
    ...GROUP_FONT.h3,
    fontSize: 16.5,
    lineHeight: 25,
  },
  TitleView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '75%',
  },
  ViewStyle: {
    justifyContent: 'center',
    width: '10%',
  },
  container: {
    alignItems: 'center',
    height: Platform.OS === 'ios' ? hp('12%') : hp('6.5%'),
    justifyContent: 'center',
    width: '100%',
  },
});
