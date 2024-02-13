import {useNavigation} from '@react-navigation/native';
import React, {FC} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../Common/CommonIcons';
import CommonImages from '../../../Common/CommonImages';
import {ActiveOpacity, COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import {ProfileType} from '../../../Types/ProfileType';

interface ChatHeaderProps {
  data: ProfileType;
}

const ChatScreenHeader: FC<ChatHeaderProps> = ({data}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.White} />
      <View style={styles.ContentView}>
        <View style={styles.BackAndProfileInfoView}>
          <TouchableOpacity
            activeOpacity={ActiveOpacity}
            onPress={() => navigation.goBack()}>
            <Image
              resizeMode="contain"
              source={CommonIcons.TinderBack}
              style={styles.TinderBackIcon}
            />
          </TouchableOpacity>
          <View style={styles.UserInfoView}>
            <View style={styles.ProfileImageView}>
              <FastImage
                style={styles.ProfileImage}
                source={
                  data?.recent_pik && data?.recent_pik?.length !== 0
                    ? {
                        uri: ApiConfig.IMAGE_BASE_URL + data?.recent_pik[0],
                        priority: FastImage.priority.high,
                      }
                    : CommonImages.WelcomeBackground
                }
              />
            </View>
            <View style={styles.ProfileNameView}>
              <Text numberOfLines={1} style={styles.ProfileNameText}>
                {data?.full_name || 'Loading....'}
              </Text>
              <Image
                source={CommonIcons.Verification_Icon}
                style={styles.VerifyIconView}
              />
            </View>
          </View>
        </View>
        <View style={styles.RemoveChatView}>
          <Image
            style={styles.RemoveChatIcon}
            source={CommonIcons.delete_chat}
          />
        </View>
      </View>
    </View>
  );
};

export default ChatScreenHeader;

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    height: hp('8%'),
    justifyContent: 'center',
    backgroundColor: COLORS.White,
    paddingHorizontal: 7,
    shadowColor: COLORS.Black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
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
