/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  ParamListBase,
  RouteProp,
  useIsFocused,
  useRoute,
} from '@react-navigation/native';
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
import {COLORS, FONTS, GROUP_FONT} from '../../Common/Theme';
// import socket from '../../Services/socket';
import {Socket, io} from 'socket.io-client';
import ApiConfig from '../../Config/ApiConfig';
import {
  CHAT_EVENT,
  GET_RECEIVER_SOCKET_EVENT,
  JOIN_EVENT,
  LIST_EVENT,
  MESSAGE_EVENT,
  READ_ALL,
} from '../../Config/Setting';
import {store} from '../../Redux/Store/store';
import UserService from '../../Services/AuthService';
import {ProfileType} from '../../Types/ProfileType';
import {chatRoomDataType} from '../../Types/chatRoomDataType';
import ChatScreenHeader from './Components/ChatScreenHeader';
import CommonImages from '../../Common/CommonImages';

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
  const [userMessage, setUserMessages] = useState<IMessage[]>([]);
  const [CountMessage, setCountMessage] = useState(0);
  const [OtherUserProfileData, setOtherUserProfileData] =
    useState<ProfileType>();
  const IsFocused = useIsFocused();
  const [socket, setSocket] = useState<Socket>();
  const [ReceiverSocketId, setReceiverSocketId] = useState('');
  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
  };
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  // const Avatar =
  //   OtherUserProfileData &&
  //   OtherUserProfileData?.recent_pik &&
  //   OtherUserProfileData?.recent_pik[0] &&
  //   ApiConfig.IMAGE_BASE_URL + OtherUserProfileData?.recent_pik[0];

  useEffect(() => {
    if (IsFocused) {
      getOtherUserDataCall();
      const socketInstance = io(ApiConfig.SOCKET_BASE_URL);
      setSocket(socketInstance);
      return () => {
        socketInstance.disconnect();
      };
    }
  }, [IsFocused]);

  const transformDataForGiftedChat = (apiData: any) => {
    let dataArray = Array.isArray(apiData) ? apiData : [apiData];

    // Filter out messages not involving the current user and the opponent
    const filteredMessages = dataArray.filter(item => {
      // console.log('item', item.to);

      return item.to === CurrentLoginUserId || item.to === params?.id;
    });

    // console.log('filteredMessages', filteredMessages);

    // Combine all chat messages into a single array
    const allMessages = filteredMessages.reduce((accumulator, currentItem) => {
      return accumulator.concat(currentItem.chat);
    }, []);

    // console.log('allMessages', allMessages);

    // Transform combined messages into GiftedChat format
    const giftedChatMessages = allMessages.map((message: any) => {
      // console.log(MESSAGE_EVENT, message);
      return {
        _id: generateRandomId(),
        text: message.message,
        createdAt: new Date(message.time),
        user: {
          _id: message.id === CurrentLoginUserId ? 1 : 0,
          name:
            message.id === CurrentLoginUserId ? CurrentLoginUserFullName : '',
          avatar: avatarUrl,
        },
      };
    });

    // Sort messages by createdAt in descending order (most recent first)
    const sortedMessages = giftedChatMessages.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    // console.log('sortedMessages', sortedMessages);

    return sortedMessages;
  };

  const StoreSingleChatFormat = (message: any) => {
    // console.log('OTHER', OtherUserProfileData);

    setCountMessage(1);

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
        avatar: avatarUrl,
      },
    };
    // console.log('singleChatMessage', singleChatMessage);
    // Return an array with the single chat message
    return [singleChatMessage];
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    //* Event: Join
    socket.emit(JOIN_EVENT, {id: CurrentLoginUserId});

    //* Event: Get Receiver Socket
    socket.emit(GET_RECEIVER_SOCKET_EVENT, {
      to: params?.id,
    });

    //* Event: List
    socket.emit(LIST_EVENT, {id: CurrentLoginUserId});

    //* Read Chat (Read Receipts)
    socket.emit(READ_ALL, {id: CurrentLoginUserId});

    // Event: List - Response
    const handleListResponse = (data: {data: any}) => {
      // console.log('handleListResponse:--:>', data);
      let dataArray = Array.isArray(data.data) ? data.data : [data.data];

      const filteredMessages = dataArray.filter((item: any) => {
        return item?.to === CurrentLoginUserId || item?.to === params?.id;
      });

      const giftedChatMessages = transformDataForGiftedChat(filteredMessages);

      if (!giftedChatMessages) {
        console.error('transformDataForGiftedChat returned undefined:', data);
        return;
      }

      // console.log('giftedChatMessages', giftedChatMessages);

      if (giftedChatMessages.length !== 0) {
        // console.log('giftedChatMessages', giftedChatMessages);
        setUserMessages(previousMessages => [
          ...previousMessages,
          ...giftedChatMessages,
        ]);
      }
    };

    // Event: Receive Message
    const handleReceivedMessage = (data: any) => {
      // console.log('Received Message:', data);
      // setMessages(prevMessages => [...prevMessages, data]);
    };

    const handleReceiverChat = async (chat: any) => {
      if (!OtherUserProfileData) {
        // If not available, fetch OtherUserProfileData
        await getOtherUserDataCall();
      }
      const giftedChatMessages = StoreSingleChatFormat(chat);
      // console.log('OtherUserProfileData:', OtherUserProfileData);
      if (giftedChatMessages) {
        const updatedMessages = giftedChatMessages.map((message: any) => ({
          ...message,
          user: {
            ...message.user,
            avatar: avatarUrl,
          },
        }));

        setUserMessages(previousMessages =>
          GiftedChat.append(previousMessages, ...updatedMessages.flat()),
        );
      }
    };

    const handleReceiverSocketId = (data: {to_socket_id: string}) => {
      // console.log('handleReceiverSocketId:', data, data?.to_socket_id);
      setReceiverSocketId(data?.to_socket_id);
    };

    const handleJoinResponse = (data: any) => {
      // console.log('handleJoinResponse:', data);

      // Check if the response contains data and if the ID matches params?.id
      if (data && data.id === params?.id) {
        // If there's a match, set the receiver's socket ID
        setReceiverSocketId(data.socket_id);
      }
    };

    socket.on(JOIN_EVENT, handleJoinResponse);
    socket.on(LIST_EVENT, handleListResponse);
    socket.on(MESSAGE_EVENT, handleReceivedMessage);
    socket.on(CHAT_EVENT, handleReceiverChat);
    socket.on(GET_RECEIVER_SOCKET_EVENT, handleReceiverSocketId);

    return () => {
      socket.off(JOIN_EVENT, handleJoinResponse);
      socket.off(LIST_EVENT, handleListResponse);
      socket.off(MESSAGE_EVENT, handleReceivedMessage);
      socket.off(CHAT_EVENT, handleReceiverChat);
      socket.off(GET_RECEIVER_SOCKET_EVENT, handleReceiverSocketId);
    };
  }, [socket, params, avatarUrl]);

  // useEffect(() => {
  //   console.log('userMessage', userMessage);
  // }, [userMessage]);

  const getOtherUserDataCall = async () => {
    try {
      const data = {
        eventName: 'get_other_profile',
        id: params?.id,
      };

      const apiResponse = await UserService.UserRegister(data);

      if (apiResponse?.code === 200 && apiResponse.data) {
        console.log('get_other_profile', apiResponse.data);
        setOtherUserProfileData(apiResponse.data);
        if (apiResponse.data && apiResponse.data?.recent_pik) {
          setAvatarUrl(
            ApiConfig.IMAGE_BASE_URL + apiResponse.data?.recent_pik[0],
          );
        }
      }
    } catch (error) {
      console.error('Error in getOtherUserDataCall:', error);
    }
  };

  const onSend = useCallback(
    async (messages: IMessage[]) => {
      setUserMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
      setCountMessage(1);
      // console.log('OtherUserProfileData', OtherUserProfileData);
      if (!OtherUserProfileData || OtherUserProfileData === undefined) {
        await getOtherUserDataCall();
      }

      if (socket) {
        const chatData = {
          ...(CountMessage === 0 ? {is_first: 1} : {}),
          to: params?.id,
          reciver_socket_id: ReceiverSocketId || null,
          from_name: CurrentLoginUserFullName,
          to_name: OtherUserProfileData?.full_name,
          message: messages[0].text,
          to_profile: OtherUserProfileData?.recent_pik[0],
        };

        // console.log(chatData, userMessage.length);

        socket.emit(CHAT_EVENT, chatData, (err, responses) => {
          console.log('err, responses', err, responses);
          if (err) {
            // some clients did not acknowledge the event in the given delay
          } else {
            // acknowledgment is the data sent back by the server
            // console.log('Message acknowledgment:', responses);

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
      }
    },
    [
      socket,
      CurrentLoginUserId,
      OtherUserProfileData,
      CurrentLoginUserFullName,
      ReceiverSocketId,
      CountMessage,
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
            avatar: avatarUrl,
          }}
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
