/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  ParamListBase,
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  MessageText,
  MessageTextProps,
} from 'react-native-gifted-chat';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Socket, io} from 'socket.io-client';
import CommonIcons from '../../Common/CommonIcons';
import {ActiveOpacity, COLORS, FONTS, GROUP_FONT} from '../../Common/Theme';
import ReportUserModalView from '../../Components/ReportUserModalView';
import ApiConfig from '../../Config/ApiConfig';
import {
  CHAT_EVENT,
  GET_RECEIVER_SOCKET_EVENT,
  JOIN_EVENT,
  LIST_EVENT,
  MESSAGE_EVENT,
  READ_ALL,
} from '../../Config/Setting';
import {onSwipeLeft} from '../../Redux/Action/actions';
import {store} from '../../Redux/Store/store';
import UserService from '../../Services/AuthService';
import {ProfileType} from '../../Types/ProfileType';
import {chatRoomDataType} from '../../Types/chatRoomDataType';
import {useCustomToast} from '../../Utils/toastUtils';
import ChatScreenHeader from './Components/ChatScreenHeader';

interface ChatData {
  params: {
    ChatData: chatRoomDataType;
    id?: number;
  };
}

type ChatScreenRouteProp = RouteProp<ParamListBase, 'ChatScreen'> & ChatData;

const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const ChatScreen = () => {
  const {params} = useRoute<ChatScreenRouteProp>();

  const {userData} = store.getState().user || ({} as any);
  const CurrentLoginUserId = userData?._id;
  const CurrentUserImage = userData?.recent_pik;
  const CurrentLoginUserFullName = userData?.full_name;

  const [userMessage, setUserMessages] = useState<IMessage[]>([]);
  const [CountMessage, setCountMessage] = useState(0);
  const [OtherUserProfileData, setOtherUserProfileData] =
    useState<ProfileType | null>(null);
  const IsFocused = useIsFocused();
  const [socket, setSocket] = useState<Socket>();
  const [ReceiverSocketId, setReceiverSocketId] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const {showToast} = useCustomToast();
  const navigation = useNavigation();
  const [SelectedReportReason, setSelectedReportReason] = useState<string>('');
  const [ShowReportModalView, setShowReportModalView] =
    useState<boolean>(false);
  const [ReportAndBlockModal, setReportAndBlockModal] = useState(false);

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
      (a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    return sortedMessages;
  };

  const storeSingleChatFormat = (message: any) => {
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
      const existingMessage = unique.find((m: any) => m._id === message._id);

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
    socket.emit(GET_RECEIVER_SOCKET_EVENT, {to: params?.id});

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
    const handleReceivedMessage = () => {};

    const handleReceiverChat = async (chat: any) => {
      if (!OtherUserProfileData) {
        await getOtherUserDataCall();
      }
      const giftedChatMessages = storeSingleChatFormat(chat);
      if (giftedChatMessages) {
        socket.emit(READ_ALL, {to: OtherUserProfileData?._id});

        const updatedMessages = giftedChatMessages.map((message: any) => ({
          ...message,
          user: {...message.user, avatar: avatarUrl},
        }));

        setUserMessages(previousMessages =>
          GiftedChat.append(previousMessages, updatedMessages.flat()),
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

    const handleReadAllMessages = () => {};

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

        socket.emit(READ_ALL, {to: OtherUserProfileData?._id});
        socket.emit(CHAT_EVENT, chatData, (error: any) => {
          if (error) {
            showToast('Error', String(error?.message || error), 'error');
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
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            padding: 3,
            marginVertical: 1,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 20,
            backgroundColor: COLORS.White,
          },
          left: {
            padding: 3,
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
            lineHeight: 25,
            fontSize: 14.2,
            color: COLORS.Black,
            fontFamily: FONTS.Medium,
          },
          left: {
            lineHeight: 25,
            fontSize: 14.2,
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
    );
  };

  const CustomMessageText: React.FC<MessageTextProps<IMessage>> = props => {
    return (
      <MessageText
        {...props}
        linkStyle={{
          right: {color: COLORS.Primary},
          left: {color: COLORS.White},
        }}
      />
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

  const onBlockProfileClick = async () => {
    const BlockData = {
      eventName: ApiConfig.BlockProfile,
      blocked_to: params?.id,
    };

    const APIResponse = await UserService.UserRegister(BlockData);
    if (APIResponse && APIResponse?.code === 200) {
      await store.dispatch(onSwipeLeft(String(params?.id)));
      showToast(
        'User Blocked',
        `Your request to block ${OtherUserProfileData?.full_name} is successfully send`,
        'success',
      );
      navigation.goBack();
    } else {
      showToast('Error', 'Something went wrong', 'error');
    }
  };

  const onReportProfileClick = async () => {
    setShowReportModalView(false);

    const BlockData = {
      eventName: ApiConfig.ReportProfile,
      blocked_to: params?.id,
      reason: SelectedReportReason,
    };

    const APIResponse = await UserService.UserRegister(BlockData);
    if (APIResponse && APIResponse?.code === 200) {
      await store.dispatch(onSwipeLeft(String(params?.id)));
      showToast(
        'Success!',
        `Your report against ${OtherUserProfileData?.full_name} has been submitted. We appreciate your vigilance in maintaining a positive community.\nReason: ${SelectedReportReason}`,
        'success',
      );
      navigation.goBack();
    } else {
      showToast('Error', 'Something went wrong', 'error');
    }
  };

  return (
    <View style={styles.Container}>
      <ChatScreenHeader
        data={OtherUserProfileData}
        onRightIconPress={() => setReportAndBlockModal(true)}
      />
      <StatusBar backgroundColor={COLORS.White} barStyle={'dark-content'} />
      <View style={styles.ChatContainer}>
        <GiftedChat
          alignTop
          messages={userMessage}
          onSend={messages => onSend(messages)}
          user={{_id: 1, avatar: avatarUrl}}
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
          imageStyle={{left: 28}}
          onLongPress={() => {}}
          renderMessageText={CustomMessageText}
        />
      </View>

      <Modal
        visible={ReportAndBlockModal}
        transparent
        presentationStyle="overFullScreen">
        <View style={styles.BlockAndReportProfileView}>
          <View style={styles.blockAndReportContentView}>
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              style={styles.blockAndReportCloseButton}
              onPress={() => setReportAndBlockModal(false)}>
              <Image
                source={CommonIcons.CloseModal}
                style={{width: 35, height: 35}}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onBlockProfileClick}
              activeOpacity={ActiveOpacity}
              style={styles.BlockAndReportButtonView}>
              <Image
                resizeMode="contain"
                style={styles.BlockAndReportIcon}
                source={CommonIcons.block_profile_icon}
              />
              <Text style={styles.BlockAndReportText}>Block Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setReportAndBlockModal(false);
                setShowReportModalView(!ShowReportModalView);
              }}
              activeOpacity={ActiveOpacity}
              style={styles.BlockAndReportButtonView}>
              <Image
                resizeMode="contain"
                style={styles.BlockAndReportIcon}
                source={CommonIcons.report_profile_icon}
              />
              <Text style={styles.BlockAndReportText}>Report Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ReportUserModalView
        Visible={ShowReportModalView}
        setVisibility={setShowReportModalView}
        onReportPress={onReportProfileClick}
        SelectedReportReason={SelectedReportReason}
        setSelectedReportReason={setSelectedReportReason}
      />
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

  BlockAndReportProfileView: {
    width: '100%',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  BlockAndReportButtonView: {
    width: '47%',
    overflow: 'hidden',
    height: hp('7.5%'),
    marginVertical: hp('2%'),
    borderRadius: hp('5%'),
    backgroundColor: COLORS.White,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.Black,
    paddingHorizontal: hp('1%'),
    marginHorizontal: hp('0.5%'),
  },
  BlockAndReportIcon: {
    width: hp('2.4%'),
    height: hp('2.4%'),
  },
  BlockAndReportText: {
    fontFamily: FONTS.Bold,
    color: COLORS.Black,
    fontSize: hp('1.8%'),
    marginHorizontal: hp('0.5%'),
  },
  blockAndReportContentView: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%',
    borderRadius: 10,
    flexDirection: 'row',
  },
  blockAndReportCloseButton: {
    position: 'absolute',
    top: 20,
    right: 5,
    width: 50,
    height: 50,
  },
});
