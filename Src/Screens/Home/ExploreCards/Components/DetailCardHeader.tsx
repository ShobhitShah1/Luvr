import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import React from 'react';
import type { FC } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

import CommonIcons from '../../../../Common/CommonIcons';
import { COLORS, FONTS } from '../../../../Common/Theme';
import { useTheme } from '../../../../Contexts/ThemeContext';
import useCalculateAge from '../../../../Hooks/useCalculateAge';
import { useCustomNavigation } from '../../../../Hooks/useCustomNavigation';
import type { ProfileType } from '../../../../Types/ProfileType';

type DetailCardRouteParams = {
  props: ProfileType | undefined;
};

const DetailCardHeader: FC<DetailCardRouteParams> = ({ props }) => {
  const navigation = useCustomNavigation();
  const { colors, isDark } = useTheme();

  const cardDetail = useRoute<RouteProp<Record<string, DetailCardRouteParams>, string>>();
  const item = props ||
    cardDetail?.params?.props || { full_name: '', age: 0, profile_image: '', birthdate: '' };

  const Age = useCalculateAge(item?.birthdate || '00/00/0000');

  return (
    <View
      style={[
        styles.container,
        !isDark && {
          backgroundColor: colors.White,
          shadowColor: colors.Black,
          elevation: 5,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
        },
      ]}
    >
      {Platform.OS === 'android' && <SafeAreaView />}
      <View style={styles.ContentView}>
        <Pressable
          onPress={() =>
            navigation.canGoBack()
              ? navigation.goBack()
              : navigation.replace('BottomTab', { screen: 'Home' })
          }
          style={styles.BackIconView}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            resizeMode="contain"
            style={styles.BackIcon}
            tintColor={colors.TextColor}
            source={CommonIcons.TinderBack}
          />
        </Pressable>
        <View style={styles.NameAndBadgeView}>
          <Text
            numberOfLines={1}
            style={[styles.HeaderText, { color: isDark ? colors.TextColor : colors.TitleText }]}
          >
            {item?.full_name || 'User'}, {Age || 0}
          </Text>
          <Image
            resizeMode="contain"
            style={styles.VerifyIcon}
            source={isDark ? CommonIcons.Verification_Icon_Dark : CommonIcons.Verification_Icon}
          />
        </View>
      </View>
    </View>
  );
};

export default DetailCardHeader;

const styles = StyleSheet.create({
  BackIcon: {
    height: hp('2.8%'),
    width: hp('3%'),
  },
  BackIconView: {
    justifyContent: 'center',
  },
  ContentView: {
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? hp('5%') : hp('0%'),
    width: '90%',
  },
  HeaderText: {
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
    fontSize: hp('2%'),
  },
  NameAndBadgeView: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 15,
    width: '90%',
  },
  VerifyIcon: {
    alignItems: 'center',
    alignSelf: 'center',
    height: hp('2%'),
    marginHorizontal: hp('0.7%'),
    width: hp('2%'),
  },
  container: {
    alignItems: 'center',
    height: Platform.OS === 'ios' ? hp('13%') : hp('7%'),
    justifyContent: 'center',
    width: '100%',
  },
});
