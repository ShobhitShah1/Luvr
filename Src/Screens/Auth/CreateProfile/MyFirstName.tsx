import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CreateProfileView from '../../../Components/AuthComponents/CreateProfileView';
import ButtonGradient from '../../../Components/ButtonGradient';

const MyFirstName = () => {
  return (
    <View>
      <CreateProfileView Count={0.2} Title={'My first name is'} Type={'Name'} /> 
    </View>
  );
};

export default MyFirstName;

const styles = StyleSheet.create({});
