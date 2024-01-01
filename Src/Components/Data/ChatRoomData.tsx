import {imageArray} from '../../Config/Setting';
import {chatRoomDataType} from '../../Types/chatRoomDataType';

export const chatRoomData: chatRoomDataType[] = [
  {
    id: 1,
    name: 'Shobhit',
    profilePik: imageArray[0],
    time: '10:20 AM',
    lastMessage: 'Hello, how are you',
    isRead: true,
  },
  {
    id: 2,
    name: 'Test User',
    profilePik: imageArray[1],
    time: '10:20 AM',
    lastMessage: 'Let’s meet today',
    isRead: false,
  },
  {
    id: 3,
    name: 'Dummy Me',
    time: 'Yesterday',
    profilePik: imageArray[2],
    lastMessage: 'Can’t wait to see you...',
    isRead: true,
  },
  {
    id: 4,
    name: 'New User',
    profilePik: imageArray[3],
    time: 'Yesterday',
    lastMessage: 'Miss you darling',
    isRead: true,
  },
];
