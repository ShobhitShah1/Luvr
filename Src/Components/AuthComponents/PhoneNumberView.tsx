import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal';

interface PhoneNumberViewProps {
  UserCountry: CountryCode;
  setUserCountry: (country: CountryCode) => void;
}

const PhoneNumberView: React.FC<PhoneNumberViewProps> = ({
  UserCountry,
  setUserCountry,
}) => {
  const [CountryPickerModalView, setCountryPickerModalView] =
    useState<boolean>(false);

  return (
    <View style={styles.PhoneNumberContainer}>
      <TouchableOpacity
        onPress={() => {
          setCountryPickerModalView(!CountryPickerModalView);
        }}
        style={styles.CountryCodeView}>
        <Text>{UserCountry}</Text>
      </TouchableOpacity>
      <View>
        <TextInput
          placeholder="0000000000"
          numberOfLines={1}
          keyboardType="number-pad"
          focusable={true}
        />
      </View>

      {/* CountryCode Modal View */}
      <CountryPicker
        {...{
          visible: CountryPickerModalView,
          countryCode: UserCountry,
          withFlagButton: false,
          withFilter: true,
          withFlag: true,
          withCallingCodeButton: false,
          withCountryNameButton: false,
          withAlphaFilter: true,
          withCallingCode: true,
          withEmoji: true,
          onSelect(country) {
            setUserCountry(country.cca2);
          },
        }}
      />
    </View>
  );
};

export default PhoneNumberView;

const styles = StyleSheet.create({
  PhoneNumberContainer: {
    width: '100%',
    backgroundColor: 'red',
  },
  CountryCodeView: {
    flexDirection: 'row',
    alignContent: 'center',
  },
});
