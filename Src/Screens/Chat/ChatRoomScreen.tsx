/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import NetInfo from '@react-native-community/netinfo';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Socket, io} from 'socket.io-client';
import CommonImages from '../../Common/CommonImages';
import TextString from '../../Common/TextString';
import {COLORS, FONTS, GROUP_FONT} from '../../Common/Theme';
import ApiConfig from '../../Config/ApiConfig';
import {JOIN_EVENT, LIST_EVENT, UPDATE_LIST} from '../../Config/Setting';
import {store} from '../../Redux/Store/store';
import {useCustomToast} from '../../Utils/toastUtils';
import BottomTabHeader from '../Home/Components/BottomTabHeader';
import RenderChatRoomList from './Components/RenderChatRoomList';

interface ChatMessage {
  senderId: string;
  message: string;
  timestamp: number;
}

interface MessageItem {
  chat: ChatMessage[];
  last_updated_time: number;
  name: string;
  reciver_socket_id: string;
  to: string;
  profile: string;
}

interface ListResponseData {
  data: MessageItem[];
}

interface SocketEventHandlers {
  List: (data: ListResponseData | null) => void;
  message: (data: any) => void;
}

const ChatRoomScreen = () => {
  const [socket, setSocket] = useState<Socket | undefined>();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isSocketLoading, setIsSocketLoading] = useState(true);
  const {showToast} = useCustomToast();
  const currentLoginUserId = store.getState().user?.userData?._id;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      if (messages.length === 0) {
        setIsSocketLoading(true);
      }
      ConnectSocket();
    } else {
      if (socket) {
        socket.disconnect();
      }
    }
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
        socket.emit(JOIN_EVENT, {id: currentLoginUserId});

        //* Event: List
        socket.emit(LIST_EVENT, {id: currentLoginUserId});

        //* Event: List - Response
        const handleListResponse: SocketEventHandlers['List'] = data => {
          try {
            if (data && data?.data) {
              const filteredData = data.data.filter(
                (item: MessageItem | null) =>
                  item !== null && item?.to !== currentLoginUserId,
              );
              // const filteredData = data.data.filter(
              //   (item: MessageItem) => item?.to !== currentLoginUserId,
              // );

              if (filteredData && filteredData?.length !== 0) {
                const usersWithFirstChat =
                  filteredData &&
                  filteredData.map(message => {
                    const otherUserChats = message?.chat?.filter(
                      chat => chat?.id !== currentLoginUserId,
                    );

                    //* With Both Side Chat
                    // const firstChat =
                    //   message.chat.length > 0
                    //     ? message.chat[message.chat.length - 1]
                    //     : null;

                    //* Only Other User Chat
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

        const handleUpdateList = data => {
          socket.emit(LIST_EVENT, {id: currentLoginUserId});
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

  const ListEmptyView = () => {
    return (
      <View style={styles.EmptyListView}>
        <View style={styles.NoChatIconBackground}>
          <Image source={CommonImages.NoChat} style={styles.NoChatIcon} />
        </View>
        <Text style={styles.NoChatText}>No chats, Get swiping</Text>
        <Text style={styles.NoChatDescription}>
          When you match with other peoples they’ll appear here, where you can
          send them a message.
        </Text>
      </View>
    );
  };

  if (isSocketLoading) {
    return (
      <React.Fragment>
        <BottomTabHeader
          showSetting={true}
          hideSettingAndNotification={false}
        />
        <View style={[styles.container, styles.LoaderContainer]}>
          <ActivityIndicator size={'large'} color={COLORS.Primary} />
        </View>
      </React.Fragment>
    );
  }

  return (
    <View style={styles.container}>
      <BottomTabHeader showSetting={true} hideSettingAndNotification={false} />

      <View style={styles.ListChatView}>
        {!isSocketLoading && (
          <FlatList
            data={messages}
            contentContainerStyle={{
              flex: 1,
              justifyContent: messages.length === 0 ? 'center' : undefined,
            }}
            maxToRenderPerBatch={10}
            renderItem={({item, index}) => {
              return <RenderChatRoomList item={item} index={index} />;
            }}
            ListEmptyComponent={<ListEmptyView />}
          />
        )}
      </View>
    </View>
  );
};

export default ChatRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  LoaderContainer: {
    justifyContent: 'center',
  },
  ListChatView: {
    flex: 1,
    marginTop: 10,
  },
  EmptyListView: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  NoChatIconBackground: {
    width: 160,
    height: 160,
    borderRadius: 100,
    marginVertical: 10,
    justifyContent: 'center',
    backgroundColor: COLORS.White,
  },
  NoChatIcon: {
    width: 90,
    height: 90,
    alignSelf: 'center',
  },
  NoChatText: {
    ...GROUP_FONT.h1,
    fontSize: 27,
    marginTop: 20,
    textAlign: 'center',
    color: COLORS.Primary,
  },
  NoChatDescription: {
    marginTop: 8,
    width: '85%',
    ...GROUP_FONT.body4,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: FONTS.SemiBold,
    color: COLORS.Black,
  },
});
