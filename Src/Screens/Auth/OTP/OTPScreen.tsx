import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import AuthHeader from '../../../Components/AuthComponents/AuthHeader';
import OtpInput from '../../../Components/AuthComponents/OtpInput';
import styles from './styles';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import {CommonSize} from '../../../Common/CommonSize';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface RouteParams {
  number: string;
}

export default function OTPScreen() {
  const route = useRoute();
  const {number} = route.params as RouteParams;
  const [OTPCode, setOTPCode] = useState<String | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const [DisableButton, setDisableButton] = useState<Boolean>(true);

  const OnOTPInput = (text: String) => {
    console.log(text);
    setOTPCode(text);
    if (text.length > 5) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  };

  return (
    <View style={styles.Container}>
      <View style={styles.SubContainerView}>
        <AuthHeader Logo={false} onPress={() => {}} />
      </View>

      <View style={styles.CodeAndNumberView}>
        <Text style={styles.MyCodeText}>My code is</Text>
        <Text style={styles.NumberText}>{number}</Text>
      </View>

      <OtpInput onTextChange={text => OnOTPInput(text)} clearText={() => {}} />

      <View style={{top: CommonSize(70)}}>
        <GradientButton
          Disabled={DisableButton}
          Title={'CONTINUE'}
          Navigation={() => {
            navigation.navigate('LoginStack', {
              screen: 'MyFirstName',
            });
          }}
        />
      </View>
    </View>
  );
}
