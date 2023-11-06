import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {Image, Text, View} from 'react-native';
import CommonIcons from '../../../Common/CommonIcons';
import CommonLogos from '../../../Common/CommonLogos';
import AuthHeader from '../../../Components/AuthComponents/AuthHeader';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import styles from './styles';

const WelcomeScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  return (
    <View style={styles.container}>
      <View style={styles.SubContainerView}>
        <AuthHeader Icon={CommonIcons.Cancel} onPress={() => {}} />

        <View style={styles.ContentView}>
          <View style={styles.AppLogoView}>
            <Image
              resizeMode="contain"
              style={styles.AppLogo}
              source={CommonLogos.TinderColorLogo}
            />
          </View>

          <View style={styles.WelcomeTitleView}>
            <Text style={styles.WelcomeText}>Welcome to Tinder</Text>
            <Text style={styles.WelcomeSubText}>
              Please follow this house rules.
            </Text>
          </View>

          <View style={styles.RulesListView}>
            {/* Rules Title */}
            <View style={styles.RulesListTitleView}>
              <Text style={styles.RulesListTitleText}>Be Yourself.</Text>
              {/* Rules Sub Text */}
              <Text style={styles.RulesListSubTitleText}>
                Make sure your photos, age and bio are true to who you are.
              </Text>
            </View>

            {/* Rules Title */}
            <View style={styles.RulesListTitleView}>
              <Text style={styles.RulesListTitleText}>Stay safe..</Text>
              {/* Rules Sub Text */}
              <Text style={styles.RulesListSubTitleText}>
                Don't be too quick to give out personal information.{' '}
                <Text style={styles.LinkText}>Data Safely</Text>
              </Text>
            </View>

            {/* Rules Title */}
            <View style={styles.RulesListTitleView}>
              <Text style={styles.RulesListTitleText}>Play it cool.</Text>
              {/* Rules Sub Text */}
              <Text style={styles.RulesListSubTitleText}>
                Respect others and treat them as you would like to be treated
              </Text>
            </View>

            {/* Rules Title */}
            <View style={styles.RulesListTitleView}>
              <Text style={styles.RulesListTitleText}>Be proactive.</Text>
              {/* Rules Sub Text */}
              <Text style={styles.RulesListSubTitleText}>
                Always report bad behavior
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.BottomButton}>
        <GradientButton
          Title={'I agree'}
          Disabled={false}
          Navigation={() => {
            navigation.navigate('LoginStack', {
              screen: 'MyFirstName',
            });
          }}
        />
      </View>
    </View>
  );
};

export default WelcomeScreen;
