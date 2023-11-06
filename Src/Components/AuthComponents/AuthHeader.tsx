import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import CommonIcons from '../../Common/CommonIcons';
import CommonLogos from '../../Common/CommonLogos';
import {CommonSize} from '../../Common/CommonSize';
import {ActiveOpacity, COLORS} from '../../Common/Theme';

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
          source={Icon ? Icon : CommonIcons.TinderBack}
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
    height: CommonSize(35),
  },
  BackIconView: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  BackIcon: {
    width: CommonSize(18),
    height: CommonSize(18),
    tintColor: COLORS.Brown,
  },
  LogoView: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: CommonSize(25),
  },
  Logo: {
    width: CommonSize(35),
    height: CommonSize(35),
  },
});
