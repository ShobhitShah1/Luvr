import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC} from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import CommonIcons from '../../../Common/CommonIcons';
import {ActiveOpacity, COLORS, GROUP_FONT} from '../../../Common/Theme';

interface HeaderProps {
  Title: string;
  onUpdatePress?: () => void;
  isLoading?: boolean;
}

const ProfileAndSettingHeader: FC<HeaderProps> = ({
  Title,
  onUpdatePress,
  isLoading,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  return (
    <View style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.White} />
      <View style={styles.ContentView}>
        <TouchableOpacity
          disabled={isLoading}
          activeOpacity={ActiveOpacity}
          onPress={() => navigation.goBack()}
          style={styles.ViewStyle}>
          <Image
            resizeMode="contain"
            style={styles.BackIcon}
            source={CommonIcons.TinderBack}
          />
        </TouchableOpacity>
        <View style={styles.TitleView}>
          <Text style={styles.Title}>{Title}</Text>
        </View>
        {Title !== 'Notification' ? (
          <TouchableOpacity
            disabled={isLoading}
            style={styles.ModalSubmitButton}
            onPress={onUpdatePress}
            activeOpacity={ActiveOpacity}>
            <Image
              source={CommonIcons.Check}
              tintColor={COLORS.White}
              style={styles.ModalSubmitIcon}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {/* <TouchableOpacity
          onPress={onUpdatePress}
          disabled={false}
          activeOpacity={ActiveOpacity}
          style={styles.AddIconAndOption}>
          <View style={styles.SettingView}>
            <Image
              source={CommonIcons.CheckMark}
              style={{width: 20, height: 20}}
            />
            <Text style={styles.SettingText}>Save</Text>
          </View>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default ProfileAndSettingHeader;

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    height: hp('8%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.White,
    shadowColor: COLORS.Black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  ContentView: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ViewStyle: {
    width: '10%',
    // backgroundColor: 'yellow',
    justifyContent: 'center',
  },
  BackIcon: {
    width: 25,
    height: 25,
  },
  TitleView: {
    width: '75%',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Title: {
    ...GROUP_FONT.h3,
    fontSize: 16,
    lineHeight: 25,
    color: COLORS.Black,
  },
  AddIconAndOption: {
    width: '10%',
    // backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  AddIcon: {
    width: hp('2.75%'),
    height: hp('2.75%'),
    right: hp('1.5%'),
  },
  MoreOptionIcon: {
    width: hp('2.6%'),
    height: hp('2.6%'),
  },
  SettingView: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  SettingText: {
    ...GROUP_FONT.h4,
    color: COLORS.Primary,
    textAlign: 'center',
  },
  ModalSubmitButton: {
    width: 25,
    height: 25,
    borderRadius: 500,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.Primary,
  },
  ModalSubmitIcon: {
    width: 15,
    height: 15,
    alignSelf: 'center',
  },
});

// import {
//   Image,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {FC} from 'react';
// import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {useNavigation} from '@react-navigation/native';
// import CommonIcons from '../../../Common/CommonIcons';
// import {ActiveOpacity, COLORS, GROUP_FONT} from '../../../Common/Theme';

// interface HeaderProps {
//   Title: string;
//   onUpdatePress?: () => void;
// }

// const ProfileAndSettingHeader: FC<HeaderProps> = ({Title, onUpdatePress}) => {
//   const navigation =
//     useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

//   return (
//     <View style={styles.Container}>
//       <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.White} />
//       <View style={styles.ContentView}>
//         <TouchableOpacity
//           activeOpacity={ActiveOpacity}
//           onPress={() => navigation.goBack()}
//           style={styles.ViewStyle}>
//           <Image
//             resizeMode="contain"
//             style={styles.BackIcon}
//             source={CommonIcons.TinderBack}
//           />
//         </TouchableOpacity>
//         <View style={styles.TitleView}>
//           <Text style={styles.Title}>{Title}</Text>
//         </View>
//         <TouchableOpacity
//           onPress={onUpdatePress}
//           disabled={Title === 'Notification' ? false : true}
//           activeOpacity={ActiveOpacity}
//           style={styles.AddIconAndOption}>
//           {Title === 'Notification' && (
//             <View style={styles.SettingView}>
//               <Image
//                 source={CommonIcons.delete_chat}
//                 style={styles.DeleteChatIcon}
//               />
//             </View>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default ProfileAndSettingHeader;

// const styles = StyleSheet.create({
//   Container: {
//     width: '100%',
//     height: hp('8%'),
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: COLORS.White,
//     shadowColor: COLORS.Black,
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },
//     shadowOpacity: 0.34,
//     shadowRadius: 6.27,
//     elevation: 10,
//   },
//   ContentView: {
//     width: '90%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   ViewStyle: {
//     width: '10%',
//     // backgroundColor: 'yellow',
//     justifyContent: 'center',
//   },
//   BackIcon: {
//     width: 25,
//     height: 25,
//   },
//   TitleView: {
//     width: '75%',
//     // backgroundColor: 'red',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   Title: {
//     ...GROUP_FONT.h3,
//     fontSize: 16,
//     lineHeight: 25,
//     color: COLORS.Black,
//   },
//   AddIconAndOption: {
//     width: '10%',
//     // backgroundColor: 'yellow',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   AddIcon: {
//     width: hp('2.75%'),
//     height: hp('2.75%'),
//     right: hp('1.5%'),
//   },
//   MoreOptionIcon: {
//     width: hp('2.6%'),
//     height: hp('2.6%'),
//   },
//   SettingView: {
//     justifyContent: 'center',
//     alignSelf: 'center',
//   },
//   SettingText: {
//     ...GROUP_FONT.h4,
//     color: COLORS.Primary,
//     textAlign: 'center',
//   },
//   DeleteChatIcon: {
//     width: 20,
//     height: 20,
//     resizeMode: 'contain',
//     alignSelf: 'center',
//     justifyContent: 'center',
//   },
// });
