import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import AddUserPhoto from '../../../Auth/CreateProfile/Components/AddUserPhoto';
import {ActiveOpacity} from '../../../../Common/Theme';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import EditProfileRenderImageBox from './EditProfileRenderImageBox';

const EditProfileAllImageView = () => {
  return (
    <TouchableOpacity
      activeOpacity={ActiveOpacity}
      onPress={() => {
        // HandleOnImagePress(item);
      }}
      style={styles.AddUserPhotoView}>
      <EditProfileRenderImageBox
        onDelete={() => {
          //   const newPics = data.map(deleteUrlFromItem(item)).sort(sortByUrl);
          //   setData(newPics);
        }}
        onAdd={() => {
          //   const newPics = data.map(addUrlToItem(item)).sort(sortByUrl);
          //   setData(newPics);
        }}
        picture={''}
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
