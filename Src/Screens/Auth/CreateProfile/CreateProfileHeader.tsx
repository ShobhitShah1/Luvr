import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC} from 'react';
import * as Progress from 'react-native-progress';
import CommonIcons from '../../../Common/CommonIcons';
import {COLORS, FONTS} from '../../../Common/Theme';
import {CommonSize} from '../../../Common/CommonSize';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

interface CreateProfileProps {
  ProgressCount: number;
}

const CreateProfileHeader: FC<CreateProfileProps> = ({ProgressCount}) => {
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
      </View>
    </View>
  );
};

export default CreateProfileHeader;

const styles = StyleSheet.create({
  CancelButtonAndTitleText: {
    margin: CommonSize(10),
  },
  CancelButton: {
    width: CommonSize(20),
    height: CommonSize(20),
  },
  TitleContainer: {
    marginTop: CommonSize(20),
  },
  TitleText: {
    fontSize: CommonSize(20),
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
    bottom: CommonSize(10),
  },
});
