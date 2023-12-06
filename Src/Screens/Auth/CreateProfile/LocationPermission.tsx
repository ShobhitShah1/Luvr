import React, {FC} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonImages from '../../../Common/CommonImages';
import {COLORS} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const LocationPermission: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  return (
    <View style={styles.container}>
      <View style={styles.MiddleImageView}>
        <Image source={CommonImages.Location} style={styles.LocationImage} />
      </View>

      <View style={styles.BottomButtonView}>
        <GradientButton
          Title="Allow"
          Disabled={false}
          Navigation={() =>
            navigation.navigate('LoginStack', {
              screen: 'ManageContacts',
            })
          }
        />
      </View>
    </View>
  );
};

export default LocationPermission;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: hp('1.3%'),
    backgroundColor: COLORS.Secondary,
  },
  MiddleImageView: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BottomButtonView: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: hp('1%'),
  },
  LocationImage: {
    width: hp('33%'),
    height: hp('33%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
