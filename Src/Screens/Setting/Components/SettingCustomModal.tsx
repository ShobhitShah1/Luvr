/* eslint-disable react-native/no-inline-styles */
import React, {FC, useState} from 'react';
import {View} from 'react-native';
import LogOutModalRenderView from './LogOutModalRenderView'; // Assuming you have this component
import Modal, {ModalProps} from 'react-native-modal';

interface ModalProps {
  isVisible: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string | JSX.Element;
  ButtonCloseText: string;
  ButtonTitle: string;
}

const SettingCustomModal: FC<ModalProps> = ({
  isVisible,
  setState,
  title,
  description,
  ButtonCloseText,
  ButtonTitle,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationInTiming={500}
      animationOutTiming={500}
      useNativeDriver
      useNativeDriverForBackdrop
      hasBackdrop
      onBackdropPress={() => setState(false)}
      onBackButtonPress={() => setState(false)}
      style={{
        flex: 1,
        padding: 0,
        margin: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{position: 'absolute', bottom: 20}}>
        <LogOutModalRenderView
          setState={setState}
          onPress={() => {}}
          title={title}
          description={description}
          ButtonCloseText={ButtonCloseText}
          ButtonTitle={ButtonTitle}
        />
      </View>
    </Modal>
  );
};

export default SettingCustomModal;
