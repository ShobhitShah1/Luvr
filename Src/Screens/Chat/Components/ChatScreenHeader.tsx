import React, { memo } from 'react';
import type { FC } from 'react';
import { Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import CommonIcons from '../../../Common/CommonIcons';
import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import type { ProfileType } from '../../../Types/ProfileType';

interface ChatHeaderProps {
  data: ProfileType | null;
  onRightIconPress: () => void;
}

const ChatScreenHeader: FC<ChatHeaderProps> = ({ data, onRightIconPress }) => {
  const { colors } = useTheme();
  const navigation = useCustomNavigation();

  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.ContentView}>
        <View style={styles.BackAndProfileInfoView}>
          <Pressable
            onPress={() => navigation.canGoBack() && navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              resizeMode="contain"
              tintColor={colors.TextColor}
              source={CommonIcons.TinderBack}
              style={styles.TinderBackIcon}
            />
          </Pressable>
          <View style={styles.ProfileImageView}>
            {data?.recent_pik?.[0] && (
              <Image
                style={styles.ProfileImage}
                source={{
                  uri: ApiConfig.IMAGE_BASE_URL + data?.recent_pik?.[0],
                }}
              />
            )}
          </View>
          <View style={[styles.UserInfoView, { flex: 1, justifyContent: 'center' }]}>
            {data?.full_name && (
              <View style={styles.ProfileNameView}>
                <Text
                  numberOfLines={1}
                  style={[styles.ProfileNameText, { color: colors.TitleText, textAlign: 'center' }]}
                >
                  {data?.full_name || ''}
                </Text>
                <Image source={CommonIcons.Verification_Icon} style={styles.VerifyIconView} />
              </View>
            )}
          </View>
        </View>
        <Pressable
          onPress={onRightIconPress}
          style={styles.RemoveChatView}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            tintColor={colors.TextColor}
            style={styles.RemoveChatIcon}
            source={CommonIcons.more_option}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default memo(ChatScreenHeader);

const styles = StyleSheet.create({
  BackAndProfileInfoView: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
  },
  Container: {
    height: Platform.OS === 'ios' ? hp('12.5%') : hp('8%'),
    justifyContent: 'center',
    paddingHorizontal: 7,
    width: '100%',
  },
  ContentView: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  ProfileImage: {
    borderRadius: 50,
    height: 33,
    width: 33,
  },
  ProfileImageView: {
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  ProfileNameText: {
    ...GROUP_FONT.h3,
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
    fontSize: 16,
  },
  ProfileNameView: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    right: 3,
    width: '80%',
  },
  RemoveChatIcon: {
    height: 20,
    resizeMode: 'contain',
    width: 20,
  },
  RemoveChatView: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 5,
  },
  TinderBackIcon: {
    height: 24,
    width: 24,
  },
  UserInfoView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 15,
  },
  VerifyIconView: {
    alignSelf: 'center',
    height: 15,
    justifyContent: 'center',
    marginLeft: 5,
    width: 15,
  },
});
