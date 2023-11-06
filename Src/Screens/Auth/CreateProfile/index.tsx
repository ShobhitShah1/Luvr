import React, {FC, useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import * as Progress from 'react-native-progress';
import CommonIcons from '../../../Common/CommonIcons';
import {CommonSize} from '../../../Common/CommonSize';
import {COLORS, FONTS} from '../../../Common/Theme';
import MyFirstName from './MyFirstName';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import MyBirthDate from './MyBirthDate';
import MyGender from './MyGender';

const CreateProfile: FC = () => {
  const {width} = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [ProgressCount, setProgressCount] = useState<number>(0.1);

  //* Add All Screen That Incudes In Create Profile
  const screens = [
    {key: 'Name', component: <MyFirstName />},
    {key: 'BOB', component: <MyBirthDate />},
    {key: 'Gender', component: <MyGender />},
  ];

  const currentScreen =
    screens[currentIndex < screens.length ? currentIndex : 0];

  //* Manage All Screen OnPress Here
  const handleNext = () => {
    if (currentIndex < screens.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgressCount(ProgressCount + 0.1);
    }
  };

  const handlePrevScreen = () => {
    if (currentIndex > 0) {
      Alert.alert('Call');
      setCurrentIndex(currentIndex - 1);
      setProgressCount(ProgressCount - 0.1);
    }
  };

  useEffect(() => {
    const backAction = () => {
      handlePrevScreen();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.Container}>
      <Progress.Bar
        color={COLORS.Primary}
        width={width}
        progress={ProgressCount}
        animated={true}
        animationType="timing"
        animationConfig={{bounciness: 10}}
        borderRadius={0}
        borderColor="transparent"
        unfilledColor="rgba(217, 217, 217, 1)"
      />

      <View style={styles.CancelButtonAndTitleText}>
        <TouchableOpacity onPress={handlePrevScreen}>
          <Image source={CommonIcons.TinderBack} style={styles.CancelButton} />
        </TouchableOpacity>

        <View style={styles.TitleContainer}>
          <Text style={styles.TitleText}>{currentScreen.key}</Text>
        </View>
      </View>

      <View>{currentScreen.component}</View>

      <View style={styles.BottomButton}>
        <GradientButton
          Title={'Next'}
          Disabled={false}
          Navigation={handleNext}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  CancelButtonAndTitleText: {
    margin: CommonSize(20),
  },
  CancelButton: {
    width: CommonSize(20),
    height: CommonSize(20),
  },
  TitleContainer: {
    marginTop: CommonSize(20),
  },
  TitleText: {
    fontSize: CommonSize(20),
    color: COLORS.Black,
    fontFamily: FONTS.Bold,
  },
  BottomButton: {
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: CommonSize(10),
  },
});

export default CreateProfile;

// import React, {FC, useState} from 'react';
// import {Image, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
// import * as Progress from 'react-native-progress';
// import CommonIcons from '../../../Common/CommonIcons';
// import {CommonSize} from '../../../Common/CommonSize';
// import {COLORS, FONTS} from '../../../Common/Theme';
// import MyFirstName from './MyFirstName';
// import GradientButton from '../../../Components/AuthComponents/GradientButton';
// import MyBirthDate from './MyBirthDate';
// import MyGender from './MyGender';

// const CreateProfile: FC = () => {
//   const {width} = useWindowDimensions();
//   const [Type, setType] = useState<string>('Name');
//   const [isButtonDisabled, setisButtonDisabled] = useState<boolean>(false);
//   const [ProgressCount, setProgressCount] = useState<number>(0.1);

//   let typeElement;

//   switch (Type) {
//     case 'Name':
//       typeElement = <MyFirstName Title={'Your First Name'} />;
//       break;
//     case 'BOB':
//       typeElement = <MyBirthDate />;
//       break;
//     case 'Gender':
//       typeElement = <MyGender />;
//       break;
//     default:
//       typeElement = null;
//       break;
//   }

//   return (
//     <View style={styles.Container}>
//       <Progress.Bar
//         color={COLORS.Primary}
//         width={width}
//         progress={ProgressCount}
//         animated={true}
//         animationType="timing"
//         animationConfig={{bounciness: 10}}
//         borderRadius={0}
//         borderColor="transparent"
//         unfilledColor="rgba(217, 217, 217, 1)"
//       />

//       <View style={styles.CancelButtonAndTitleText}>
//         <Image source={CommonIcons.TinderBack} style={styles.CancelButton} />

//         <View style={styles.TitleContainer}>
//           <Text style={styles.TitleText}>{Type}</Text>
//         </View>
//       </View>

//       <View>{typeElement}</View>

//       <View style={styles.BottomButton}>
//         <GradientButton
//           Title={'Next'}
//           Disabled={isButtonDisabled ? true : false}
//           Navigation={() => {
//             setProgressCount(ProgressCount > 1 ? 0.1 : ProgressCount + 0.1);
//             console.log(ProgressCount);
//           }}
//         />
//       </View>
//     </View>
//   );
// };

// export default CreateProfile;

// const styles = StyleSheet.create({
//   Container: {
//     flex: 1,
//   },
//   CancelButtonAndTitleText: {
//     margin: CommonSize(20),
//   },
//   CancelButton: {
//     width: CommonSize(20),
//     height: CommonSize(20),
//   },
//   TitleContainer: {
//     marginTop: CommonSize(20),
//   },
//   TitleText: {
//     fontSize: CommonSize(20),
//     color: COLORS.Black,
//     fontFamily: FONTS.Bold,
//   },
//   BottomButton: {
//     width: '90%',
//     justifyContent: 'center',
//     alignSelf: 'center',
//     position: 'absolute',
//     bottom: CommonSize(10),
//   },
// });
