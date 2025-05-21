import React from 'react';
import { LinearGradient } from 'react-native-linear-gradient';
import { useTheme } from '../../../Contexts/ThemeContext';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TabData } from '../MyLikesScreen';
import styles from '../styles';

type RenderLikeScreenTopBarProps = {
  item: TabData;
  onPress: () => void;
  isSelected: boolean;
  tabsData: TabData[];
};

export const RenderLikeScreenTopBar = React.memo(
  ({ item, onPress, isSelected, tabsData }: RenderLikeScreenTopBarProps) => {
    const { colors, isDark } = useTheme();
    return (
      <Pressable
        key={item.index}
        onPress={onPress}
        style={[
          styles.TabBarButtonView,
          {
            width: `${100 / tabsData?.length - 2}%`,
            borderColor: isSelected ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
            borderWidth: isSelected ? 0 : 0.5,
          },
        ]}
      >
        <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={
            isSelected ? colors.ButtonGradient : !isDark ? [colors.White, colors.White] : ['transparent', 'transparent']
          }
          style={{
            flex: 1,
            justifyContent: 'center',
            borderRadius: 60,
          }}
        >
          <Text
            style={[
              styles.TabBarButtonText,
              {
                color: isSelected ? (isDark ? colors.TextColor : colors.White) : 'rgba(130, 130, 130, 1)',
              },
            ]}
          >
            {item.title}
          </Text>
        </LinearGradient>

        <View
          style={{
            position: 'absolute',
            right: 12,
            top: -7,
            bottom: 0,
            width: 25,
            height: 25,
            borderRadius: 5000,
            backgroundColor: isSelected ? 'rgba(238, 219, 13, 1)' : 'rgba(206, 206, 206, 1)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.Black, fontSize: 10, fontWeight: 'bold' }}>{item.count}</Text>
        </View>
      </Pressable>
    );
  }
);
