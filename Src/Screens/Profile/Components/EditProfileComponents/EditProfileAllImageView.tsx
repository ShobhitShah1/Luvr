/* eslint-disable @typescript-eslint/no-shadow */
import React, { FC, memo, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { addUrlToItem, sortByUrl } from '../../../../Utils/ImagePickerUtils';
import EditProfileRenderImageBox from './EditProfileRenderImageBox';

interface EditProfileAllImageViewProps {
  item: {
    name: string;
    type: string;
    key: string;
    url: string;
  };
  setUserPicks: any;
  UserPicks: {
    name: string;
    type: string;
    url: string;
  }[];
  OnToggleModal: () => void;
  isLoading: boolean;
}

const EditProfileAllImageView: FC<EditProfileAllImageViewProps> = ({
  item,
  setUserPicks,
  UserPicks,
  OnToggleModal,
  isLoading,
}) => {
  const handleOnImagePress = useCallback(
    (item: { key: string; url: string }) => {
      if (item?.url?.length === 0) {
        OnToggleModal();
      }
    },
    [OnToggleModal]
  );

  return (
    <Pressable disabled={isLoading} onPress={() => handleOnImagePress(item)} style={styles.AddUserPhotoView}>
      <EditProfileRenderImageBox
        onDelete={() => {}}
        onAdd={() => {
          const newPics = UserPicks.map(addUrlToItem(item)).sort(sortByUrl);
          setUserPicks(newPics);
        }}
        picture={item}
        isLoading={isLoading}
      />
    </Pressable>
  );
};

export default memo(EditProfileAllImageView);

const styles = StyleSheet.create({
  AddUserPhotoView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: heightPercentageToDP('0.5%'),
  },
});
