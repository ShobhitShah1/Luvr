import { BlurView } from '@react-native-community/blur';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface BlurredBackdropProps {
  toggleModal?: () => void;
}

export const BlurredBackdrop = ({ toggleModal }: BlurredBackdropProps) => (
  <Pressable onPress={toggleModal} disabled={!toggleModal} style={styles.blurContainer}>
    <BlurView blurAmount={5} blurType="dark" style={styles.blurView} reducedTransparencyFallbackColor="transparent" />
  </Pressable>
);

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  blurView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
