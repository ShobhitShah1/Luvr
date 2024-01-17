/* eslint-disable @typescript-eslint/no-shadow */
import React, {FC} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {ActiveOpacity} from '../../../../Common/Theme';
import {
  addUrlToItem,
  deleteUrlFromItem,
  sortByUrl,
} from '../../../../Utils/ImagePickerUtils';
import EditProfileRenderImageBox from './EditProfileRenderImageBox';

interface EditProfileAllImageViewProps {
  item: {
    name: string;
    type: string;
    key: string;
    url: string;
  };
  setUserPicks: any;
  UserPicks: {name: string; type: string; key: string; url: string}[];
  index: number;
  OnToggleModal: () => void;
}

const EditProfileAllImageView: FC<EditProfileAllImageViewProps> = ({
  item,
  index,
  setUserPicks,
  UserPicks,
  OnToggleModal,
}) => {
  //* Manage Image Select Button Click
  const HandleOnImagePress = (item: {key: string; url: string}) => {
    console.log('item', item);
    if (item.url.length === 0) {
      OnToggleModal();
    } else {
      const newPics = UserPicks.map(deleteUrlFromItem(item)).sort(sortByUrl);
      setUserPicks(newPics);
    }
  };
  return (
    <TouchableOpacity
      key={index}
      activeOpacity={ActiveOpacity}
      onPress={() => {
        HandleOnImagePress(item);
      }}
      style={styles.AddUserPhotoView}>
      <EditProfileRenderImageBox
        onDelete={() => {
          const newPics = UserPicks.map(deleteUrlFromItem(item))?.sort(
            sortByUrl,
          );
          setUserPicks(newPics);
        }}
        onAdd={() => {
          const newPics = UserPicks.map(addUrlToItem(item)).sort(sortByUrl);
          setUserPicks(newPics);
        }}
        picture={item}
      />
    </TouchableOpacity>
  );
};

export default EditProfileAllImageView;

const styles = StyleSheet.create({
  AddUserPhotoView: {
    flex: 1,
    justifyContent: 'space-between',
    marginVertical: heightPercentageToDP('0.5%'),
  },
});
