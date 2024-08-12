/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import CommonIcons from '../../../Common/CommonIcons';
import CommonImages from '../../../Common/CommonImages';
import {ActiveOpacity, COLORS, GROUP_FONT} from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import {ChatRoomProps} from '../../../Types/Interface';

const RenderChatRoomList = ({item, index}: ChatRoomProps) => {
  const navigation = useNavigation() as any;

  if (!item || !item.chat || !Array.isArray(item.chat)) {
    return null;
  }

  const sortedChat = item.chat.slice().sort((a, b) => b.time - a.time);
  const latestMessage = sortedChat[0];

  const formattedTime =
    latestMessage &&
    new Date(latestMessage.time).toLocaleTimeString([], {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

  return (
    <TouchableOpacity
      key={index}
      activeOpacity={ActiveOpacity}
      onPress={() => {
        navigation.navigate('Chat', {id: item.to});
      }}
      style={styles.chatRoomContainerView}>
      <View style={styles.profilePicView}>
        <FastImage
          resizeMode="cover"
          style={styles.profilePic}
          source={
            item?.profile
              ? {uri: ApiConfig.IMAGE_BASE_URL + item?.profile}
              : CommonImages.WelcomeBackground
          }
        />
      </View>
      <View style={styles.nameAndMessageView}>
        <View style={styles.nameAndIconView}>
          <Text
            numberOfLines={1}
            style={[
              styles.nameText,
              {
                color:
                  latestMessage?.is_read === 1 ? COLORS.Black : COLORS.Primary,
              },
            ]}>
            {item.name}
          </Text>
          <Image
            source={CommonIcons.Verification_Icon}
            style={styles.verifyIcon}
          />
        </View>
        <Text
          numberOfLines={2}
          style={[
            styles.lastMessageText,
            {
              color:
                latestMessage?.is_read === 1
                  ? 'rgba(108, 108, 108, 1)'
                  : COLORS.Primary,
            },
          ]}>
          {latestMessage?.message}
        </Text>
      </View>
      <View style={styles.timeView}>
        <Text style={styles.timeText}>{formattedTime}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(RenderChatRoomList);

const styles = StyleSheet.create({
  chatRoomContainerView: {
    width: '90%',
    height: 80,
    borderRadius: 25,
    marginVertical: 8,
    overflow: 'hidden',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    backgroundColor: COLORS.White,
    justifyContent: 'space-between',
  },
  profilePicView: {
    width: '20%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
  },
  nameAndMessageView: {
    width: '60%',
    overflow: 'hidden',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  nameAndIconView: {
    width: '90%',
    flexDirection: 'row',
  },
  nameText: {
    ...GROUP_FONT.h3,
    color: COLORS.Black,
  },
  verifyIcon: {
    width: 16,
    height: 16,
    marginLeft: 5,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  lastMessageText: {
    ...GROUP_FONT.body4,
    color: 'rgba(108, 108, 108, 1)',
  },
  timeView: {
    width: '20%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    ...GROUP_FONT.body4,
    color: 'rgba(108, 108, 108, 1)',
  },
});
