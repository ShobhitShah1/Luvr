/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react/no-unstable-nested-components */
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Platform, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

import CommonIcons from '../../Common/CommonIcons';
import GradientView from '../../Common/GradientView';
import TextString from '../../Common/TextString';
import { BOTTOM_TAB_HEIGHT, COLORS, FONTS, GROUP_FONT } from '../../Common/Theme';
import SubscriptionView from '../../Components/Subscription/SubscriptionView';
import ApiConfig from '../../Config/ApiConfig';
import {
  APP_NAME,
  gradientEnd,
  gradientStart,
  JOIN_EVENT,
  LIST_EVENT,
  UPDATE_LIST,
} from '../../Config/Setting';
import { useTheme } from '../../Contexts/ThemeContext';
import { useUserData } from '../../Contexts/UserDataContext';
import { store } from '../../Redux/Store/store';
import type { MessageItem, SocketEventHandlers } from '../../Types/Interface';
import { useCustomToast } from '../../Utils/toastUtils';

import RenderChatRoomList from './Components/RenderChatRoomList';

function ChatRoomScreen() {
  const { colors, isDark } = useTheme();
  const isFocused = useIsFocused();
  const { showToast } = useCustomToast();
  const { subscription } = useUserData();

  const currentLoginUserId = store.getState().user?.userData?._id || '';

  const [socket, setSocket] = useState<Socket | undefined>();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isSocketLoading, setIsSocketLoading] = useState(true);

  useEffect(() => {
    if (isFocused) {
      if (!messages.length) {
        setIsSocketLoading(true);
      }

      ConnectSocket();
    }

    return () => {
      socket?.disconnect();
    };
  }, [isFocused]);

  const ConnectSocket = async () => {
    const InInternetConnected = (await NetInfo.fetch()).isConnected;

    if (!InInternetConnected) {
      showToast(
        TextString.error.toUpperCase(),
        TextString.PleaseCheckYourInternetConnection,
        TextString.error,
      );

      setIsSocketLoading(false);

      return;
    }

    const socketInstance = io(ApiConfig.SOCKET_BASE_URL, {
      reconnectionAttempts: 5,
    });

    socketInstance.on('connect', () => {
      setSocket(socketInstance);
    });

    socketInstance.on('connect_error', error => {
      showToast(error.name, error.message || 'Something went wrong', 'error');
      setIsSocketLoading(false);
    });

    if (socketInstance.connected) {
      setSocket(socketInstance);
    } else {
      setSocket(undefined);
    }
  };

  useEffect(() => {
    try {
      if (socket && isFocused) {
        //* Event: Join
        socket.emit(JOIN_EVENT, { id: currentLoginUserId });

        //* Event: List
        socket.emit(LIST_EVENT, { id: currentLoginUserId });

        //* Event: List - Response
        const handleListResponse: SocketEventHandlers['List'] = data => {
          try {
            if (data && data?.data) {
              const filteredData = data.data.filter(
                (item: MessageItem | null) => item !== null && item?.to !== currentLoginUserId,
              );

              if (filteredData && filteredData?.length !== 0) {
                const usersWithFirstChat =
                  filteredData &&
                  filteredData.map(message => {
                    const otherUserChats = message?.chat?.filter(
                      (chat: any) => (chat?.id || chat?.senderId) !== currentLoginUserId,
                    );

                    const firstChat =
                      otherUserChats?.length > 0
                        ? otherUserChats[otherUserChats?.length - 1]
                        : null;

                    return {
                      chat: firstChat ? [firstChat] : [],
                      last_updated_time: message?.last_updated_time,
                      name: message?.name,
                      reciver_socket_id: message?.reciver_socket_id,
                      to: message?.to,
                      profile: message?.profile,
                    };
                  });

                setMessages(usersWithFirstChat);
              }
            }
          } catch (error) {
            showToast('Error', String(error), 'error');
          } finally {
            setTimeout(() => {
              setIsSocketLoading(false);
            }, 500);
          }
        };

        const handleUpdateList = () => {
          socket.emit(LIST_EVENT, { id: currentLoginUserId });
        };

        socket.on(LIST_EVENT, handleListResponse);
        socket.on(UPDATE_LIST, handleUpdateList);

        return () => {
          socket.off(LIST_EVENT, handleListResponse);
          socket.off(UPDATE_LIST, handleListResponse);
        };
      }
    } catch (error) {
      showToast('Error', String(error), 'error');
    }
  }, [socket, isFocused, currentLoginUserId]);

  function ListEmptyView() {
    return (
      <View style={styles.EmptyListView}>
        <LinearGradient
          start={gradientStart}
          end={gradientEnd}
          colors={isDark ? colors.ButtonGradient : ['transparent', 'transparent']}
          style={styles.NoChatIconBackground}
        >
          <Image
            source={CommonIcons.ic_noChat}
            tintColor={isDark ? colors.White : colors.Primary}
            style={styles.NoChatIcon}
          />
        </LinearGradient>
        <Text style={[styles.NoChatText, { color: colors.TitleText }]}>No chats, Get swiping</Text>
        <Text
          style={[
            styles.NoChatDescription,
            { color: isDark ? 'rgba(255, 255, 255, 0.5)' : colors.TextColor },
          ]}
        >
          When you match with other peoples they’ll appear here, where you can send them a message.
        </Text>
      </View>
    );
  }

  if (isSocketLoading) {
    return (
      <GradientView>
        <SafeAreaView
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            height: Platform.OS === 'ios' ? hp('12.5%') : hp('7%'),
          }}
        >
          <View style={styles.contentView}>
            <View style={[styles.titleTextView, Platform.OS === 'ios' ? { height: 40 } : {}]}>
              <Text style={[styles.titleText, { color: colors.TitleText }]}>
                {APP_NAME?.toUpperCase()}
              </Text>
            </View>
          </View>
        </SafeAreaView>
        <View style={[styles.container, styles.LoaderContainer]}>
          <ActivityIndicator size="large" color={colors.Primary} />
        </View>
      </GradientView>
    );
  }

  return (
    <GradientView>
      <View style={styles.container}>
        <SafeAreaView
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            height: Platform.OS === 'ios' ? hp('12.5%') : hp('7%'),
          }}
        >
          <View style={styles.contentView}>
            <View style={[styles.titleTextView, Platform.OS === 'ios' ? { height: 40 } : {}]}>
              <Text style={[styles.titleText, { color: colors.TitleText }]}>
                {APP_NAME?.toUpperCase()}
              </Text>
            </View>
          </View>
        </SafeAreaView>

        <View style={styles.ListChatView}>
          {/* {!subscription.isActive ? (
            <View style={{ flex: 1, marginTop: 30 }}>
              <SubscriptionView selectedPlan={''} handlePlanSelection={() => {}} />
            </View>
          ) : (
            !isSocketLoading && ( */}
          <FlatList
            data={messages}
            contentContainerStyle={{
              flexGrow: messages?.length === 0 ? 1 : undefined,
              paddingBottom: BOTTOM_TAB_HEIGHT,
              justifyContent: messages.length === 0 ? 'center' : undefined,
            }}
            maxToRenderPerBatch={10}
            renderItem={({ item, index }) => {
              return <RenderChatRoomList item={item} />;
            }}
            ListEmptyComponent={<ListEmptyView />}
          />
          {/* )
          )} */}
        </View>
      </View>
    </GradientView>
  );
}

export default memo(ChatRoomScreen);

const styles = StyleSheet.create({
  EmptyListView: {
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '90%',
  },
  ListChatView: {
    flex: 1,
    marginTop: 10,
  },
  LoaderContainer: {
    justifyContent: 'center',
  },
  NoChatDescription: {
    marginTop: 8,
    width: '85%',
    ...GROUP_FONT.body4,
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    textAlign: 'center',
  },
  NoChatIcon: {
    alignSelf: 'center',
    height: 90,
    width: 90,
  },
  NoChatIconBackground: {
    backgroundColor: COLORS.White,
    borderRadius: 100,
    height: 160,
    justifyContent: 'center',
    marginVertical: 10,
    width: 160,
  },
  NoChatText: {
    ...GROUP_FONT.h1,
    fontSize: 27,
    marginTop: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },

  contentView: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '93%',
  },
  titleText: {
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
    fontSize: 20,
  },
  titleTextView: {
    alignItems: 'center',

    justifyContent: 'center',
    top: 2,
    zIndex: 10,
  },
});
