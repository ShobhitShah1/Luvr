/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import CommonImages from '../../Common/CommonImages';
import {COLORS, FONTS, GROUP_FONT} from '../../Common/Theme';
import {chatRoomData} from '../../Components/Data';
import BottomTabHeader from '../Home/Components/BottomTabHeader';
import RenderChatRoomList from './Components/RenderChatRoomList';
import {Socket, io} from 'socket.io-client';
import ApiConfig from '../../Config/ApiConfig';
import {store} from '../../Redux/Store/store';

const ChatRoomScreen = () => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState([]);
  console.log('messages', messages);
  const CurrentLoginUserId = store.getState().user?.userData?._id;
  const CurrentLoginUserFullName = store.getState().user?.userData?.full_name;

  useEffect(() => {
    const socketInstance = io(ApiConfig.SOCKET_BASE_URL);
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }

    // Event: Join
    socket.emit('Join', {id: CurrentLoginUserId});

    // Event: List
    socket.emit('List', {id: CurrentLoginUserId});

    // Event: List - Response
    const handleListResponse = (data: any) => {
      console.log('data', data.data[0]);
      setMessages(data.data);
    };

    // Event: Receive Message
    const handleReceivedMessage = (data: any) => {
      console.log('Received Message:', data);
      // setMessages(data);
    };

    socket.on('List', handleListResponse);
    socket.on('message', handleReceivedMessage);

    return () => {
      socket.off('List', handleListResponse);
      socket.off('message', handleReceivedMessage);
    };
  }, [socket, CurrentLoginUserId]);

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

  return (
    <View style={styles.container}>
      <BottomTabHeader showSetting={true} hideSettingAndNotification={false} />

      <View style={styles.ListChatView}>
        <FlatList
          data={messages} //chatRoomData
          contentContainerStyle={{
            // flex: chatRoomData.length === 0 ? 1 : 0,
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
