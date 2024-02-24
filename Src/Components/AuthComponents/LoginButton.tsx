import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {CommonSize} from '../../Common/CommonSize';
import {ActiveOpacity, COLORS, FONTS} from '../../Common/Theme';

interface LoginButtonProps {
  Title: string;
  onPress: () => void;
  Icon: any;
  IsLoading: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  Title,
  onPress,
  Icon,
  IsLoading,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={ActiveOpacity}
      onPress={onPress}
      style={styles.LoginButtonContainer}>
      {IsLoading ? (
        <ActivityIndicator size={25} color={COLORS.Primary} />
      ) : (
        <View style={styles.ItemWarper}>
          <Image resizeMode="contain" source={Icon} style={styles.IconView} />

          <View style={styles.ButtonTextView}>
            <Text numberOfLines={2} style={styles.ButtonTitleText}>
              {Title}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default LoginButton;

const styles = StyleSheet.create({
  LoginButtonContainer: {
    width: '100%',
    height: hp('7%'),
    justifyContent: 'center',
    borderColor: COLORS.White,
    marginTop: CommonSize(15),
    borderWidth: CommonSize(2),
    borderRadius: CommonSize(50),
    backgroundColor: COLORS.White,
  },
  ItemWarper: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: CommonSize(15),
  },
  IconView: {
    alignSelf: 'center',
    width: CommonSize(19),
    height: CommonSize(19),
    justifyContent: 'center',
  },
  ButtonTextView: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  ButtonTitleText: {
    alignSelf: 'center',
    textAlign: 'center',
    color: COLORS.Black,
    fontFamily: FONTS.Bold,
    justifyContent: 'center',
    fontSize: hp('1.8%'),
  },
});
