import Slider from '@react-native-community/slider';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CreateProfileHeader from './CreateProfileHeader';
import CreateProfileStyles from './styles';
import DraggableGrid from 'react-native-draggable-grid';

const AddRecentPics: FC = () => {
  let ProgressCount: number = 1;
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const [data, setdata] = useState([
    {name: '1', key: 'one'},
    {name: '2', key: 'two'},
    {name: '3', key: 'three'},
    {name: '4', key: 'four'},
    {name: '5', key: 'five'},
    {name: '6', key: 'six'},
    {name: '7', key: 'seven'},
    {name: '8', key: 'eight'},
    {name: '9', key: 'night'},
    {name: '0', key: 'zero'},
  ]);

  const render_item = (item: {name: string; key: string}) => {
    return (
      <View style={styles.item} key={item.key}>
        <Text style={styles.item_text}>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={ProgressCount} Skip={false} />

      <View style={CreateProfileStyles.ContentView}>
        <Text style={CreateProfileStyles.TitleText}>Add your recent pics</Text>
        <Text style={styles.CompatibilityText}>
          Upload 2 phots to start. Add 4 or more to make your profile stand out.
        </Text>
      </View>

      <DraggableGrid
        numColumns={3}
        renderItem={render_item}
        data={data}
        onDragRelease={data => {
          console.log('data:', data);
          setdata(data);
        }}
      />

      <View style={CreateProfileStyles.BottomButton}>
        <GradientButton
          Title={'Next'}
          Disabled={false}
          Navigation={() => {
            navigation.navigate('LoginStack', {
              screen: '',
            });
          }}
        />
      </View>
    </View>
  );
};

export default AddRecentPics;

const styles = StyleSheet.create({
  CompatibilityText: {
    ...GROUP_FONT.h3,
    marginVertical: hp('1%'),
    fontFamily: FONTS.Regular,
  },

  item: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderColor: 'red',
    borderWidth: hp('0.15%'),
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item_text: {
    ...GROUP_FONT.h4,
  },
});
