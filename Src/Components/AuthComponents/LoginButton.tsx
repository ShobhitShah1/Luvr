import React from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { CommonSize } from '../../Common/CommonSize';
import { COLORS, FONTS } from '../../Common/Theme';
import { useTheme } from '../../Contexts/ThemeContext';

interface LoginButtonProps {
  Title: string;
  onPress: () => void;
  Icon: any;
  IsLoading: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({ Title, onPress, Icon, IsLoading }) => {
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress} style={styles.LoginButtonContainer}>
      {IsLoading ? (
        <ActivityIndicator size={25} color={colors.Primary} />
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
    </Pressable>
  );
};

export default LoginButton;

const styles = StyleSheet.create({
  ButtonTextView: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  ButtonTitleText: {
    alignSelf: 'center',
    color: COLORS.Black,
    fontFamily: FONTS.Bold,
    fontSize: hp('1.8%'),
    justifyContent: 'center',
    textAlign: 'center',
  },
  IconView: {
    alignSelf: 'center',
    height: CommonSize(19),
    justifyContent: 'center',
    width: CommonSize(19),
  },
  ItemWarper: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: CommonSize(15),
  },
  LoginButtonContainer: {
    backgroundColor: COLORS.White,
    borderColor: COLORS.White,
    borderRadius: CommonSize(50),
    borderWidth: CommonSize(2),
    height: hp('7%'),
    justifyContent: 'center',
    marginTop: CommonSize(15),
    width: '100%',
  },
});
