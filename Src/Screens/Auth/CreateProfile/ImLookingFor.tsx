import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import CreateProfileStyles from './styles';
import CreateProfileHeader from './CreateProfileHeader';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LookingFor from '../../../Components/Data/LookingFor';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

const ImLookingFor: FC = () => {
  let ProgressCount: number = 0.4;
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const renderItem = ({item, index}: {item: any; index: number}) => (
    <TouchableOpacity style={styles.GenderButtonView}></TouchableOpacity>
  );
  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={ProgressCount} Skip={false} />

      <View style={CreateProfileStyles.ContentView}>
        <Text style={CreateProfileStyles.TitleText}>I'm Looking For ...</Text>
        <Text style={styles.CompatibilityText}>
          increase compatibility by sharing yours!
        </Text>
      </View>

      <FlatList
        data={LookingFor}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />

      <View style={CreateProfileStyles.BottomButton}>
        <GradientButton
          Title={'Next'}
          Disabled={false}
          Navigation={() => {
            navigation.navigate('LoginStack', {
              screen: 'SexualOrientationScreen',
            });
          }}
        />
      </View>
    </View>
  );
};

export default ImLookingFor;

const styles = StyleSheet.create({
  CompatibilityText: {
    ...GROUP_FONT.h3,
    marginVertical: hp('1%'),
    fontFamily: FONTS.Regular,
  },
});
