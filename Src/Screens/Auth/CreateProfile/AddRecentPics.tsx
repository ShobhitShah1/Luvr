import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {ActiveOpacity, FONTS, GROUP_FONT} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import {TotalProfilePicCanUpload} from '../../../Config/Setting';
import {
  addUrlToItem,
  deleteUrlFromItem,
  sortByUrl,
} from '../../../Utils/ImagePickerUtils';
import AddUserPhoto from './Components/AddUserPhoto';
import ChooseFromModal from './Components/ChooseFromModal';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';
import {useCameraPermission} from '../../../Hooks/useCameraPermission';
import {useGalleryPermission} from '../../../Hooks/useGalleryPermission';

const AddRecentPics: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  const {requestCameraPermission} = useCameraPermission();
  const {requestGalleryPermission} = useGalleryPermission();

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
    console.log('Key', Key);
    try {
      const res = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        selectionLimit:
          TotalProfilePicCanUpload -
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
  const HandleCameraImagePicker = async () => {
    try {
      const res = await ImagePicker.launchCamera({
        mediaType: 'photo',
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
      }
    } catch (error) {
      console.log('Image Picker Error:', error);
    }
  };

  //* Manage Image Select Button Click
  const HandleOnImagePress = (item: {key: string; url: string}) => {
    console.log('item', item);
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

      if (permissionStatus) {
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
      console.error('Error handling user selection:', error);
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

        <ScrollView bounces={false} style={styles.FlatListWrapper}>
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
          Title={'Continue'}
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
