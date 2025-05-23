import React, { memo, useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import CommonIcons from '../../../Common/CommonIcons';
import { GROUP_FONT } from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import type { ChatRoomProps } from '../../../Types/Interface';

function RenderChatRoomList({ item }: ChatRoomProps) {
  const { colors, isDark } = useTheme();
  const navigation = useCustomNavigation();

  if (!item) {
    return null;
  }

  const { latestMessage, formattedTime, profileImageUrl } = useMemo(() => {
    const sortedChat = [...item?.chat].sort((a, b) => +b.time - +a.time);
    const latest = sortedChat?.[0];

    return {
      latestMessage: latest,
      formattedTime: latest
        ? new Date(latest.time).toLocaleTimeString([], {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })
        : '',
      profileImageUrl: item?.profile ? `${ApiConfig.IMAGE_BASE_URL}${item.profile}` : null,
    };
  }, [item.chat, item.profile]);

  const handlePress = () => {
    navigation.navigate('Chat', { id: item.to });
  };

  const containerStyle = [
    styles.chatRoomContainerView,
    {
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : colors.White,
    },
  ];

  const messageTextStyle = [
    styles.lastMessageText,
    { color: isDark ? 'rgba(198, 198, 198, 1)' : 'rgba(18, 18, 19, 1)' },
  ];

  return (
    <Pressable
      key={item.to}
      onPress={handlePress}
      style={containerStyle}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
    >
      <View style={styles.profilePicView}>
        {profileImageUrl && (
          <Image resizeMode="cover" style={styles.profilePic} source={{ uri: profileImageUrl }} />
        )}
      </View>
      <View style={styles.nameAndMessageView}>
        <View style={styles.nameAndIconView}>
          <Text numberOfLines={1} style={[styles.nameText, { color: colors.TextColor }]}>
            {item.name || ''}
          </Text>
          <Image source={CommonIcons.Verification_Icon} style={styles.verifyIcon} />
        </View>
        <Text numberOfLines={2} style={messageTextStyle}>
          {latestMessage?.message}
        </Text>
      </View>
      <View style={styles.timeView}>
        <Text style={[styles.timeText, { color: colors.TextColor }]}>{formattedTime}</Text>
      </View>
    </Pressable>
  );
}

export default memo(RenderChatRoomList);

const styles = StyleSheet.create({
  chatRoomContainerView: {
    alignSelf: 'center',
    borderRadius: 25,
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    marginVertical: 8,
    overflow: 'hidden',
    paddingHorizontal: 10,
    width: '90%',
  },
  lastMessageText: {
    ...GROUP_FONT.body4,
    color: 'rgba(108, 108, 108, 1)',
    fontSize: 14,
    marginTop: 5,
  },
  nameAndIconView: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
  },
  nameAndMessageView: {
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 10,
    width: '60%',
  },
  nameText: {
    ...GROUP_FONT.h3,
    fontSize: 16,
  },
  profilePic: {
    borderRadius: 50,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  profilePicView: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '20%',
  },
  timeText: {
    ...GROUP_FONT.body4,
    color: 'rgba(108, 108, 108, 1)',
  },
  timeView: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '20%',
  },
  verifyIcon: {
    height: 16,
    marginLeft: 5,
    width: 16,
  },
});
