import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {CommonSize} from '../../Common/CommonSize';
import {ActiveOpacity, COLORS, FONTS} from '../../Common/Theme';

interface LoginButtonProps {
  Title: string;
  onPress: () => void;
  Icon: any;
}

const LoginButton: React.FC<LoginButtonProps> = ({Title, onPress, Icon}) => {
  return (
    <TouchableOpacity
      activeOpacity={ActiveOpacity}
      onPress={onPress}
      style={styles.LoginButtonContainer}>
      <View style={styles.ItemWarper}>
        <Image resizeMode="contain" source={Icon} style={styles.IconView} />
        <View style={styles.ButtonTextView}>
          <Text style={styles.ButtonTitleText}>{Title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LoginButton;

const styles = StyleSheet.create({
  LoginButtonContainer: {
    width: '100%',
    height: CommonSize(45),
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
    width: CommonSize(16),
    height: CommonSize(16),
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
    fontSize: CommonSize(14.5),
  },
});
