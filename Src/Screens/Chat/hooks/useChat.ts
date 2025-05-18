import { useCallback, useEffect, useState } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { Socket, io } from 'socket.io-client';
import TextString from '../../../Common/TextString';
import ApiConfig from '../../../Config/ApiConfig';
import {
  CHAT_EVENT,
  GET_RECEIVER_SOCKET_EVENT,
  JOIN_EVENT,
  LIST_EVENT,
  MESSAGE_EVENT,
  READ_ALL,
} from '../../../Config/Setting';
import { useSubscriptionModal } from '../../../Contexts/SubscriptionModalContext';
import { useUserData } from '../../../Contexts/UserDataContext';
import UserService from '../../../Services/AuthService';
import { ProfileType } from '../../../Types/ProfileType';
import { useCustomToast } from '../../../Utils/toastUtils';

const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const useChat = (
  currentUserId: string,
  currentUserImage: string[],
  currentUserFullName: string,
  otherUserId: string | number | undefined,
  isFocused: boolean
) => {
  const [userMessage, setUserMessages] = useState<IMessage[]>([]);
  const [countMessage, setCountMessage] = useState(0);
  const [otherUserProfileData, setOtherUserProfileData] = useState<ProfileType | null>(null);
  const [socket, setSocket] = useState<Socket>();
  const [receiverSocketId, setReceiverSocketId] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [receivedMessageCount, setReceivedMessageCount] = useState(0);
  const { showToast } = useCustomToast();
  const { subscription } = useUserData();
  const { showSubscriptionModal } = useSubscriptionModal();

  const canSendMessage = subscription?.isActive ? true : receivedMessageCount !== 0;

  const getOtherUserDataCall = async () => {
    try {
      const data = {
        eventName: 'get_other_profile',
        id: otherUserId,
      };

      const apiResponse = await UserService.UserRegister(data);

      if (apiResponse?.code === 200 && apiResponse.data) {
        setOtherUserProfileData(apiResponse.data);
        if (apiResponse.data && apiResponse.data?.recent_pik) {
          setAvatarUrl(ApiConfig.IMAGE_BASE_URL + apiResponse.data?.recent_pik[0]);
        }
      }
    } catch (error) {
      console.error('Error in getOtherUserDataCall:', error);
    }
  };

  const transformDataForGiftedChat = (apiData: any) => {
    let dataArray = Array.isArray(apiData) ? apiData : [apiData];

    const filteredMessages = dataArray.filter((item) => {
      return item.to === currentUserId || item.to === otherUserId;
    });

    const allMessages = filteredMessages.reduce((accumulator, currentItem) => {
      return accumulator.concat(currentItem.chat);
    }, []);

    const receivedMessages = allMessages.filter((message: any) => message.id !== currentUserId);

    setReceivedMessageCount(receivedMessages.length);

    const giftedChatMessages = allMessages.map((message: any) => {
      return {
        _id: generateRandomId(),
        text: message.message,
        createdAt: new Date(message.time),
        user: {
          _id: message.id === currentUserId ? 1 : 0,
          name: message.id === currentUserId ? currentUserFullName : '',
          avatar: avatarUrl,
        },
      };
    });

    return giftedChatMessages.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const storeSingleChatFormat = (message: any) => {
    setCountMessage(1);

    return [
      {
        _id: generateRandomId(),
        text: message?.message,
        createdAt: new Date(message?.last_updated_time),
        user: {
          _id: message?.from === currentUserId ? 1 : 0,
          name: message?.from === currentUserId ? currentUserFullName : message?.from_name,
          avatar: avatarUrl,
        },
      },
    ];
  };

  const removeDuplicates = (messages: any[]) => {
    return messages.reduce((unique, message) => {
      const existingMessage = unique.find((m: any) => m._id === message._id);
      if (!existingMessage) {
        unique.push(message);
      }
      return unique;
    }, []);
  };

  useEffect(() => {
    if (isFocused) {
      getOtherUserDataCall();

      const socketInstance = io(ApiConfig.SOCKET_BASE_URL);
      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [isFocused]);

  useEffect(() => {
    if (!socket) return;

    socket.emit(JOIN_EVENT, {
      id: currentUserId,
      to_profile: otherUserProfileData?.recent_pik[0],
    });

    socket.emit(GET_RECEIVER_SOCKET_EVENT, { to: otherUserId });
    socket.emit(LIST_EVENT, { id: currentUserId });
    socket.emit(READ_ALL, { to: otherUserProfileData?._id });

    const handleListResponse = async (data: { data: any }) => {
      const giftedChatMessages = transformDataForGiftedChat(data.data);

      if (giftedChatMessages && giftedChatMessages.length !== 0) {
        const uniqueMessages = await removeDuplicates([...userMessage, ...giftedChatMessages]);
        setUserMessages(uniqueMessages);
      }

      setIsLoading(false);
    };

    const handleReceiverChat = async (chat: any) => {
      if (!otherUserProfileData) {
        await getOtherUserDataCall();
      }
      const giftedChatMessages = storeSingleChatFormat(chat);
      if (giftedChatMessages) {
        socket.emit(READ_ALL, { to: otherUserProfileData?._id });
        const updatedMessages = giftedChatMessages.map((message: any) => ({
          ...message,
          user: { ...message.user, avatar: avatarUrl },
        }));
        setUserMessages((previousMessages) => GiftedChat.append(previousMessages, updatedMessages.flat()));
      }
    };

    const handleReceiverSocketId = (data: { to_socket_id: string }) => {
      setReceiverSocketId(data?.to_socket_id);
    };

    const handleJoinResponse = (data: any) => {
      if (data && data.id === otherUserId) {
        setReceiverSocketId(data.socket_id);
      }
    };

    socket.on(JOIN_EVENT, handleJoinResponse);
    socket.on(READ_ALL, () => {});
    socket.on(LIST_EVENT, handleListResponse);
    socket.on(MESSAGE_EVENT, () => {});
    socket.on(CHAT_EVENT, handleReceiverChat);
    socket.on(GET_RECEIVER_SOCKET_EVENT, handleReceiverSocketId);

    return () => {
      socket.off(JOIN_EVENT, handleJoinResponse);
      socket.off(READ_ALL, () => {});
      socket.off(LIST_EVENT, handleListResponse);
      socket.off(MESSAGE_EVENT, () => {});
      socket.off(CHAT_EVENT, handleReceiverChat);
      socket.off(GET_RECEIVER_SOCKET_EVENT, handleReceiverSocketId);
    };
  }, [socket, otherUserId, avatarUrl]);

  const onSend = useCallback(
    async (messages: IMessage[]) => {
      if (!canSendMessage) {
        showToast(TextString.premiumFeatureAccessTitle, TextString.premiumFeatureAccessDescription, 'error');
        setTimeout(() => {
          showSubscriptionModal();
        }, 2000);
        return;
      }

      setCountMessage(1);
      if (!otherUserProfileData) {
        await getOtherUserDataCall();
      }

      if (socket) {
        const chatData = {
          ...(userMessage?.length === 0 ? { is_first: 1 } : {}),
          to: otherUserId,
          reciver_socket_id: receiverSocketId || null,
          from_name: currentUserFullName,
          to_name: otherUserProfileData?.full_name,
          message: messages[0].text,
          to_profile: otherUserProfileData?.recent_pik[0],
          from_profile: currentUserImage[0],
        };
        setUserMessages((previousMessages) => GiftedChat.append(previousMessages, messages));

        socket.emit(READ_ALL, { to: otherUserProfileData?._id });
        socket.emit(CHAT_EVENT, chatData, (error: any) => {
          if (error) {
            showToast('Error', String(error?.message || error), 'error');
          }
        });
      }
    },
    [
      socket,
      currentUserId,
      otherUserProfileData,
      currentUserFullName,
      receiverSocketId,
      countMessage,
      userMessage,
      canSendMessage,
    ]
  );

  return {
    userMessage,
    otherUserProfileData,
    avatarUrl,
    onSend,
    isLoading,
    canSendMessage,
  };
};
