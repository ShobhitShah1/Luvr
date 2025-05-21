import React, { FC, memo } from 'react';
import { Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonIcons from '../../../Common/CommonIcons';
import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import { ProfileType } from '../../../Types/ProfileType';

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
          <Image tintColor={colors.TextColor} style={styles.RemoveChatIcon} source={CommonIcons.more_option} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default memo(ChatScreenHeader);

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    height: Platform.OS === 'ios' ? hp('12.5%') : hp('8%'),
    justifyContent: 'center',
    paddingHorizontal: 7,
  },
  ContentView: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  BackAndProfileInfoView: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  TinderBackIcon: {
    width: 24,
    height: 24,
  },
  UserInfoView: {
    marginRight: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  ProfileImageView: {
    alignSelf: 'center',
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  ProfileImage: {
    width: 33,
    height: 33,
    borderRadius: 50,
  },
  ProfileNameView: {
    width: '80%',
    right: 3,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ProfileNameText: {
    ...GROUP_FONT.h3,
    fontSize: 16,
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
  },
  RemoveChatView: {
    top: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  RemoveChatIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  VerifyIconView: {
    width: 15,
    height: 15,
    marginLeft: 5,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
