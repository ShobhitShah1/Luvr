import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import Animated from 'react-native-reanimated';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../Common/CommonIcons';
import {
  ActiveOpacity,
  COLORS,
  FONTS,
  GROUP_FONT,
  SIZES,
} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import {
  addUrlToItem,
  deleteUrlFromItem,
  sortByUrl,
} from '../../../Utils/ImagePickerUtils';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const AddUserPhoto = ({picture}: any) => {
  const hasPicture = !!picture.url;

  return (
    <View style={[styles.item]} key={picture?.url}>
      {picture?.url ? (
        <Animated.View style={styles.UserImageContainer}>
          <Image
            source={{uri: picture?.url}}
            resizeMode="cover"
            style={styles.ImageView}
          />
        </Animated.View>
      ) : (
        <Animated.View style={styles.UserImageContainer}>
          <Image
            source={CommonIcons.NoImage}
            resizeMode="cover"
            style={styles.NoImageView}
          />
        </Animated.View>
      )}

      <Animated.View
        style={[
          styles.UserImageAddAndCloseButton,
          {
            backgroundColor: hasPicture ? COLORS.White : '#828282',
            // borderColor: hasPicture ? COLORS.Gray : COLORS.White,
          },
        ]}>
        {!hasPicture ? (
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Image
              resizeMode="cover"
              style={[
                styles.ImageViewImages,
                {
                  tintColor: COLORS.White,
                  marginHorizontal: 5,
                  justifyContent: 'center',
                },
              ]}
              source={CommonIcons.AddImage}
            />
            <Text
              style={{
                justifyContent: 'center',
                ...GROUP_FONT.body3,
                color: !hasPicture ? COLORS.White : COLORS.White,
              }}>
              Add Photo
            </Text>
          </View>
        ) : (
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Image
              resizeMode="cover"
              style={[styles.ImageViewImages, {tintColor: 'black'}]}
              source={CommonIcons.DeleteImage}
            />
            <Text
              style={{
                justifyContent: 'center',
                ...GROUP_FONT.body3,
                color: !hasPicture ? COLORS.White : COLORS.Black,
              }}>
              Delete Photo
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const AddRecentPics: FC = () => {
  let ProgressCount: number = 1;

  const navigation =
    useNavigation<NativeStackNavigationProp<{HomeStack: {}}>>();

  const [data, setData] = useState(
    Array.from({length: 4}, (_, index) => ({
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

  const renderImageView = ({item}: any) => {
    console.log(item);

    return (
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        onPress={() => {
          if (item.url.length === 0) {
            HandleImagePicker(item.key);
            // const newPics = data.map(addUrlToItem(item)).sort(sortByUrl);
            // setData(newPics);
          } else {
            const newPics = data.map(deleteUrlFromItem(item)).sort(sortByUrl);
            setData(newPics);
          }
        }}
        style={{
          marginVertical: hp('2%'),
          alignItems: 'center',
          width: '50%',
          justifyContent: 'center',
        }}>
        <AddUserPhoto
          onDelete={() => {
            const newPics = data.map(deleteUrlFromItem(item)).sort(sortByUrl);
            setData(newPics);
          }}
          onAdd={() => {
            const newPics = data.map(addUrlToItem(item)).sort(sortByUrl);
            setData(newPics);
          }}
          picture={item}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={9} Skip={false} />

      <View style={styles.DataViewContainer}>
        <View style={[CreateProfileStyles.ContentView]}>
          <Text style={CreateProfileStyles.TitleText}>
            Add your recent pics
          </Text>
          <Text style={styles.CompatibilityText}>
            Upload 2 phots to start. Add 4 or more to make your profile stand
            out.
          </Text>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            marginVertical: hp('2%'),
          }}>
          <FlatList numColumns={2} data={data} renderItem={renderImageView} />
        </View>
      </View>

      <View style={CreateProfileStyles.BottomButton}>
        <GradientButton
          Title={'Next'}
          Disabled={false}
          Navigation={() => {
            navigation.navigate('HomeStack', {
              screen: 'Home',
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
  DataViewContainer: {
    marginHorizontal: hp('1.2%'),
    marginTop: hp('1%'),
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
  item: {
    width: hp('17%'),
    height: hp('19%'),
    borderRadius: hp('1.5%'),
    // borderColor: COLORS.Gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: hp('1%'),
    backgroundColor: COLORS.White,
  },
  ImageView: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  NoImageView: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '30%',
    height: '30%',
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
    justifyContent: 'center',
  },
  IconView: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  UserImageAddAndCloseButton: {
    flex: 1,
    // width: '25%',
    // height: '18%',
    position: 'absolute',
    bottom: 10,
    // right: hp('-0.8%'),
    // borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: hp('0.15%'),

    width: '85%',
    height: 35,
    borderRadius: SIZES.radius,
    borderColor: COLORS.Black,
    justifyContent: 'center',
  },
  ImageViewImages: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 18,
    height: 18,
  },
});
