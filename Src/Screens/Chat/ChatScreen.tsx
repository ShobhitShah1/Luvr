/* eslint-disable react-hooks/exhaustive-deps */
import {
  ParamListBase,
  RouteProp,
  useIsFocused,
  useRoute,
} from '@react-navigation/native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
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
import {useCustomToast} from '../../Utils/toastUtils';

interface ChatData {
  params: {
    ChatData: chatRoomDataType;
    id?: number;
  };
}

type ChatScreenRouteProp = RouteProp<ParamListBase, 'ChatScreen'> & ChatData;

const ChatScreen: FC = () => {
  const {params} = useRoute<ChatScreenRouteProp>();
  const CurrentLoginUserId = store.getState().user?.userData?._id;
  const CurrentUserImage = store.getState().user?.userData?.recent_pik;
  const CurrentLoginUserFullName = store.getState().user?.userData?.full_name;
  const [userMessage, setUserMessages] = useState<IMessage[]>([]);
  const [CountMessage, setCountMessage] = useState(0);
  const [OtherUserProfileData, setOtherUserProfileData] =
    useState<ProfileType>();
  const IsFocused = useIsFocused();
  const [socket, setSocket] = useState<Socket>();
  const [ReceiverSocketId, setReceiverSocketId] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const {showToast} = useCustomToast();

  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  useEffect(() => {
    if (IsFocused) {
      getOtherUserDataCall();
      const socketInstance = io(ApiConfig.SOCKET_BASE_URL);
      setSocket(socketInstance);
      // store.dispatch(setCurrentScreenName('Chat'));
      return () => {
        socketInstance.disconnect();
      };
    }
  }, [IsFocused]);

  const transformDataForGiftedChat = (apiData: any) => {
    let dataArray = Array.isArray(apiData) ? apiData : [apiData];

    const filteredMessages = dataArray.filter(item => {
      return item.to === CurrentLoginUserId || item.to === params?.id;
    });
    const allMessages = filteredMessages.reduce((accumulator, currentItem) => {
      return accumulator.concat(currentItem.chat);
    }, []);

    const giftedChatMessages = allMessages.map((message: any) => {
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

    const sortedMessages = giftedChatMessages.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    return sortedMessages;
  };

  const StoreSingleChatFormat = (message: any) => {
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

    return [singleChatMessage];
  };

  const removeDuplicates = (messages: any[]) => {
    const uniqueMessages = messages.reduce((unique, message) => {
      const existingMessage = unique.find(m => m._id === message._id);
      if (!existingMessage) {
        unique.push(message);
      }
      return unique;
    }, []);

    return uniqueMessages;
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    //* Event: Join
    socket.emit(JOIN_EVENT, {
      id: CurrentLoginUserId,
      to_profile: OtherUserProfileData?.recent_pik[0],
    });

    //* Event: Get Receiver Socket
    socket.emit(GET_RECEIVER_SOCKET_EVENT, {
      to: params?.id,
    });

    //* Event: List
    socket.emit(LIST_EVENT, {id: CurrentLoginUserId});

    //* Read Chat (Read Receipts)
    socket.emit(READ_ALL, {to: OtherUserProfileData?._id});

    //* Event: List - Response
    const handleListResponse = (data: {data: any}) => {
      let dataArray = Array.isArray(data.data) ? data.data : [data.data];

      const filteredMessages = dataArray.filter((item: any) => {
        return item?.to === CurrentLoginUserId || item?.to === params?.id;
      });

      const giftedChatMessages = transformDataForGiftedChat(filteredMessages);

      if (!giftedChatMessages) {
        console.error('transformDataForGiftedChat returned undefined:', data);
        return;
      }

      if (giftedChatMessages.length !== 0) {
        const uniqueMessages = removeDuplicates([
          ...userMessage,
          ...giftedChatMessages,
        ]);

        setUserMessages(uniqueMessages);
      }
    };

    //* Event: Receive Message
    const handleReceivedMessage = (data: any) => {};

    const handleReceiverChat = async (chat: any) => {
      if (!OtherUserProfileData) {
        await getOtherUserDataCall();
      }
      const giftedChatMessages = StoreSingleChatFormat(chat);
      if (giftedChatMessages) {
        socket.emit(READ_ALL, {to: OtherUserProfileData?._id});

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
      setReceiverSocketId(data?.to_socket_id);
    };

    const handleJoinResponse = (data: any) => {
      if (data && data.id === params?.id) {
        setReceiverSocketId(data.socket_id);
      }
    };

    const handleReadAllMessages = (data: any) => {};

    socket.on(JOIN_EVENT, handleJoinResponse);
    socket.on(READ_ALL, handleReadAllMessages);
    socket.on(LIST_EVENT, handleListResponse);
    socket.on(MESSAGE_EVENT, handleReceivedMessage);
    socket.on(CHAT_EVENT, handleReceiverChat);
    socket.on(GET_RECEIVER_SOCKET_EVENT, handleReceiverSocketId);

    return () => {
      socket.off(JOIN_EVENT, handleJoinResponse);
      socket.off(READ_ALL, handleReadAllMessages);
      socket.off(LIST_EVENT, handleListResponse);
      socket.off(MESSAGE_EVENT, handleReceivedMessage);
      socket.off(CHAT_EVENT, handleReceiverChat);
      socket.off(GET_RECEIVER_SOCKET_EVENT, handleReceiverSocketId);
    };
  }, [socket, params, avatarUrl]);

  const getOtherUserDataCall = async () => {
    try {
      const data = {
        eventName: 'get_other_profile',
        id: params?.id,
      };

      const apiResponse = await UserService.UserRegister(data);

      if (apiResponse?.code === 200 && apiResponse.data) {
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
      setCountMessage(1);
      if (!OtherUserProfileData || OtherUserProfileData === undefined) {
        await getOtherUserDataCall();
      }

      if (socket) {
        const chatData = {
          ...(userMessage?.length === 0 ? {is_first: 1} : {}),
          to: params?.id,
          reciver_socket_id: ReceiverSocketId || null,
          from_name: CurrentLoginUserFullName,
          to_name: OtherUserProfileData?.full_name,
          message: messages[0].text,
          to_profile: OtherUserProfileData?.recent_pik[0],
          from_profile: CurrentUserImage[0],
        };
        setUserMessages(previousMessages =>
          GiftedChat.append(previousMessages, messages),
        );
        console.log('Socket Data Going:', chatData);
        socket.emit(READ_ALL, {to: OtherUserProfileData?._id});
        socket.emit(CHAT_EVENT, chatData, (err, responses) => {
          if (err) {
            showToast(
              'Error',
              String(err) || 'Something went wrong. Please try again later.',
              'error',
            );
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
      userMessage,
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
      {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
      <SafeAreaView />
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
    height: '100%',
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
