import { Dimensions, Image, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import Modal from 'react-native-modal';
import SubscriptionView from './SubscriptionView';
import { useTheme } from '../../Contexts/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import CommonIcons from '../../Common/CommonIcons';
import { useSubscriptionModal } from '../../Contexts/SubscriptionModalContext';

interface SubscriptionModalViewProps {
  isVisible: boolean;
  onClose: () => void;
  selectedPlan?: string;
  handlePlanSelection?: (key: string) => void;
}

const SubscriptionModalView = ({
  isVisible,
  onClose,
  selectedPlan,
  handlePlanSelection,
}: SubscriptionModalViewProps) => {
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
      <Pressable onPress={hideSubscriptionModal} style={{ position: 'absolute', top: 50, right: 25, zIndex: 1000 }}>
        <Image source={CommonIcons.CloseModal} style={{ width: 30, height: 30 }} />
      </Pressable>

      <LinearGradient colors={colors.BackgroundGradient} style={styles.container}>
        <SubscriptionView selectedPlan={selectedPlan} handlePlanSelection={handlePlanSelection} />
      </LinearGradient>
    </Modal>
  );
};

export default memo(SubscriptionModalView);

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: '30%',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
});
