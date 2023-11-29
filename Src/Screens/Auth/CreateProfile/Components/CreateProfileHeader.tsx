import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';
import {COLORS, FONTS, GROUP_FONT} from '../../../../Common/Theme';
 
interface CreateProfileProps {
  ProgressCount: number;
  Skip: boolean;
}

const CreateProfileHeader: FC<CreateProfileProps> = ({ProgressCount, Skip}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  return (
    <View
      style={{
        width: '100%',
        margin: hp('1%'),
        paddingHorizontal: hp('1.5%'),
        justifyContent: 'center',
        alignSelf: 'center',
      }}>
      <View style={styles.CancelButtonAndTitleText}>
        <TouchableOpacity
          style={{
            width: '33.33%',
            justifyContent: 'center',
            alignSelf: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Image
            resizeMode="contain"
            source={CommonIcons.TinderBack}
            style={styles.CancelButton}
          />
        </TouchableOpacity>

        <View
          style={{
            width: '33.33%',
            justifyContent: 'center',
            right: hp('1%'),
          }}>
          {ProgressCount !== 0 && (
            <Text style={{...GROUP_FONT.h3, fontSize: hp('1.9%'), textAlign: 'center'}}>
              {ProgressCount}/9
            </Text>
          )}
        </View>

        <View
          style={{
            width: '33.33%',
            justifyContent: 'center',
          }}>
          {Skip && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('LoginStack', {
                  screens: '',
                })
              }>
              <Text style={styles.SkipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default CreateProfileHeader;

const styles = StyleSheet.create({
  CancelButtonAndTitleText: {
    width: '100%',
    margin: hp('1.5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  CancelButton: {
    width: hp('3.5%'),
    height: hp('3.5%'),
  },
  TitleContainer: {
    marginTop: hp('2.7%'),
  },
  TitleText: {
    fontSize: hp('2.7%'),
    color: COLORS.Black,
    fontFamily: FONTS.Bold,
  },
  Container: {
    flex: 1,
  },
  BottomButton: {
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: hp('1.5%'),
  },
  SkipText: {
    ...GROUP_FONT.h3,
    color: COLORS.Gray,
    textAlign: 'right',
    marginRight: hp('4%'),
  },
});
