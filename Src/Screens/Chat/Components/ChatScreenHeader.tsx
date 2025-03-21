import { useNavigation } from '@react-navigation/native';
import React, { FC, memo } from 'react';
import { Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonIcons from '../../../Common/CommonIcons';
import CommonImages from '../../../Common/CommonImages';
import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import { useTheme } from '../../../Contexts/ThemeContext';
import { ProfileType } from '../../../Types/ProfileType';

interface ChatHeaderProps {
  data: ProfileType | null;
  onRightIconPress: () => void;
}

const ChatScreenHeader: FC<ChatHeaderProps> = ({ data, onRightIconPress }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.ContentView}>
        <View style={styles.BackAndProfileInfoView}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              resizeMode="contain"
              tintColor={colors.TextColor}
              source={CommonIcons.TinderBack}
              style={styles.TinderBackIcon}
            />
          </Pressable>
          <View style={styles.UserInfoView}>
            <View style={styles.ProfileImageView}>
              <FastImage
                style={styles.ProfileImage}
                source={
                  data?.recent_pik && data?.recent_pik?.length !== 0
                    ? {
                        uri: ApiConfig.IMAGE_BASE_URL + data?.recent_pik?.[0],
                        priority: FastImage.priority.high,
                      }
                    : CommonImages.WelcomeBackground
                }
              />
            </View>
            {data?.full_name && (
              <View style={styles.ProfileNameView}>
                <Text numberOfLines={1} style={[styles.ProfileNameText, { color: colors.TextColor }]}>
                  {data?.full_name || ''}
                </Text>
                <Image source={CommonIcons.Verification_Icon} style={styles.VerifyIconView} />
              </View>
            )}
          </View>
        </View>
        <Pressable onPress={onRightIconPress} style={styles.RemoveChatView}>
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
    marginLeft: 5,
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
    marginLeft: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ProfileNameText: {
    ...GROUP_FONT.h3,
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
