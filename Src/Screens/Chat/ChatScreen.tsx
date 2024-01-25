/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {ParamListBase, RouteProp, useRoute} from '@react-navigation/native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  Bubble,
  BubbleProps,
  Composer,
  ComposerProps,
  GiftedChat,
  IMessage,
  InputToolbar,
} from 'react-native-gifted-chat';
import {useSelector} from 'react-redux';
import {COLORS, FONTS, GROUP_FONT} from '../../Common/Theme';
// import socket from '../../Services/socket';
import {chatRoomDataType} from '../../Types/chatRoomDataType';
import ChatScreenHeader from './Components/ChatScreenHeader';
import {ProfileType} from '../../Types/ProfileType';
import UserService from '../../Services/AuthService';
import {Socket, io} from 'socket.io-client';
import ApiConfig from '../../Config/ApiConfig';
import {store} from '../../Redux/Store/store';

interface ChatData {
  params: {
    ChatData: chatRoomDataType;
    id?: number;
  };
}

type ChatScreenRouteProp = RouteProp<ParamListBase, 'ChatScreen'> & ChatData;

const ChatScreen: FC = () => {
  const {params} = useRoute<ChatScreenRouteProp>();
  // const chatData = params?.ChatData || {};
  const CurrentLoginUserId = store.getState().user?.userData?._id;
  const CurrentLoginUserFullName = store.getState().user?.userData?.full_name;
  const userData = useSelector((state: any) => state?.user);
  const [userMessage, setUserMessages] = useState<IMessage[]>([]);
  const [CountMessage, setCountMessage] = useState(0);
  const [OtherUserProfileData, setOtherUserProfileData] =
    useState<ProfileType>();

  const [socket, setSocket] = useState<Socket>();
  const [ReciverSocketId, setReciverSocketId] = useState(null);
  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const transformDataForGiftedChat = (apiData: any) => {
    const data = apiData?.data;

    if (!data || !Array.isArray(data)) {
      console.log('Invalid data format:', data, apiData);
      return [];
    }

    const giftedChatMessages = data.flatMap(chatItem => {
      return chatItem?.chat?.map((message: any) => {
        setCountMessage(message?.id === CurrentLoginUserId ? 1 : 0);
        return {
          _id: generateRandomId(),
          text: message?.message,
          createdAt: new Date(message?.time),
          user: {
            _id: message?.id === CurrentLoginUserId ? 1 : 0,
            name:
              message?.id === CurrentLoginUserId
                ? CurrentLoginUserFullName
                : chatItem?.name,
          },
        };
      });
    });

    // Sort messages by createdAt in descending order (most recent first)
    const sortedMessages = giftedChatMessages.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    return sortedMessages;
  };

  const StoreSingleChatFormat = (message: any) => {
    console.log('StoreSingleChatFormat message:', message);
    setCountMessage(message?.id === CurrentLoginUserId ? 1 : 0);

    const singleChatMessage = {
      _id: generateRandomId(),
      text: message?.message,
      createdAt: new Date(message?.last_updated_time),
      user: {
        _id: message?.from === CurrentLoginUserId ? 1 : 0,
        name:
          message?.from === CurrentLoginUserId
            ? CurrentLoginUserFullName
            : message?.from_name,
      },
    };

    // Return an array with the single chat message
    return [singleChatMessage];
  };

  useEffect(() => {
    getOtherUserDataCall();
    console.log('UserID:---:>', params?.id);
  }, []);

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
    socket.emit('Join', {id: CurrentLoginUserId}); //params?.id

    // Event: Get Receiver Socket
    socket.emit('get_reciver_socket', {
      to: params?.id, //CurrentLoginUserId
    });

    // Event: List
    socket.emit('List', {id: CurrentLoginUserId});

    // Event: List - Response
    const handleListResponse = (data: any) => {
      // console.log('handleListResponse', data);
      const giftedChatMessages = transformDataForGiftedChat(data);

      if (!giftedChatMessages) {
        console.error('transformDataForGiftedChat returned undefined:', data);
        return;
      }

      if (giftedChatMessages.length !== 0) {
        setUserMessages(previousMessages =>
          previousMessages.concat(...giftedChatMessages.flat()),
        );
      }
    };

    // Event: Receive Message
    const handleReceivedMessage = (data: any) => {
      console.log('Received Message:', data);
      // setMessages(prevMessages => [...prevMessages, data]);
    };

    const handleRecivedChat = (chat: any) => {
      console.log(
        'HandelRecivedChat: --->',
        chat,
        chat.from,
        CurrentLoginUserId,
      );
      // Alert.alert('Got Message', chat.from_name);
      const giftedChatMessages = StoreSingleChatFormat(chat);
      console.log('SINGLE: giftedChatMessages:', giftedChatMessages);
      // const giftedChatMessages = transformDataForGiftedChat(chat);

      // if (!giftedChatMessages) {
      //   console.error('transformDataForGiftedChat returned undefined:', chat);
      //   return;
      // }
      setUserMessages(previousMessages =>
        GiftedChat.append(previousMessages, ...giftedChatMessages),
      );
    };
    const handleReceiverSocketId = (data: any) => {
      console.log('handleReceiverSocketId:', data, data?.to_socket_id);
      setReciverSocketId(data?.to_socket_id);
    };

    const handleJoinResponse = (data: any) => {
      console.log('handleJoinResponse:', data);
    };

    socket.on('join', handleJoinResponse);
    socket.on('List', handleListResponse);
    socket.on('message', handleReceivedMessage);
    socket.on('chat', handleRecivedChat);
    socket.on('get_reciver_socket', handleReceiverSocketId);

    return () => {
      socket.off('List', handleListResponse);
      socket.off('message', handleReceivedMessage);
      socket.off('chat', handleRecivedChat);
      socket.off('get_reciver_socket', handleReceiverSocketId);
    };
  }, [socket, params]);

  const getOtherUserDataCall = async () => {
    try {
      const data = {
        eventName: 'get_other_profile',
        id: params?.id,
      };

      const apiResponse = await UserService.UserRegister(data);

      if (apiResponse?.code === 200) {
        // console.log('APIResponse', apiResponse.data);
        setOtherUserProfileData(apiResponse.data);
      }
    } catch (error) {
      console.error('Error in getOtherUserDataCall:', error);
    }
  };

  const onSend = useCallback(
    (messages: IMessage[]) => {
      setUserMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
      setCountMessage(1);
      console.log(
        'userMessage.length:-->',
        userMessage.length,
        CountMessage,
        ReciverSocketId,
      );
      let SOCKET_ID;

      const handleReceiverSocketId = (data: any) => {
        console.log('WOOOOOOOH:', data, data?.to_socket_id);
        SOCKET_ID = data?.to_socket_id;
        // setReciverSocketId(data?.to_socket_id);
      };

      if (socket) {
        socket.on('get_reciver_socket', handleReceiverSocketId);
      }

      if (socket) {
        const chatData = {
          ...(CountMessage && CountMessage === 0 ? {is_first: 1} : {}),
          to: params?.id, // CurrentLoginUserId
          reciver_socket_id: SOCKET_ID || ReciverSocketId || null, // Socket ID Other User Not Mine
          from_name: CurrentLoginUserFullName, // OtherUserProfileData?.full_name
          to_name: OtherUserProfileData?.full_name, // CurrentLoginUserFullName
          message: messages[0].text,
        };
        console.log(chatData, userMessage.length);
        if (socket.connected) {
          socket.emit('chat', chatData, (err, responses) => {
            console.log('err, responses', err, responses);
            if (err) {
              // some clients did not acknowledge the event in the given delay
            } else {
              // acknowledgment is the data sent back by the server
              console.log('Message acknowledgment:', responses);

              // You can handle the acknowledgment as needed
              if (responses && responses.success) {
                // Message sent successfully
                console.log('Message sent successfully');
              } else {
                // Message failed to send
                console.error('Message failed to send');
              }
            }
          });
        } else {
          Alert.alert('Error', 'Socket Not Connected');
        }
      }
    },
    [
      socket,
      CurrentLoginUserId,
      OtherUserProfileData,
      CurrentLoginUserFullName,
      ReciverSocketId,
    ],
  );

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        primaryStyle={styles.inputToolbarPrimary}
        optionTintColor={COLORS.Primary}
        accessoryStyle={styles.inputToolbarAccessory}
        containerStyle={styles.inputToolbarContainer}
      />
    );
  };

  const renderBubble = (props: BubbleProps<IMessage>) => {
    // const formattedTime = new Date(
    //   props?.currentMessage?.createdAt,
    // ).toLocaleTimeString([], {
    //   hour: 'numeric',
    //   minute: '2-digit',
    //   hour12: true,
    // });

    // console.log('formattedTime --->', props.currentMessage);
    return (
      <View>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              padding: 3,
              // paddingVertical: 8,
              marginVertical: 1,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 20,
              backgroundColor: COLORS.White,
            },
            left: {
              padding: 3,
              // paddingVertical: 8,
              marginVertical: 1,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 0,
              borderTopLeftRadius: 20,
              backgroundColor: COLORS.Primary,
            },
          }}
          textStyle={{
            right: {
              fontSize: 14,
              color: COLORS.Black,
              fontFamily: FONTS.Medium,
            },
            left: {
              fontSize: 14,
              color: COLORS.White,
              fontFamily: FONTS.Medium,
            },
          }}
          bottomContainerStyle={{
            right: {
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 20,
            },
            left: {
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 0,
              borderTopLeftRadius: 20,
            },
          }}
          containerToPreviousStyle={{
            right: {
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 20,
            },
            left: {
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 0,
              borderTopLeftRadius: 20,
            },
          }}
          containerToNextStyle={{
            right: {
              borderTopRightRadius: 20,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 20,
              borderTopLeftRadius: 20,
            },
            left: {
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 0,
              borderTopLeftRadius: 20,
            },
          }}
          containerStyle={{
            right: {
              borderTopRightRadius: 20,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 20,
              borderTopLeftRadius: 20,
            },
            left: {
              borderTopRightRadius: 20,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0,
              borderTopLeftRadius: 20,
            },
          }}
        />
        {/* <Text
          style={[
            styles.TimeStyle,
            {
              textAlign: props.position === 'left' ? 'left' : 'right',
            },
          ]}>
          {formattedTime}
        </Text> */}
      </View>
    );
  };

  const renderComposer = (props: ComposerProps) => {
    return (
      <Composer
        {...props}
        placeholder="Write your message here"
        textInputStyle={styles.composerTextInput}
      />
    );
  };

  return (
    <View style={styles.Container}>
      <ChatScreenHeader data={OtherUserProfileData} />
      <StatusBar backgroundColor={COLORS.White} barStyle={'dark-content'} />
      <View style={styles.ChatContainer}>
        <GiftedChat
          alignTop
          messages={userMessage}
          onInputTextChanged={text => {
            //  console.log('User Typing:', text);
          }}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1,
            avatar:
              ApiConfig.IMAGE_BASE_URL + OtherUserProfileData?.recent_pik[0],
          }}
          // showUserAvatar={true}
          // renderAvatar={() => {}}
          isTyping={false}
          messagesContainerStyle={styles.messagesContainer}
          maxComposerHeight={100}
          renderComposer={renderComposer}
          renderInputToolbar={props => renderInputToolbar(props)}
          renderBubble={renderBubble}
          timeTextStyle={{
            left: {color: COLORS.White},
            right: {color: COLORS.Black},
          }}
          imageStyle={{
            left: {
              width: 28,
              height: 28,
              // bottom: 10,
            },
          }}
          // renderUsernameOnMessage
          // renderTime={() => {
          //   return null;
          // }}
        />
      </View>
      {Platform.OS && <KeyboardAvoidingView behavior="height" />}
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  messagesContainer: {
    marginBottom: 10,
  },
  ChatContainer: {
    flex: 1,
  },
  composerTextInput: {
    ...GROUP_FONT.h3,
    fontFamily: FONTS.SemiBold,
    color: COLORS.Black,
  },
  inputToolbarPrimary: {
    justifyContent: 'center',
  },
  inputToolbarAccessory: {
    width: '10%',
  },
  inputToolbarContainer: {
    padding: 0,
  },
  TimeStyle: {
    top: 5,
    fontSize: 11.5,
    color: COLORS.Black,
    fontFamily: FONTS.SemiBold,
  },
});
