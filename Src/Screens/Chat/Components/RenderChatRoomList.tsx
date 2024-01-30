/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {TouchableOpacity, Image, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {ActiveOpacity, COLORS, GROUP_FONT} from '../../../Common/Theme';
import {store} from '../../../Redux/Store/store';
import CommonIcons from '../../../Common/CommonIcons';
import CommonImages from '../../../Common/CommonImages';
import {DummyImage} from '../../../Config/Setting';

interface MessageType {
  id: string;
  is_read: number;
  message: string;
  time: number;
}

interface ChatRoomDataType {
  chat: MessageType[];
  last_updated_time: number;
  name: string;
  reciver_socket_id: string | null;
  to: string;
}

interface ChatRoomProps {
  item: ChatRoomDataType;
  index: number;
}

const RenderChatRoomList = ({item, index}: ChatRoomProps) => {
  const navigation = useNavigation();
  console.log('RenderChatRoomList:--:>', item);

  // Ensure item is not null and has the expected structure
  if (!item || !item.chat || !Array.isArray(item.chat)) {
    return null; // Render nothing if the data is invalid
  }

  // Sort chat messages by time to get the latest message first
  const sortedChat = item.chat.slice().sort((a, b) => b.time - a.time);
  const latestMessage = sortedChat[0];

  // Format the time of the latest message
  const formattedTime =
    latestMessage &&
    new Date(latestMessage.time).toLocaleTimeString([], {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

  return (
    <TouchableOpacity
      key={index}
      activeOpacity={ActiveOpacity}
      onPress={() => {
        navigation.navigate('Chat', {id: item.to});
      }}
      style={styles.chatRoomContainerView}>
      <View style={styles.profilePicView}>
        <FastImage
          resizeMode="cover"
          style={styles.profilePic}
          source={CommonImages.WelcomeBackground}
        />
      </View>
      <View style={styles.nameAndMessageView}>
        <View style={styles.nameAndIconView}>
          <Text
            numberOfLines={1}
            style={[
              styles.nameText,
              {
                color:
                  latestMessage?.is_read === 1 ? COLORS.Black : COLORS.Primary,
              },
            ]}>
            {item.name}
          </Text>
          <Image
            source={CommonIcons.Verification_Icon}
            style={styles.verifyIcon}
          />
        </View>
        <Text
          numberOfLines={2}
          style={[
            styles.lastMessageText,
            {
              color:
                latestMessage?.is_read === 1
                  ? 'rgba(108, 108, 108, 1)'
                  : COLORS.Primary,
            },
          ]}>
          {latestMessage?.message}
        </Text>
      </View>
      <View style={styles.timeView}>
        <Text style={styles.timeText}>{formattedTime}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RenderChatRoomList;

const styles = StyleSheet.create({
  chatRoomContainerView: {
    width: '90%',
    height: 80,
    borderRadius: 25,
    marginVertical: 8,
    overflow: 'hidden',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    backgroundColor: COLORS.White,
    justifyContent: 'space-between',
  },
  profilePicView: {
    width: '20%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
  },
  nameAndMessageView: {
    width: '60%',
    overflow: 'hidden',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  nameAndIconView: {
    width: '90%',
    flexDirection: 'row',
  },
  nameText: {
    ...GROUP_FONT.h3,
    color: COLORS.Black,
  },
  verifyIcon: {
    width: 16,
    height: 16,
    marginLeft: 5,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  lastMessageText: {
    ...GROUP_FONT.body4,
    color: 'rgba(108, 108, 108, 1)',
  },
  timeView: {
    width: '20%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    ...GROUP_FONT.body4,
    color: 'rgba(108, 108, 108, 1)',
  },
});

// /* eslint-disable react-native/no-inline-styles */
// import React, {FC} from 'react';
// import FastImage from 'react-native-fast-image';
// import CommonIcons from '../../../Common/CommonIcons';
// import {useNavigation} from '@react-navigation/native';
// import {chatRoomDataType} from '../../../Types/chatRoomDataType';
// import {ActiveOpacity, COLORS, GROUP_FONT} from '../../../Common/Theme';
// import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import {DummyImage} from '../../../Config/Setting';
// import {store} from '../../../Redux/Store/store';
// import CommonImages from '../../../Common/CommonImages';

// interface MessageType {
//   id: string;
//   is_read: number;
//   message: string;
//   time: number;
// }

// interface ChatRoomDataType {
//   chat: MessageType[];
//   last_updated_time: number;
//   name: string;
//   reciver_socket_id: string | null;
//   to: string;
// }

// interface ChatRoomProps {
//   item: ChatRoomDataType;
//   index: number;
// }

// const RenderChatRoomList: FC<ChatRoomProps> = ({item, index}) => {
//   const CurrentLoginUserId = store.getState().user?.userData?._id;
//   const navigation = useNavigation<any>();

//   const FilterData = item.chat
//     .filter(data => data.id !== CurrentLoginUserId)
//     .sort((a, b) => b.time - a.time);
//   console.log(
//     'FilterData',
//     item.chat.sort((a, b) => b.time - a.time)[0].message,
//   );
//   const formattedTime = new Date(
//     item.chat.sort((a, b) => b.time - a.time)[0].time,
//   ).toLocaleTimeString([], {
//     hour: 'numeric',
//     minute: 'numeric',
//     hour12: true,
//   });
//   return (
//     <TouchableOpacity
//       key={index}
//       activeOpacity={ActiveOpacity}
//       onPress={() => {
//         navigation.navigate('Chat', {id: FilterData[0].id});
//       }}
//       style={styles.ChatRoomContainerView}>
//       <View style={styles.ProfilePicView}>
//         <FastImage
//           resizeMode="cover"
//           style={styles.ProfilePic}
//           source={CommonImages.WelcomeBackground}
//         />
//       </View>
//       <View style={styles.NameAndMessageView}>
//         <View style={styles.NameAndIconView}>
//           <Text
//             numberOfLines={1}
//             style={[
//               styles.NameText,
//               {
//                 color:
//                   item.chat.sort((a, b) => b.time - a.time)[0].is_read === 1
//                     ? COLORS.Black
//                     : COLORS.Primary,
//               },
//             ]}>
//             {item.name}
//           </Text>
//           <Image
//             source={CommonIcons.Verification_Icon}
//             style={styles.VerifyIcon}
//           />
//         </View>
//         <Text
//           numberOfLines={2}
//           style={[
//             styles.LastMessageText,
//             {
//               color:
//                 item.chat.sort((a, b) => b.time - a.time)[0].is_read === 1
//                   ? 'rgba(108, 108, 108, 1)'
//                   : COLORS.Primary,
//             },
//           ]}>
//           {item.chat.sort((a, b) => b.time - a.time)[0].message}
//           {/* {item?.lastMessage} */}
//         </Text>
//       </View>
//       <View style={styles.TimeView}>
//         <Text style={styles.TimeText}>{formattedTime}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default RenderChatRoomList;

// const styles = StyleSheet.create({
//   ChatRoomContainerView: {
//     width: '90%',
//     height: 80,
//     borderRadius: 25,
//     marginVertical: 8,
//     overflow: 'hidden',
//     alignSelf: 'center',
//     flexDirection: 'row',
//     paddingHorizontal: 10,
//     backgroundColor: COLORS.White,
//     justifyContent: 'space-between',
//   },
//   ProfilePicView: {
//     width: '20%',
//     overflow: 'hidden',
//     alignItems: 'center',
//     // backgroundColor: 'red',
//     justifyContent: 'center',
//   },
//   ProfilePic: {
//     width: 60,
//     height: 60,
//     borderRadius: 50,
//     justifyContent: 'center',
//   },
//   NameAndMessageView: {
//     width: '60%',
//     overflow: 'hidden',
//     paddingHorizontal: 10,
//     justifyContent: 'center',
//     // backgroundColor: 'yellow',
//   },
//   NameAndIconView: {
//     width: '90%',
//     flexDirection: 'row',
//   },
//   NameText: {
//     ...GROUP_FONT.h3,
//     color: COLORS.Black,
//   },
//   VerifyIcon: {
//     width: 16,
//     height: 16,
//     marginLeft: 5,
//     alignSelf: 'center',
//     justifyContent: 'center',
//   },
//   LastMessageText: {
//     ...GROUP_FONT.body4,
//     color: 'rgba(108, 108, 108, 1)',
//   },
//   TimeView: {
//     width: '20%',
//     overflow: 'hidden',
//     alignItems: 'center',
//     justifyContent: 'center',
//     // backgroundColor: 'green',
//   },
//   TimeText: {
//     ...GROUP_FONT.body4,
//     color: 'rgba(108, 108, 108, 1)',
//   },
// });
