/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
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
import {COLORS, FONTS, GROUP_FONT} from '../../Common/Theme';
import {chatRoomData} from '../../Components/Data';
import ApiConfig from '../../Config/ApiConfig';
import {
  CHAT_EVENT,
  JOIN_EVENT,
  LIST_EVENT,
  MESSAGE_EVENT,
} from '../../Config/Setting';
import {useCustomToast} from '../../Utils/toastUtils';
import BottomTabHeader from '../Home/Components/BottomTabHeader';
import RenderChatRoomList from './Components/RenderChatRoomList';
import {store} from '../../Redux/Store/store';
// import {use} from 'react-redux';
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
      const socketInstance = io(ApiConfig.SOCKET_BASE_URL, {
        reconnectionDelay: 3000,
        reconnection: true,
        reconnectionAttempts: 10,
        rejectUnauthorized: false,
        agent: false,
        // path: '/socket.io',
      });

      console.log('socketInstance', socketInstance.connected);

      socketInstance.on('connect', () => {
        console.log('Connected to Socket.io server');
        // Once connected, set the socket state or do other tasks
        setSocket(socketInstance);
        setIsSocketLoading(false);
      });

      socketInstance.on('connect_error', error => {
        console.log('connect_error:--:>', error.message);
        showToast(error.name, error.message || 'Something went wrong', 'error');
      });

      if (socketInstance.connected) {
        setSocket(socketInstance);
      } else {
        setSocket(socketInstance);
        setIsSocketLoading(false);
      }

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused && socket) {
      // setIsSocketLoading(true);

      // Event: Join
      socket.emit(JOIN_EVENT, {id: currentLoginUserId});

      // Event: List
      socket.emit(LIST_EVENT, {id: currentLoginUserId});

      // Event: List - Response
      const handleListResponse: SocketEventHandlers['List'] = data => {
        console.log('data', data);
        try {
          if (data?.data) {
            const filteredData = data.data.filter(
              (item: MessageItem) => item.to !== currentLoginUserId,
            );
            const combinedData = combineSameIdData(filteredData);
            console.log('combinedData', combinedData);
            setMessages(combinedData);
          } else {
            setMessages([]);
          }
          setTimeout(() => {
            setIsSocketLoading(false);
          }, 0);
        } catch (error) {
          console.error('Error handling list response:', error);
          setTimeout(() => {
            setIsSocketLoading(false);
          }, 0);
        }
      };

      // Event: Receive Message
      const handleReceivedMessage: SocketEventHandlers['message'] = data => {
        try {
          console.log('Received Message:', data);
          // setMessages(data);
        } catch (error) {
          console.error('Error handling received message:', error);
        }
      };

      const handleRecivedChat = (chat: any) => {
        console.log('HandelRecivedChat: --->', chat, chat.from);
        setMessages(previousMessages => {
          const combinedData = combineSameIdData([...previousMessages, chat]);
          return combinedData;
        });
      };

      socket.on(LIST_EVENT, handleListResponse);
      socket.on(MESSAGE_EVENT, handleReceivedMessage);
      socket.on(CHAT_EVENT, handleRecivedChat);
      setIsSocketLoading(false);
      return () => {
        socket.off(LIST_EVENT, handleListResponse);
        socket.off(MESSAGE_EVENT, handleReceivedMessage);
      };
    } else {
      setIsSocketLoading(false);
    }
  }, [socket, currentLoginUserId, isFocused]);

  const combineSameIdData = (data: MessageItem[]): MessageItem[] => {
    console.log('combineSameIdData:--:>', data);
    const combinedData: MessageItem[] = [];
    const idMap = new Map<string, MessageItem>();

    data?.forEach(item => {
      const id = item?.to;

      if (idMap.has(id)) {
        // If the item already exists, update its chat data
        idMap.get(id)!.chat = [...idMap.get(id)!.chat, ...item.chat];
      } else {
        // If the item doesn't exist, add it to the map
        idMap.set(id, {...item});
      }
    });

    // Convert the map values to an array
    idMap.forEach(value => {
      combinedData.push(value);
    });

    return combinedData;
  };

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
        <FlatList
          data={messages}
          contentContainerStyle={{
            flex: 1,
            justifyContent: chatRoomData.length === 0 ? 'center' : undefined,
          }}
          maxToRenderPerBatch={10}
          renderItem={({item, index}) => {
            return <RenderChatRoomList item={item} index={index} />;
          }}
          ListEmptyComponent={<ListEmptyView />}
        />
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
