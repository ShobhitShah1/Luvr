import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {CommonSize} from '../../Common/CommonSize';
import {ActiveOpacity, COLORS, FONTS} from '../../Common/Theme';

interface LoginButtonProps {
  Title: string;
  onPress: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({Title, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={ActiveOpacity}
      onPress={onPress}
      style={styles.LoginButtonContainer}>
      <Text style={styles.ButtonTitleText}>{Title}</Text>
    </TouchableOpacity>
  );
};

export default LoginButton;

const styles = StyleSheet.create({
  LoginButtonContainer: {
    width: '100%',
    alignSelf: 'center',
    height: CommonSize(45),
    justifyContent: 'center',
    borderColor: COLORS.White,
    borderWidth: CommonSize(2),
    borderRadius: CommonSize(50),
    marginTop: CommonSize(15),
  },
  ButtonTitleText:{
    textAlign:'center',
    color: COLORS.White,
    fontFamily: FONTS.Bold,
    fontSize: CommonSize(14),
  }
});
