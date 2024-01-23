/* eslint-disable react-native/no-inline-styles */
import React, {FC} from 'react';
import FastImage from 'react-native-fast-image';
import CommonIcons from '../../../Common/CommonIcons';
import {useNavigation} from '@react-navigation/native';
import {chatRoomDataType} from '../../../Types/chatRoomDataType';
import {ActiveOpacity, COLORS, GROUP_FONT} from '../../../Common/Theme';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {DummyImage} from '../../../Config/Setting';

interface MessageType {
  id: string;
  is_read: number;
  message: string;
  time: number;
}

interface ChatRoomDataType {
  chat: MessageType[];
  last_updated_time: number;
  name: string;
  reciver_socket_id: string | null;
  to: string;
}

interface ChatRoomProps {
  item: ChatRoomDataType;
  index: number;
}

const RenderChatRoomList: FC<ChatRoomProps> = ({item, index}) => {
  console.log('item', item.chat[0]);
  const navigation = useNavigation();
  const formattedTime = new Date(item.chat[0].time).toLocaleTimeString([], {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return (
    <TouchableOpacity
      key={index}
      activeOpacity={ActiveOpacity}
      onPress={() => {
        navigation.navigate('Chat', {id: item.chat[0].id});
      }}
      style={styles.ChatRoomContainerView}>
      <View style={styles.ProfilePicView}>
        <FastImage
          resizeMode="cover"
          style={styles.ProfilePic}
          source={{uri: item?.profilePik || DummyImage}}
        />
      </View>
      <View style={styles.NameAndMessageView}>
        <View style={styles.NameAndIconView}>
          <Text
            numberOfLines={1}
            style={[
              styles.NameText,
              {
                color:
                  item.chat[0]?.is_read === 1 ? COLORS.Black : COLORS.Primary,
              },
            ]}>
            {item.name}
          </Text>
          <Image
            source={CommonIcons.Verification_Icon}
            style={styles.VerifyIcon}
          />
        </View>
        <Text
          numberOfLines={2}
          style={[
            styles.LastMessageText,
            {
              color:
                item.chat[0]?.is_read === 1
                  ? 'rgba(108, 108, 108, 1)'
                  : COLORS.Primary,
            },
          ]}>
          {item?.chat[0]?.message}
          {/* {item.lastMessage} */}
        </Text>
      </View>
      <View style={styles.TimeView}>
        <Text style={styles.TimeText}>{formattedTime}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RenderChatRoomList;

const styles = StyleSheet.create({
  ChatRoomContainerView: {
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
  ProfilePicView: {
    width: '20%',
    overflow: 'hidden',
    alignItems: 'center',
    // backgroundColor: 'red',
    justifyContent: 'center',
  },
  ProfilePic: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
  },
  NameAndMessageView: {
    width: '60%',
    overflow: 'hidden',
    paddingHorizontal: 10,
    justifyContent: 'center',
    // backgroundColor: 'yellow',
  },
  NameAndIconView: {
    width: '90%',
    flexDirection: 'row',
  },
  NameText: {
    ...GROUP_FONT.h3,
    color: COLORS.Black,
  },
  VerifyIcon: {
    width: 16,
    height: 16,
    marginLeft: 5,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  LastMessageText: {
    ...GROUP_FONT.body4,
    color: 'rgba(108, 108, 108, 1)',
  },
  TimeView: {
    width: '20%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'green',
  },
  TimeText: {
    ...GROUP_FONT.body4,
    color: 'rgba(108, 108, 108, 1)',
  },
});
