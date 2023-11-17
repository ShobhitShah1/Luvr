import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
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
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';
import * as ImagePicker from 'react-native-image-picker';

const AddUserPhoto = ({picture}: any) => {
  const hasPicture = !!picture.url;

  return (
    <View style={[styles.item(hasPicture)]} key={picture?.url}>
      {picture?.url && (
        <Animated.View style={styles.UserImageContainer}>
          <Image
            source={{uri: picture?.url}}
            resizeMode="cover"
            style={styles.ImageView}
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
        {!hasPicture ? (
          <Entypo
            name={'plus'}
            size={hp('3%')}
            color={hasPicture ? COLORS.Gray : COLORS.White}
            style={styles.IconView}
          />
        ) : (
          <Ionicons
            name={'close'}
            size={hp('3%')}
            color={hasPicture ? COLORS.Gray : COLORS.White}
            style={styles.IconView}
          />
        )}
      </Animated.View>
    </View>
  );
};

const AddRecentPics: FC = () => {
  let ProgressCount: number = 1;

  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  const [data, setData] = useState(
    Array.from({length: 6}, (_, index) => ({
      name: '',
      type: '',
      key: String(index),
      url: '',
    })),
  );

  const HandleImagePicker = async (Key: string) => {
    console.log('Key', Key);
    try {
      const res = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 6 - data.filter(item => item.url !== '').length,
      });

      const newImages =
        res?.assets?.map((image, index) => ({
          name: `Selected Image ${index + 1}`,
          type: image.type || '',
          key: `${Date.now()}-${index}`,
          url: image.uri || '',
        })) || [];

      if (newImages.length > 0) {
        const newData = data.map(item =>
          item.url === '' ? newImages.shift() || item : item,
        );
        setData(newData);
        console.log('Selected Images:', newData);
      }
    } catch (error) {
      console.log('Image Picker Error:', error);
    }
  };

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={ProgressCount} Skip={false} />

      <View style={[CreateProfileStyles.ContentView]}>
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

          if (item.url.length === 0) {
            HandleImagePicker(item.key);
            // const newPics = data.map(addUrlToItem(item)).sort(sortByUrl);
            // setData(newPics);
          } else {
            const newPics = data.map(deleteUrlFromItem(item)).sort(sortByUrl);
            setData(newPics);
          }
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
        onDragRelease={DragRelease => {
          console.log('data:', DragRelease);
          setData(DragRelease);
        }}
        onDragStart={DragStar => {
          console.log('onDragStart:', DragStar);
        }}
        onDragItemActive={DragItemActive => {
          console.log('onDragItemActive:', DragItemActive);
        }}
        onResetSort={ResetSort => {
          console.log('onResetSort:', ResetSort);
        }}
        onDragging={Dragging => {
          console.log('onDragging:', Dragging);
        }}
      />

      <View style={CreateProfileStyles.BottomButton}>
        <GradientButton
          Title={'Next'}
          Disabled={false}
          Navigation={() => {
            navigation.navigate('LoginStack', {
              screen: 'LocationPermission',
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
    // zIndex: 1,
  },
  item: hasPicture => ({
    width: hp('14.5%'),
    height: hp('19%'),
    borderRadius: hp('1.5%'),
    borderColor: COLORS.Gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: hp('1%'),
    backgroundColor: COLORS.LightGray,
    borderWidth: !hasPicture ? hp('0.15%') : 0,
    borderStyle: !hasPicture ? 'dashed' : undefined,
  }),
  ImageView: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
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
  IconView: {
    justifyContent: 'center',
    alignSelf: 'center',
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
