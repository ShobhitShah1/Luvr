/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import axios from 'axios';
import React, {FC, useState} from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {ActiveOpacity, FONTS, GROUP_FONT} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import ApiConfig from '../../../Config/ApiConfig';
import {TotalProfilePicCanUpload} from '../../../Config/Setting';
import {useCameraPermission} from '../../../Hooks/useCameraPermission';
import {useGalleryPermission} from '../../../Hooks/useGalleryPermission';
import {updateField} from '../../../Redux/Action/userActions';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {
  addUrlToItem,
  deleteUrlFromItem,
  sortByUrl,
} from '../../../Utils/ImagePickerUtils';
import {useCustomToast} from '../../../Utils/toastUtils';
import AddUserPhoto from './Components/AddUserPhoto';
import ChooseFromModal from './Components/ChooseFromModal';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const AddRecentPics: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{BottomTab: {}}>>();
  const {showToast} = useCustomToast();
  const userData = useSelector((state: any) => state?.user);
  const dispatch = useDispatch();
  const {requestCameraPermission} = useCameraPermission();
  const {requestGalleryPermission} = useGalleryPermission();
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const [ChooseModalVisible, setChooseModalVisible] = useState<boolean>(false);
  const [data, setData] = useState(
    Array.from({length: TotalProfilePicCanUpload}, (_, index) => ({
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
    // console.log('Key', Key);
    try {
      const res = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        selectionLimit:
          TotalProfilePicCanUpload -
          data.filter(item => item.url !== '').length,
      });

      const newImages =
        res?.assets?.map((image, index) => ({
          name: image.fileName || '',
          type: image.type || '',
          key: `${Date.now()}-${index}`,
          url: image.uri || '',
        })) || [];

      if (newImages.length > 0) {
        const newData = data.map(item =>
          item.url === '' ? newImages.shift() || item : item,
        );
        setData(newData);
      }
    } catch (error) {
      showToast('Error', String(error), 'error');
    }
  };

  //* Manage Camera Image Pick
  const HandleCameraImagePicker = async () => {
    try {
      const res = await ImagePicker.launchCamera({
        mediaType: 'photo',
      });

      const newImages =
        res?.assets?.map((image, index) => ({
          name: image.fileName || '',
          type: image.type || '',
          key: `${Date.now()}-${index}`,
          url: image.uri || '',
        })) || [];

      if (newImages.length > 0) {
        const newData = data.map(item =>
          item.url === '' ? newImages.shift() || item : item,
        );
        setData(newData);
      }
    } catch (error) {
      showToast('Error', String(error), 'error');
    }
  };

  //* Manage Image Select Button Click
  const HandleOnImagePress = (item: {key: string; url: string}) => {
    if (item.url.length === 0) {
      OnToggleModal();
    } else {
      const newPics = data.map(deleteUrlFromItem(item)).sort(sortByUrl);
      setData(newPics);
    }
  };

  const HandleUserSelection = async (selectedOption: string) => {
    try {
      const permissionStatus =
        selectedOption === 'Camera'
          ? await requestCameraPermission()
          : await requestGalleryPermission();

      if (
        Platform.OS === 'android'
          ? permissionStatus
          : selectedOption !== 'Camera'
          ? true
          : permissionStatus
      ) {
        console.log(
          `${selectedOption} permission granted. Opening ${selectedOption.toLowerCase()}...`,
        );

        if (selectedOption === 'Camera') {
          await HandleCameraImagePicker();
        } else {
          await HandleGalleryImagePicker('1');
        }

        setChooseModalVisible(false);
      }
    } catch (error) {
      showToast('Error', String(error), 'error');
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

  const onNextPress = async () => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        const validImages = data.filter(image => image.url);
        uploadImagesSequentially(validImages)
          .then(uploadedResults => {
            console.log('All images uploaded successfully:', uploadedResults);
            dispatch(updateField(LocalStorageFields.isImageUploaded, true));
            showToast(
              'Congratulations! Image Uploaded',
              'Your profile is ready to go!',
              'success',
            );
            navigation.replace('BottomTab', {
              screen: 'Home',
            });
            setIsLoading(false);
          })
          .catch(error => {
            showToast('Error', String(error), 'error');
          });
      }, 0);
    } catch (error) {
      showToast('Error', String(error), 'error');
    }
  };

  const uploadImage = async (ImageData: any) => {
    const {url, type, name} = ImageData;
    const formData = new FormData();

    if (url && type && name) {
      formData.append('eventName', 'update_profile');
      formData.append('file_to', 'profile_images');
      formData.append('file', {
        uri: Platform.OS === 'android' ? url : url.replace('file://', ''),
        type,
        name: name,
      });

      try {
        const response = await axios.post(
          ApiConfig.IMAGE_UPLOAD_BASE_URL,
          formData,
          {
            headers: {
              Authorization: `Bearer ${userData.Token}`,
              app_secret: '_d_a_t_i_n_g_',
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        return response.data;
      } catch (error: any) {
        showToast(
          'Upload Error',
          'Something went wrong while uploading image',
          'error',
        );
        throw error.response.data;
      }
    }
  };

  const uploadImagesSequentially = async (images: any, index = 0) => {
    if (index < images.length) {
      const image = images[index];
      try {
        await uploadImage(image);
        await uploadImagesSequentially(images, index + 1);
      } catch (error) {
        showToast(
          'Error',
          String(error) || `Failed to upload image ${index + 1}:`,
          'error',
        );
      }
    }
  };

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={9} Skip={false} />

      <View style={styles.DataViewContainer}>
        <View style={{}}>
          <Text style={CreateProfileStyles.TitleText}>
            Add your recent pics
          </Text>
          <Text style={styles.CompatibilityText}>
            Upload 2 phots to start. Add 4 or more to make your profile stand
            out.
          </Text>
        </View>

        <View style={styles.FlatListWrapper}>
          <FlatList
            data={data}
            numColumns={2}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            bounces={false}
            renderItem={renderImageView}
            removeClippedSubviews={true}
            contentContainerStyle={styles.contentContainerStyle}
            showsVerticalScrollIndicator={false}
          />
        </View>
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
          Disabled={data.filter(image => image.url).length === 0 ? true : false}
          isLoading={IsLoading}
          Title={'Continue'}
          Navigation={() => {
            onNextPress();
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
    width: '84%',
    alignSelf: 'center',
    marginTop: hp('1%'),
  },
  FlatListWrapper: {
    height: '65%',
    marginVertical: hp('2%'),
  },
  AddUserPhotoView: {
    marginVertical: hp('0.5%'),
  },
  contentContainerStyle: {},
});
