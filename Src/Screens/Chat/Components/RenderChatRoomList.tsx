/* eslint-disable react-native/no-inline-styles */
import FastImage from '@d11/react-native-fast-image';
import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import CommonIcons from '../../../Common/CommonIcons';
import { GROUP_FONT } from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import { ChatRoomProps } from '../../../Types/Interface';

const RenderChatRoomList = ({ item, index }: ChatRoomProps) => {
  const { colors, isDark } = useTheme();
  const navigation = useCustomNavigation();

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
    <Pressable
      key={index}
      onPress={() => navigation.navigate('Chat', { id: item.to })}
      style={[
        styles.chatRoomContainerView,
        {
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : colors.White,
        },
      ]}
    >
      <View style={styles.profilePicView}>
        <FastImage
          resizeMode="cover"
          style={styles.profilePic}
          source={
            item?.profile ? { uri: ApiConfig.IMAGE_BASE_URL + item?.profile } : { uri: ApiConfig.PLACEHOLDER_IMAGE }
          }
        />
      </View>
      <View style={styles.nameAndMessageView}>
        <View style={styles.nameAndIconView}>
          <Text numberOfLines={1} style={[styles.nameText, { color: colors.TextColor }]}>
            {item.name || ''}
          </Text>
          <Image source={CommonIcons.Verification_Icon} style={styles.verifyIcon} />
        </View>
        <Text
          numberOfLines={2}
          style={[
            styles.lastMessageText,
            {
              color: isDark ? 'rgba(198, 198, 198, 1)' : 'rgba(18, 18, 19, 1))',
            },
          ]}
        >
          {latestMessage?.message}
        </Text>
      </View>
      <View style={styles.timeView}>
        <Text style={[styles.timeText, { color: colors.TextColor }]}>{formattedTime}</Text>
      </View>
    </Pressable>
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
