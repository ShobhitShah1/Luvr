/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {BlurView} from '@react-native-community/blur';
import React, {FC, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
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
import {TotalProfilePicCanUplaod} from '../../../Config/Setting';
import {
  addUrlToItem,
  deleteUrlFromItem,
  sortByUrl,
} from '../../../Utils/ImagePickerUtils';
import ChooseFromModal from './Components/ChooseFromModal';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';
import useCameraGalleryPermissions from '../../../Hooks/useCameraGalleryPermissions';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const AddRecentPics: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{HomeStack: {}}>>();

  const {requestCameraPermission, requestGalleryPermission, permissions} =
    useCameraGalleryPermissions();

  const [ChooseModalVisible, setChooseModalVisible] = useState<boolean>(false);
  const [data, setData] = useState(
    Array.from({length: TotalProfilePicCanUplaod}, (_, index) => ({
      name: '',
      type: '',
      key: String(index),
      url: '',
    })),
  );

  //* Toggle Modal Open
  const OnToggleModal = () => {
    setChooseModalVisible(!ChooseModalVisible);
  };

  //* Manage Gallery Image Pick
  const HandleGalleryImagePicker = async (Key: string) => {
    console.log('Key', Key);
    try {
      const res = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        selectionLimit:
          TotalProfilePicCanUplaod -
          data.filter(item => item.url !== '').length,
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

  //* Manage Camera Image Pick
  const HandleCameraImagePicker = async (
    Key: string,
    isCamera: boolean = false,
  ) => {
    console.log('Key', Key);
    try {
      const mediaType = isCamera ? 'photo' : 'mixed'; // Use 'mixed' for camera
      const res = await ImagePicker.launchImageLibrary({
        mediaType,
        selectionLimit:
          TotalProfilePicCanUplaod -
          data.filter(item => item.url !== '').length,
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

  //* Manage Image Select Button Click
  const HandleOnImagePress = (item: {key: string; url: string}) => {
    console.log('item', item);
    if (item.url.length === 0) {
      // OnToggleModal();
      // HandleGalleryImagePicker(item.key);
    } else {
      const newPics = data.map(deleteUrlFromItem(item)).sort(sortByUrl);
      setData(newPics);
    }
  };

  //* Render Image Box's
  const renderImageView = ({item}: any) => {
    return (
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        onPress={() => {
          HandleOnImagePress(item);
        }}
        style={styles.AddUserPhotoView}>
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

  //* Box Style HasImage And Dont Have View
  const AddUserPhoto = ({picture}: any) => {
    const hasPicture = !!picture.url;

    return (
      <View style={styles.item} key={picture?.url}>
        {picture?.url ? (
          <Animated.View style={styles.UserImageContainer}>
            <Image
              source={{uri: picture?.url}}
              resizeMode="cover"
              style={styles.ImageHasImageView}
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

        <View style={[styles.BlurViewContainer(hasPicture)]}>
          <BlurView
            blurType="light"
            blurAmount={1}
            style={styles.BlurView}
            overlayColor="transparent"
            reducedTransparencyFallbackColor="rgba(255,255,255,.2)">
            <View
              style={{
                backgroundColor: 'transparent',
              }}>
              {!hasPicture ? (
                <View style={[styles.ImageAddAndDeleteView]}>
                  <Image
                    resizeMode="cover"
                    style={[styles.AddPhotoImageViewImages]}
                    source={CommonIcons.AddImage}
                  />
                  <Text style={styles.ImageAddAndDeleteText(hasPicture)}>
                    Add Photo
                  </Text>
                </View>
              ) : (
                <View style={[styles.ImageAddAndDeleteView]}>
                  <Image
                    resizeMode="cover"
                    style={[styles.DeletePhotoImageViewImages]}
                    source={CommonIcons.DeleteImage}
                  />
                  <Text style={styles.ImageAddAndDeleteText(hasPicture)}>
                    Delete Photo
                  </Text>
                </View>
              )}
            </View>
          </BlurView>
        </View>
      </View>
    );
  };

  //* Handle User Selection With Permisstion
  const HandleUserSelection = async (option: string) => {
    if (option === 'Camera') {
      if (permissions?.camera === 'granted') {
        await HandleCameraImagePicker('1', true);
        setChooseModalVisible(false);
      } else {
        requestCameraPermission();
      }
    } else {
      if (permissions?.gallery === 'granted') {
        await HandleGalleryImagePicker('1');
        setChooseModalVisible(false);
      } else {
        requestGalleryPermission();
      }
    }
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

        <ScrollView bounces={false} style={styles.FlatListWrapper}>
          <FlatList
            data={data}
            numColumns={2}
            bounces={false}
            renderItem={renderImageView}
            removeClippedSubviews={true}
            contentContainerStyle={styles.contentContainerStyle}
            showsVerticalScrollIndicator={false}
          />
        </ScrollView>
      </View>

      <ChooseFromModal
        isModalVisible={ChooseModalVisible}
        toggleModal={OnToggleModal}
        OnOptionPress={(option: string) => {
          HandleUserSelection(option);
        }}
      />

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
  },
  item: {
    width: hp('19%'),
    height: hp('19%'),
    borderRadius: hp('1.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: hp('0.5%'),
    marginVertical: hp('0.5%'),
    backgroundColor: COLORS.White,
    overflow: 'hidden',
  },
  ImageHasImageView: {
    width: '100%',
    height: '100%',
  },
  NoImageView: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '30%',
    height: '30%',
    overflow: 'hidden',
    bottom: 15,
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
  ImageAddAndDeleteView: {
    flexDirection: 'row',
  },
  ImageAddAndDeleteText: (hasPicture: any) => ({
    ...GROUP_FONT.h3,
    color: !hasPicture ? COLORS.Black : COLORS.White,
  }),
  DeletePhotoImageViewImages: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 18,
    height: 18,
    tintColor: COLORS.White,
  },
  AddPhotoImageViewImages: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 18,
    height: 18,
    tintColor: COLORS.Black,
    marginHorizontal: 5,
  },
  AddImageView: {
    backgroundColor: COLORS.Gray,
  },
  FlatListWrapper: {
    height: '65%',
    marginVertical: hp('2%'),
  },
  AddUserPhotoView: {
    marginVertical: hp('0.5%'),
    marginHorizontal: hp('0.5%'),
  },
  contentContainerStyle: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  BlurViewContainer: hasPicture => ({
    flex: 1,
    bottom: 10,
    width: '85%',
    height: 35,
    overflow: 'hidden',
    alignSelf: 'center',
    position: 'absolute',
    justifyContent: 'center',
    borderWidth: hp('0.13%'),
    borderRadius: SIZES.radius,
    borderColor: hasPicture ? COLORS.White : COLORS.Black,
    alignItems: 'center',
  }),
  BlurView: {
    borderWidth: 1,
    justifyContent: 'center',
  },
});
