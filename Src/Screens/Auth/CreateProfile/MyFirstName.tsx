import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLORS, FONTS, GROUP_FONT, SIZES} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CustomTextInput from '../../../Components/CustomTextInput';
import CreateProfileStyles from './styles';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import {CommonSize} from '../../../Common/CommonSize';
import CreateProfileHeader from './Components/CreateProfileHeader';

const MyFirstName: FC = () => {
  let ProgressCount: number = 0.1;
  const [FirstName, setFirstName] = useState<string>('');
  const [WelcomeModal, setWelcomeModal] = useState<boolean>(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  const OnLetsGoButtonPress = async () => {
    Keyboard.dismiss();
    setWelcomeModal(false);
    setTimeout(() => {
      navigation.navigate('LoginStack', {
        screen: 'MyBirthDate',
      });
    }, 300);
  };

  const OnNextButtonClick = () => {
    Keyboard.dismiss();
    if (Keyboard.isVisible()) {
      setTimeout(() => {
        setWelcomeModal(true);
      }, 100);
    } else {
      setWelcomeModal(true);
    }
  };

  function LetsGoButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={OnLetsGoButtonPress}
        style={styles.CreateAccountButton}>
        <LinearGradient
          colors={COLORS.ButtonGradient}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          style={styles.GradientViewStyle}>
          <Text style={[styles.NewAccountText, {color: COLORS.White}]}>
            Let's Go
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={ProgressCount} Skip={false} />

      <View style={CreateProfileStyles.ContentView}>
        <Text style={CreateProfileStyles.TitleText}>
          What's your first name
        </Text>
        <CustomTextInput
          autoFocus
          value={FirstName}
          onChangeText={value => {
            setFirstName(value);
          }}
          textContentType="givenName"
          placeholder="Enter first name"
          style={styles.TextInputStyle}
          placeholderTextColor={COLORS.Placeholder}
        />
        <Text style={styles.InfoText}>
          This is how it'll appear on your profile.
        </Text>
        <Text style={styles.CantChangeText}>Can't change it later.</Text>
      </View>

      <View style={CreateProfileStyles.BottomButton}>
        <GradientButton
          Title={'Next'}
          // Disabled={FirstName.length === 0 ? true : false}
          Disabled={false}
          Navigation={() => OnNextButtonClick()}
        />
      </View>

      <Modal isVisible={WelcomeModal}>
        <View style={styles.ModalContainer}>
          <View style={styles.ModalSubView}>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.EmojiView}>👋🏻</Text>
              <Text
                style={styles.WelcomeUserText}>{`Welcome, ${FirstName}!`}</Text>
              <Text style={styles.DescriptionText}>
                There's a lot to discover out there. But let's get your profile
                set up first.
              </Text>
              <LetsGoButton />
              <Text
                onPress={() => setWelcomeModal(false)}
                style={styles.EditNameText}>
                Edit name
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyFirstName;

const styles = StyleSheet.create({
  TextInputStyle: {
    padding: 0,
    paddingVertical: hp('0.1%'),
    marginTop: hp('2.6%'),
    color: COLORS.Black,
    fontSize: hp('1.7%'),
    borderBottomWidth: 1,
    borderColor: COLORS.Black,
    marginVertical: hp('1.5%'),
  },
  InfoText: {
    fontFamily: FONTS.Medium,
    color: COLORS.Black,
    fontSize: hp('1.6%'),
  },
  CantChangeText: {
    ...GROUP_FONT.h4,
    fontSize: hp('1.6%'),
  },

  // Modal
  ModalContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  ModalSubView: {
    width: wp('80%'),
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: hp('4%'),
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.White,
  },
  EmojiView: {
    fontSize: hp('5%'),
  },
  WelcomeUserText: {
    ...GROUP_FONT.h2,
    marginBottom: hp('1%'),
    width: '75%',
    textAlign: 'center',
  },
  DescriptionText: {
    ...GROUP_FONT.h3,
    textAlign: 'center',
    fontFamily: FONTS.Regular,
    marginVertical: hp('0.5%'),
    paddingHorizontal: wp('10%'),
  },

  // Lets Go Button
  CreateAccountButton: {
    width: '65%',
    overflow: 'hidden',
    alignSelf: 'center',
    height: hp('5.5%'),
    marginVertical: hp('2%'),
    justifyContent: 'center',
    borderRadius: CommonSize(50),
  },
  GradientViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  NewAccountText: {
    textAlign: 'center',
    color: COLORS.White,
    fontSize: hp('1.8%'),
    fontFamily: FONTS.Bold,
  },
  EditNameText: {
    marginBottom: hp('1.5%'),
    fontFamily: FONTS.Bold,
    color: COLORS.Gray,
    fontSize: hp('2.2%'),
  },
});
