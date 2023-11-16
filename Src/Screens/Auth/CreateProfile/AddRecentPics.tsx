import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DraggableGrid from 'react-native-draggable-grid';
import Animated from 'react-native-reanimated';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import {
  addUrlToItem,
  deleteUrlFromItem,
  sortByUrl,
} from '../../../Utils/ImagePickerUtils';
import CreateProfileHeader from './CreateProfileHeader';
import CreateProfileStyles from './styles';
import * as ImagePicker from 'react-native-image-picker';

const AddUserPhoto = ({picture, onDelete, onAdd}: any) => {
  const hasPicture = !!picture.url;

  return (
    <TouchableOpacity
      onPress={hasPicture ? onDelete : onAdd}
      style={[
        styles.item,
        {
          borderWidth: !hasPicture ? hp('0.15%') : 0,
          borderStyle: !hasPicture ? 'dashed' : undefined,
        },
      ]}
      key={picture?.url}>
      {picture?.url && (
        <Animated.View style={styles.UserImageContainer}>
          <Image
            source={{uri: picture?.url}}
            resizeMode="cover"
            style={{width: '100%', height: '100%', overflow: 'hidden'}}
          />
        </Animated.View>
      )}

      <Animated.View
        style={[
          styles.UserImageAddAndCloseButton,
          {
            backgroundColor: hasPicture ? COLORS.White : COLORS.Primary,
            borderColor: hasPicture ? COLORS.Gray : COLORS.White,
          },
        ]}>
        {hasPicture ? (
          <Entypo
            name={'plus'}
            size={hp('3%')}
            color={hasPicture ? COLORS.Gray : COLORS.White}
            style={{justifyContent: 'center', alignSelf: 'center'}}
          />
        ) : (
          <Ionicons
            name={'close'}
            size={hp('3%')}
            color={hasPicture ? COLORS.Gray : COLORS.White}
            style={{justifyContent: 'center', alignSelf: 'center'}}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const AddRecentPics: FC = () => {
  let ProgressCount: number = 1;

  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  const [data, setData] = useState([
    {name: '', type: '', key: '0', uri: ''},
    {name: '', type: '', key: '1', uri: ''},
    {name: '', type: '', key: '2', uri: ''},
    {name: '', type: '', key: '3', uri: ''},
    {name: '', type: '', key: '4', uri: ''},
    {name: '', type: '', key: '5', uri: ''},
  ]);

  const handleImagePicker = async () => {
    try {
      const res = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 6 - data.length,
      });

      const newImages =
        res?.assets?.map((image, index) => ({
          name: `Selected Image ${index + 1}`,
          type: image.type,
          key: `${String(index + data.length)}`,
          uri: image.uri,
        })) || [];

      if (newImages.length > 0) {
        console.log(newImages);
        // setData(prevImages => [...prevImages, ...newImages]);
      }

      console.log('Selected Images:', data);
    } catch (error) {
      console.log('Image Picker Error:', error);
    }
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
        data={data}
        numColumns={3}
        itemHeight={hp('20%')}
        onItemPress={item => {
          console.log('OnItemPress:', item);
        }}
        style={styles.DraggableStyle}
        renderItem={picture => (
          <View style={{}}>
            <AddUserPhoto
              onDelete={() => {
                const newPics = data
                  .map(deleteUrlFromItem(picture))
                  .sort(sortByUrl);
                setData(newPics);
              }}
              onAdd={() => {
                const newPics = data.map(addUrlToItem(picture)).sort(sortByUrl);
                setData(newPics);
              }}
              picture={picture}
            />
          </View>
        )}
        onDragRelease={data => {
          console.log('data:', data);
          setData(data);
        }}
        onDragStart={data => {
          console.log('onDragStart:', data);
        }}
        onDragItemActive={data => {
          console.log('onDragItemActive:', data);
        }}
        onResetSort={data => {
          console.log('onResetSort:', data);
        }}
        onDragging={data => {
          console.log('onDragging:', data);
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
  DraggableStyle: {
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  item: {
    width: hp('14.5%'),
    height: hp('19%'),
    borderRadius: hp('1.5%'),
    borderColor: COLORS.Gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: hp('1%'),
    backgroundColor: COLORS.DisableText,
  },
  item_text: {
    ...GROUP_FONT.h4,
  },
  UserImageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: hp('1.5%'),
  },
  UserImageAddAndCloseButton: {
    flex: 1,
    width: '25%',
    height: '18%',
    position: 'absolute',
    bottom: -5,
    right: hp('-0.8%'),
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: hp('0.15%'),
  },
});
