import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../Contexts/ThemeContext';

const GradientView = ({ children }: { children: React.ReactNode }) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={colors.BackgroundGradient}
        style={styles.container}
      >
        {children}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default memo(GradientView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
