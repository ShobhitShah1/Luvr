import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const ManageContacts = () => {
  return (
    <View>
      <Text>ManageContacts</Text>
    </View>
  );
};

export default ManageContacts;

const styles = StyleSheet.create({});

// /* eslint-disable react/no-unstable-nested-components */
// /* eslint-disable react-native/no-inline-styles */
// import React, {FC, useEffect, useState} from 'react';
// import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import {RESULTS} from 'react-native-permissions';
// import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import {ActiveOpacity, COLORS, GROUP_FONT} from '../../../Common/Theme';
// import {ContactTabData} from '../../../Components/Data';
// import {useContacts} from '../../../Hooks/useContacts';
// import ContactHeader from './Components/ContactHeader';
// import ContactSearch from './Components/ContactSearch';
// import ContactTabButton from './Components/ContactTabButton';
// import AllContactRender from './Contacts/AllContactRender';
// import Blocked from './Contacts/Blocked';

// const ManageContacts: FC = () => {
//   const {contacts, permissionState, requestPermission} = useContacts();

//   const [SelectedContactTab, setSelectedContactTab] = useState<number>(1);
//   const [ContactPermission, setContactPermission] =
//     useState<string>(permissionState);

//   useEffect(() => {
//     setContactPermission(permissionState);
//   }, [permissionState, contacts]);

//   const RenderPermissionButton = () => {
//     return (
//       <View style={styles.ImportButtonView}>
//         <TouchableOpacity
//           activeOpacity={ActiveOpacity}
//           onPress={requestPermission}
//           style={styles.ImportButton}>
//           <Text style={styles.ImportButtonText}>Import Contact</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const renderContent = () => {
//     if (ContactPermission === RESULTS.GRANTED) {
//       return SelectedContactTab === 1 ? <AllContactRender /> : <Blocked />;
//     } else {
//       return <RenderPermissionButton />;
//     }
//   };

//   return (
//     <View style={styles.Container}>
//       <ContactHeader isAddContact={false} />

//       <View style={styles.ContentView}>
//         {/* Top Tab Bar View */}
//         <View style={styles.TabBarContainer}>
//           {ContactTabData.map((res) => {
//             return (
//               <ContactTabButton
//                 key={res.id}
//                 label={res.title}
//                 isSelected={SelectedContactTab === res.id}
//                 onPress={() => setSelectedContactTab(res.id)}
//               />
//             );
//           })}
//         </View>

//         {/* Search View */}
//         <View style={styles.SearchBarContainer}>
//           <ContactSearch />
//         </View>

//         {/* Content View */}
//         <View style={{marginBottom: hp('50%')}}>{renderContent()}</View>
//       </View>
//     </View>
//   );
// };

// export default ManageContacts;

// const styles = StyleSheet.create({
//   Container: {
//     flex: 1,
//     alignItems: 'center',
//     backgroundColor: COLORS.Secondary,
//   },
//   ContentView: {
//     width: '90%',
//     paddingVertical: hp('3%'),
//   },
//   TabBarContainer: {
//     width: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   SearchBarContainer: {
//     alignItems: 'center',
//     paddingVertical: hp('3%'),
//   },
//   ImportButtonView: {
//     marginTop: hp('20%'),
//     alignItems: 'center',
//   },
//   ImportButton: {
//     width: '55%',
//     height: hp('6%'),
//     justifyContent: 'center',
//     borderRadius: hp('3%'),
//     backgroundColor: COLORS.Primary,
//   },
//   ImportButtonText: {
//     textAlign: 'center',
//     ...GROUP_FONT.h4,
//     color: COLORS.White,
//   },
// });
