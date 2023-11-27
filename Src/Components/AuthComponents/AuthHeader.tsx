import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import CommonIcons from '../../Common/CommonIcons';
import CommonLogos from '../../Common/CommonLogos';
import {CommonSize} from '../../Common/CommonSize';
import {ActiveOpacity, COLORS} from '../../Common/Theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface AuthHeaderProps {
  Icon?: string;
  Logo?: boolean;
  Value?: number;
  onPress: () => void;
}
const AuthHeader: React.FC<AuthHeaderProps> = ({
  Icon,
  Logo,
  Value,
  onPress,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  return (
    <View style={styles.HeaderView}>
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        onPress={() => {
          if (onPress() !== undefined) {
            onPress;
          } else {
            navigation.goBack();
          }
        }}
        style={styles.BackIconView}>
        <Image
          resizeMode="contain"
          style={styles.BackIcon}
          source={ CommonIcons.TinderBack}
        />
      </TouchableOpacity>
      {Logo && (
        <React.Fragment>
          <View style={styles.LogoView}>
            <Image
              resizeMode="contain"
              style={styles.Logo}
              source={CommonLogos.TinderColorLogo}
            />
          </View>
          <View />
        </React.Fragment>
      )}
    </View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  HeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: hp('4.6%'),
  },
  BackIconView: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  BackIcon: {
    width: hp('2.4%'),
    height: hp('2.4%'),
    tintColor: COLORS.Brown,
  },
  LogoView: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: CommonSize(25),
  },
  Logo: {
    width: hp('4.6%'),
    height: hp('4.6%'),
  },
});
