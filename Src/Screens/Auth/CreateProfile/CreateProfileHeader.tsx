import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useEffect, useRef} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../Common/CommonIcons';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';

const {width} = Dimensions.get('window');

interface CreateProfileProps {
  ProgressCount: number;
  Skip: boolean;
}

const CreateProfileHeader: FC<CreateProfileProps> = ({ProgressCount, Skip}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  return (
    <View>
      <Progress.Bar
        color={COLORS.Primary}
        width={width}
        progress={ProgressCount}
        animated={true}
        animationType="timing"
        animationConfig={{bounciness: 10}}
        borderRadius={0}
        borderColor="transparent"
        unfilledColor="rgba(217, 217, 217, 1)"
      />

      <View style={styles.CancelButtonAndTitleText}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={CommonIcons.TinderBack} style={styles.CancelButton} />
        </TouchableOpacity>
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
  );
};

export default CreateProfileHeader;

const styles = StyleSheet.create({
  CancelButtonAndTitleText: {
    margin: hp('1.5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  CancelButton: {
    width: hp('2.7%'),
    height: hp('2.7%'),
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
  },
});
