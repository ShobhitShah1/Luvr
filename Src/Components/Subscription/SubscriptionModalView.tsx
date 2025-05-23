import React, { memo } from 'react';
import { Dimensions, Image, Platform, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

import CommonIcons from '../../Common/CommonIcons';
import { useSubscriptionModal } from '../../Contexts/SubscriptionModalContext';
import { useTheme } from '../../Contexts/ThemeContext';

import SubscriptionView from './SubscriptionView';

interface SubscriptionModalViewProps {
  isVisible: boolean;
  onClose: () => void;
  selectedPlan?: string;
  handlePlanSelection?: (key: string) => void;
}

function SubscriptionModalView({
  isVisible,
  onClose,
  selectedPlan,
  handlePlanSelection,
}: SubscriptionModalViewProps) {
  const { colors } = useTheme();
  const { hideSubscriptionModal } = useSubscriptionModal();

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      useNativeDriver
      statusBarTranslucent
      hideModalContentWhileAnimating
      deviceHeight={Dimensions.get('window').height + (StatusBar.currentHeight || 20)}
    >
      <Pressable
        onPress={hideSubscriptionModal}
        style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? 75 : 50,
          right: 25,
          zIndex: 1000,
        }}
      >
        <Image source={CommonIcons.CloseModal} style={{ width: 30, height: 30 }} />
      </Pressable>

      <LinearGradient colors={colors.BackgroundGradient} style={styles.container}>
        <SubscriptionView selectedPlan={selectedPlan} handlePlanSelection={handlePlanSelection} />
      </LinearGradient>
    </Modal>
  );
}

export default memo(SubscriptionModalView);

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingTop: Platform.OS === 'ios' ? '40%' : '30%',
    width: '100%',
  },
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
  },
});
