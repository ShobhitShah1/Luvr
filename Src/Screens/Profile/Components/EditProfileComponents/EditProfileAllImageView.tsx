/* eslint-disable @typescript-eslint/no-shadow */
import React, {FC} from 'react';
import {Alert, StyleSheet, TouchableOpacity} from 'react-native';
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
  UserPicks: {
    name: string;
    type: string;
    key: string;
    url: string;
  }[];
  index: number;
  OnToggleModal: () => void;
  showToast: Function;
  isLoading: boolean;
}

const EditProfileAllImageView: FC<EditProfileAllImageViewProps> = ({
  item,
  index,
  setUserPicks,
  UserPicks,
  OnToggleModal,
  showToast,
  isLoading,
}) => {
  const DeleteImage = async (id: string) => {
    // const APIResponse = await ProfileService.DeleteUserImage(id);
    // console.log('Delete Image :--:>', APIResponse);
    // if (APIResponse.status) {
    //   showToast(
    //     'Deleted',
    //     APIResponse?.message || 'Your image successfully deleted',
    //     'success',
    //   );
    //   return true;
    // } else {
    //   showToast(
    //     'Error',
    //     'Sorry! cant delete this image right now. try again',
    //     'error',
    //   );
    //   return false;
    // }
  };

  //* Manage Image Select Button Click
  const HandleOnImagePress = (item: {key: string; url: string}) => {
    const UserImageCount = UserPicks.filter(
      res => res.url !== '' && res.url !== undefined,
    ).length;

    if (item?.url?.length === 0) {
      OnToggleModal();
    } else {
      if (UserImageCount <= 2) {
        showToast(
          'Oops!',
          'You can only delete up to 2 images. Minimum limit reached.',
          'error',
        );
      } else {
        // Alert.alert(
        //   'Image Removal Alert!',
        //   'Thinking about removing this image from your profile? Deleting it is like saying goodbye to a moment captured in the digital journey. Still want to proceed?',
        //   [
        //     {
        //       text: 'Keep it',
        //       onPress: () => {},
        //     },
        //     {
        //       text: 'Yes, delete it',
        //       onPress: async () => {
        //         // const IsDeleted = await DeleteImage(item.key);
        //         // if (IsDeleted) {
        //         const newPics = UserPicks.map(deleteUrlFromItem(item)).sort(
        //           sortByUrl,
        //         );
        //         setUserPicks(newPics);
        //         // }
        //       },
        //     },
        //   ],
        // );
      }
    }
  };
  return (
    <TouchableOpacity
      key={index}
      disabled={isLoading}
      activeOpacity={ActiveOpacity}
      onPress={() => {
        HandleOnImagePress(item);
      }}
      style={styles.AddUserPhotoView}>
      <EditProfileRenderImageBox
        onDelete={() => {
          // const newPics = UserPicks.map(deleteUrlFromItem(item))?.sort(
          //   sortByUrl,
          // );
          // setUserPicks(newPics);
        }}
        onAdd={() => {
          const newPics = UserPicks.map(addUrlToItem(item)).sort(sortByUrl);
          setUserPicks(newPics);
        }}
        picture={item}
        isLoading={isLoading}
      />
    </TouchableOpacity>
  );
};

export default EditProfileAllImageView;

const styles = StyleSheet.create({
  AddUserPhotoView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: heightPercentageToDP('0.5%'),
  },
});

// /* eslint-disable @typescript-eslint/no-shadow */
// import React, {FC} from 'react';
// import {StyleSheet, TouchableOpacity} from 'react-native';
// import {heightPercentageToDP} from 'react-native-responsive-screen';
// import {ActiveOpacity} from '../../../../Common/Theme';
// import {
//   addUrlToItem,
//   deleteUrlFromItem,
//   sortByUrl,
// } from '../../../../Utils/ImagePickerUtils';
// import EditProfileRenderImageBox from './EditProfileRenderImageBox';

// interface EditProfileAllImageViewProps {
//   item: {
//     name: string;
//     type: string;
//     key: string;
//     url: string;
//   };
//   setUserPicks: any;
//   UserPicks: {name: string; type: string; key: string; url: string}[];
//   index: number;
//   OnToggleModal: () => void;
// }

// const EditProfileAllImageView: FC<EditProfileAllImageViewProps> = ({
//   item,
//   index,
//   setUserPicks,
//   UserPicks,
//   OnToggleModal,
// }) => {
//   //* Manage Image Select Button Click
//   const HandleOnImagePress = (item: {key: string; url: string}) => {
//     console.log('item', item);
//     if (item.url.length === 0) {
//       OnToggleModal();
//     } else {
//       const newPics = UserPicks.map(deleteUrlFromItem(item)).sort(sortByUrl);
//       setUserPicks(newPics);
//     }
//   };
//   return (
//     <TouchableOpacity
//       key={index}
//       activeOpacity={ActiveOpacity}
//       onPress={() => {
//         HandleOnImagePress(item);
//       }}
//       style={styles.AddUserPhotoView}>
//       <EditProfileRenderImageBox
//         onDelete={() => {
//           const newPics = UserPicks.map(deleteUrlFromItem(item))?.sort(
//             sortByUrl,
//           );
//           setUserPicks(newPics);
//         }}
//         onAdd={() => {
//           const newPics = UserPicks.map(addUrlToItem(item)).sort(sortByUrl);
//           setUserPicks(newPics);
//         }}
//         picture={item}
//       />
//     </TouchableOpacity>
//   );
// };

// export default EditProfileAllImageView;

// const styles = StyleSheet.create({
//   AddUserPhotoView: {
//     flex: 1,
//     justifyContent: 'space-between',
//     marginVertical: heightPercentageToDP('0.5%'),
//   },
// });
