import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { FC } from 'react';
import { Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';
import { ActiveOpacity, COLORS, FONTS } from '../../../../Common/Theme';
import { ProfileType } from '../../../../Types/ProfileType';
import useCalculateAge from '../../../../Hooks/useCalculateAge';
import { useTheme } from '../../../../Contexts/ThemeContext';

type DetailCardRouteParams = {
  props: ProfileType | undefined;
};

const DetailCardHeader: FC<DetailCardRouteParams> = ({ props }) => {
  const { goBack } = useNavigation();
  const { colors } = useTheme();

  const cardDetail = useRoute<RouteProp<Record<string, DetailCardRouteParams>, string>>();
  const item = props || cardDetail?.params?.props || { full_name: '', age: 0, profile_image: '', birthdate: '' };

  const Age = useCalculateAge(item?.birthdate || '00/00/0000');

  return (
    <View style={styles.Container}>
      <SafeAreaView />
      <View style={styles.ContentView}>
        <Pressable onPress={() => goBack()} style={styles.BackIconView}>
          <Image
            resizeMode="contain"
            style={styles.BackIcon}
            tintColor={colors.TextColor}
            source={CommonIcons.TinderBack}
          />
        </Pressable>
        <View style={styles.NameAndBadgeView}>
          <Text numberOfLines={1} style={[styles.HeaderText, { color: colors.TextColor }]}>
            {item?.full_name || 'User'}, {Age || 0}
          </Text>
          <Image resizeMode="contain" style={styles.VerifyIcon} source={CommonIcons.Verification_Icon} />
        </View>
      </View>
    </View>
  );
};

export default DetailCardHeader;

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    justifyContent: 'center',
    height: Platform.OS === 'ios' ? hp('12.5%') : hp('7%'),
  },
  ContentView: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  BackIconView: {
    justifyContent: 'center',
  },
  BackIcon: {
    width: hp('3%'),
    height: hp('2.8%'),
  },
  NameAndBadgeView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    width: '90%',
  },
  HeaderText: {
    fontFamily: FONTS.SemiBold,
    fontSize: hp('2.1%'),
    color: COLORS.Primary,
  },
  VerifyIcon: {
    width: hp('2%'),
    height: hp('2%'),
    alignSelf: 'center',
    alignItems: 'center',
    marginHorizontal: hp('0.7%'),
  },
});
