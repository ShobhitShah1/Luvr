import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
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
import CommonIcons from '../../../../Common/CommonIcons';
import {COLORS, GROUP_FONT} from '../../../../Common/Theme';

interface CreateProfileProps {
  ProgressCount: number;
  Skip: boolean;
  handleSkipPress?: () => void;
  hideBack?: boolean;
}

const CreateProfileHeader: FC<CreateProfileProps> = ({
  ProgressCount,
  Skip,
  handleSkipPress,
  hideBack,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  return (
    <View style={styles.headerContainer}>
      <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.Secondary} />
      <View style={styles.buttonAndTitleContainer}>
        <TouchableOpacity
          style={styles.backButtonView}
          onPress={() => navigation.goBack()}>
          {!hideBack && (
            <Image
              resizeMode="contain"
              source={CommonIcons.TinderBack}
              style={styles.cancelButton}
            />
          )}
        </TouchableOpacity>

        <View style={styles.pageCountView}>
          {ProgressCount !== 0 && (
            <Text style={styles.pageCount}>{ProgressCount}/9</Text>
          )}
        </View>

        <View style={styles.skipButton}>
          {Skip && (
            <TouchableOpacity onPress={handleSkipPress}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default CreateProfileHeader;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    margin: hp('1%'),
    paddingHorizontal: hp('1.5%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonAndTitleContainer: {
    width: '100%',
    margin: hp('1.5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    width: hp('3.5%'),
    height: hp('3.5%'),
  },
  pageCountView: {
    width: '33.33%',
    justifyContent: 'center',
    right: hp('1%'),
  },
  pageCount: {
    ...GROUP_FONT.h3,
    fontSize: hp('1.9%'),
    textAlign: 'center',
  },
  skipText: {
    ...GROUP_FONT.h3,
    color: COLORS.Gray,
    textAlign: 'right',
    marginRight: hp('4%'),
  },
  backButtonView: {
    width: '33.33%',
    justifyContent: 'center',
    alignSelf: 'center',
    height: hp('3.5%'),
  },
  skipButton: {
    width: '33.33%',
    justifyContent: 'center',
  },
});
