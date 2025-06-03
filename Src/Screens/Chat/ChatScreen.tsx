/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { ParamListBase, RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import React, { memo, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, View } from 'react-native';
import { GiftedChat, IMessage, MessageText, MessageTextProps } from 'react-native-gifted-chat';
import GradientView from '../../Common/GradientView';
import ReportUserModalView from '../../Components/ReportUserModalView';
import ApiConfig from '../../Config/ApiConfig';
import { useTheme } from '../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../Hooks/useCustomNavigation';
import { onSwipeLeft } from '../../Redux/Action/actions';
import { store } from '../../Redux/Store/store';
import UserService from '../../Services/AuthService';
import { useCustomToast } from '../../Utils/toastUtils';
import ChatBubble from './Components/ChatBubble';
import ChatHeader from './Components/ChatHeader';
import ChatInput from './Components/ChatInput';
import ReportOrBlockModal from './Components/ReportOrBlockModal';
import { useChat } from './hooks/useChat';
import { styles } from './styles';

interface ChatData {
  params: {
    ChatData: any;
    id?: number;
  };
}

type ChatScreenRouteProp = RouteProp<ParamListBase, 'ChatScreen'> & ChatData;

const ChatScreen = () => {
  const { colors, isDark } = useTheme();
  const isFocused = useIsFocused();
  const navigation = useCustomNavigation();
  const { showToast } = useCustomToast();
  const { params } = useRoute<ChatScreenRouteProp>();

  const { userData } = store?.getState().user || ({} as any);
  const currentLoginUserId = userData?._id;
  const currentUserImage = userData?.recent_pik;
  const currentLoginUserFullName = userData?.full_name;

  const [selectedReportReason, setSelectedReportReason] = useState<string>('');
  const [showReportModalView, setShowReportModalView] = useState<boolean>(false);
  const [reportAndBlockModal, setReportAndBlockModal] = useState(false);

  const { userMessage, otherUserProfileData, avatarUrl, onSend, isLoading, canSendMessage } = useChat(
    currentLoginUserId,
    currentUserImage,
    currentLoginUserFullName,
    params?.id,
    isFocused
  );

  const onBlockProfileClick = async () => {
    const blockData = {
      eventName: ApiConfig.BlockProfile,
      blocked_to: params?.id,
    };

    const apiResponse = await UserService.UserRegister(blockData);
    if (apiResponse && apiResponse?.code === 200) {
      store.dispatch(onSwipeLeft(String(params?.id)));

      showToast(
        'User Blocked',
        `Your request to block ${otherUserProfileData?.full_name} is successfully send`,
        'success'
      );

      navigation.canGoBack() && navigation.goBack();
    } else {
      showToast('Error', 'Something went wrong', 'error');
    }
  };

  const onReportProfileClick = async () => {
    setShowReportModalView(false);

    const blockData = {
      eventName: ApiConfig.ReportProfile,
      blocked_to: params?.id,
      reason: selectedReportReason,
    };

    const apiResponse = await UserService.UserRegister(blockData);
    if (apiResponse && apiResponse?.code === 200) {
      store.dispatch(onSwipeLeft(String(params?.id)));
      showToast(
        'Success!',
        `Your report against ${otherUserProfileData?.full_name} has been submitted. We appreciate your vigilance in maintaining a positive community.\nReason: ${selectedReportReason}`,
        'success'
      );
      navigation.canGoBack() && navigation.goBack();
    } else {
      showToast('Error', 'Something went wrong', 'error');
    }
  };

  const CustomMessageText: React.FC<MessageTextProps<IMessage>> = (props) => {
    return (
      <MessageText
        {...props}
        linkStyle={{
          right: { color: colors.Primary },
          left: { color: colors.White },
        }}
      />
    );
  };

  return (
    <GradientView>
      <KeyboardAvoidingView behavior={'padding'} style={styles.Container}>
        <ChatHeader data={otherUserProfileData} onRightIconPress={() => setReportAndBlockModal(true)} />
        <View style={styles.ChatContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.Primary} />
            </View>
          ) : (
            <GiftedChat
              alignTop
              isKeyboardInternallyHandled
              forceGetKeyboardHeight
              keyboardShouldPersistTaps="handled"
              messages={userMessage}
              onSend={(messages) => onSend(messages)}
              user={{ _id: 1, avatar: avatarUrl }}
              isTyping={false}
              messagesContainerStyle={styles.messagesContainer}
              renderInputToolbar={(props) => <ChatInput inputToolbarProps={props} canSendMessage={canSendMessage} />}
              timeTextStyle={{
                left: { color: colors.White },
                right: { color: isDark ? colors.White : colors.Black },
              }}
              imageStyle={{ left: 28 }}
              onLongPress={() => {}}
              renderMessageText={CustomMessageText}
              renderBubble={(props) => <ChatBubble {...props} />}
            />
          )}
        </View>

        <ReportOrBlockModal
          isVisible={reportAndBlockModal}
          setReportAndBlockModal={setReportAndBlockModal}
          setShowReportModalView={setShowReportModalView}
          onBlockProfileClick={onBlockProfileClick}
          ShowReportModalView={showReportModalView}
        />

        <ReportUserModalView
          Visible={showReportModalView}
          setVisibility={setShowReportModalView}
          onReportPress={onReportProfileClick}
          SelectedReportReason={selectedReportReason}
          setSelectedReportReason={setSelectedReportReason}
        />

        {/* {Platform.OS === 'android' && <KeyboardAvoidingView behavior={'padding'} />} */}
        <SafeAreaView />
      </KeyboardAvoidingView>
    </GradientView>
  );
};

export default memo(ChatScreen);
