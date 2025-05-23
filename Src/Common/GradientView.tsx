import React, { memo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { gradientEnd, gradientStart } from '../Config/Setting';
import { useTheme } from '../Contexts/ThemeContext';

function GradientView({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={styles.container}
      edges={Platform.OS === 'android' ? ['top', 'left', 'right', 'bottom'] : []}
    >
      <LinearGradient
        start={gradientStart}
        end={gradientEnd}
        colors={colors.BackgroundGradient}
        style={styles.container}
      >
        {children}
      </LinearGradient>
    </SafeAreaView>
  );
}

export default memo(GradientView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
