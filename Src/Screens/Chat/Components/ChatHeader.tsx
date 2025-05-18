import React, { memo } from 'react';
import { ProfileType } from '../../../Types/ProfileType';
import ChatScreenHeader from './ChatScreenHeader';

interface ChatHeaderProps {
  data: ProfileType | null;
  onRightIconPress: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ data, onRightIconPress }) => {
  return <ChatScreenHeader data={data} onRightIconPress={onRightIconPress} />;
};

export default memo(ChatHeader);
