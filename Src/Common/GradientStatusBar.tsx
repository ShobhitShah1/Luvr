import React from 'react';
import {StatusBar, View, StatusBarProps} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GradientStatusBarProps extends StatusBarProps {
  colors: string[];
}

const GradientStatusBar: React.FC<GradientStatusBarProps> = ({
  colors,
  ...props
}) => {
  return (
    <View style={{height: StatusBar.currentHeight}}>
      <LinearGradient
        colors={colors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{flex: 1}}>
        <StatusBar translucent backgroundColor="transparent" {...props} />
      </LinearGradient>
    </View>
  );
};

export default GradientStatusBar;
