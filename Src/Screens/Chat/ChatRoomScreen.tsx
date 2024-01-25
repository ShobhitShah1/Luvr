/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CommonImages from '../../Common/CommonImages';
import {COLORS, FONTS, GROUP_FONT} from '../../Common/Theme';
import {chatRoomData} from '../../Components/Data';
import BottomTabHeader from '../Home/Components/BottomTabHeader';
import RenderChatRoomList from './Components/RenderChatRoomList';
import {Socket, io} from 'socket.io-client';
import ApiConfig from '../../Config/ApiConfig';
import {store} from '../../Redux/Store/store';
import {useIsFocused} from '@react-navigation/native';

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
  message: (data: any) => void; // Replace 'any' with a specific type for messages
}

const JOIN_EVENT = 'Join';
const LIST_EVENT = 'List';
const MESSAGE_EVENT = 'message';
const CHAT_EVENT = 'chat';

const ChatRoomScreen = () => {
  const [socket, setSocket] = useState<Socket | undefined>();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isSocketLoading, setIsSocketLoading] = useState(false);

  const currentLoginUserId = store.getState().user?.userData?._id;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const socketInstance = io(ApiConfig.SOCKET_BASE_URL);
      setSocket(socketInstance);

      // return () => {
      //   socketInstance.disconnect();
      // };
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused && socket) {
      setIsSocketLoading(true);

      // Event: Join
      socket.emit(JOIN_EVENT, {id: currentLoginUserId});

      // Event: List
      socket.emit(LIST_EVENT, {id: currentLoginUserId});

      // Event: List - Response
      const handleListResponse: SocketEventHandlers['List'] = data => {
        // console.log('data', data);
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
        // Alert.alert('Got Message', chat.from_name);
        // handleListResponse;
        setMessages(previousMessages => {
          const combinedData = combineSameIdData([...previousMessages, chat]);
          return combinedData;
        });
      };

      socket.on(LIST_EVENT, handleListResponse);
      socket.on(MESSAGE_EVENT, handleReceivedMessage);
      socket.on(CHAT_EVENT, handleRecivedChat);

      return () => {
        socket.off(LIST_EVENT, handleListResponse);
        socket.off(MESSAGE_EVENT, handleReceivedMessage);
      };
    }
  }, [socket, currentLoginUserId, isFocused]);

  const combineSameIdData = (data: MessageItem[]): MessageItem[] => {
    const combinedData: MessageItem[] = [];
    const idMap = new Map<string, MessageItem>();

    data.forEach(item => {
      const id = item.to;

      if (idMap.has(id)) {
        idMap.get(id)!.chat = idMap.get(id)!.chat.concat(item.chat);
      } else {
        idMap.set(id, {...item});
      }
    });

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
