import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {CommonSize} from '../../../Common/CommonSize';
import {ActiveOpacity, COLORS, FONTS} from '../../../Common/Theme';
import AuthHeader from '../../../Components/AuthComponents/AuthHeader';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import useCountryPicker from '../../../Hooks/useCountryPicker';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useState} from 'react';

export default function PhoneNumber() {
  const {Visible, setVisible, CountryPickerComponent} = useCountryPicker();
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const [PhoneNumber, setPhoneNumber] = useState<Number | null>(null);
  return (
    <View style={styles.Container}>
      <View style={styles.SubContainerView}>
        <AuthHeader Logo={false} onPress={() => {}} />

        <View style={styles.NumberContainer}>
          <View style={styles.MyNumberTextView}>
            <Text style={styles.MyNumberText}>My number is</Text>
          </View>
        </View>

        <View style={styles.PhoneNumberView}>
          <TouchableOpacity
            activeOpacity={ActiveOpacity}
            onPress={() => {
              setVisible(!Visible);
            }}
            style={styles.UserCountyAndCodeView}>
            <CountryPickerComponent />
          </TouchableOpacity>
          <View style={styles.UserNumberTextView}>
            <TextInput
              style={styles.UserNumberTextStyle}
              placeholder="000000000"
              placeholderTextColor={COLORS.Brown}
              keyboardType="phone-pad"
              onChangeText={(value: any) => {
                setPhoneNumber(value);
              }}
            />
          </View>
        </View>

        <View
          style={{marginTop: CommonSize(40), marginHorizontal: CommonSize(10)}}>
          <Text
            style={{
              color: 'rgba(130, 134, 147, 1)',
              textAlign: 'left',
              fontFamily: FONTS.Regular,
            }}>
            We will send a text with a verification code. Message and data rates
            may apply.{' '}
            <Text
              style={{
                color: 'rgba(68, 65, 66, 1)',
                textDecorationLine: 'underline',
                textDecorationStyle: 'solid',
                textDecorationColor: COLORS.Black,
                fontFamily: FONTS.Regular,
              }}>
              Learn what
            </Text>{' '}
            <Text
              style={{
                color: 'rgba(68, 65, 66, 1)',
                fontFamily: FONTS.Regular,
              }}>
              happens when your number changes.
            </Text>
          </Text>
        </View>

        <View style={{top: CommonSize(70)}}>
          <GradientButton
            Title={'CONTINUE'}
            Disabled={false}
            Navigation={() => {
              navigation.navigate('LoginStack', {
                screen: 'OTP',
                params: {
                  number: PhoneNumber,
                },
              });
            }}
          />
        </View>
      </View>
    </View>
  );
}
