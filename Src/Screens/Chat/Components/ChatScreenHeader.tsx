import React, {FC} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../Common/CommonIcons';
import {ActiveOpacity, COLORS, FONTS} from '../../../Common/Theme';

const ChatScreenHeader: FC = () => {
  return (
    <View style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.White} />
      <View style={styles.ContentView}>
        {/* <View>
          <TouchableOpacity>
            <Image
              source={CommonIcons.TinderBack}
              style={styles.TinderBackIcon}
            />
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};

export default ChatScreenHeader;

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    height: hp('8%'),
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
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'red',
    justifyContent: 'space-between',
  },
});
