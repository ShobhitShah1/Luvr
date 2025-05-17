import React, { memo } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CommonIcons from '../../../Common/CommonIcons';
import { useTheme } from '../../../Contexts/ThemeContext';
import styles from '../styles';

interface ListEmptyViewProps {
  selectedTabIndex: number;
  onRefresh: () => void;
}

const ListEmptyView = memo(({ selectedTabIndex, onRefresh }: ListEmptyViewProps) => {
  const { colors, isDark } = useTheme();

  const getEmptyStateText = () => {
    const type = selectedTabIndex === 0 ? 'Likes' : selectedTabIndex === 1 ? 'Matches' : 'Crush';
    return {
      title: `No ${type}`,
      description: `You have no ${type} right now, when someone ${type} you they will appear here.`,
    };
  };

  const { title, description } = getEmptyStateText();

  return (
    <View style={styles.ListEmptyComponentView}>
      <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={isDark ? colors.ButtonGradient : [colors.White, colors.White]}
        style={styles.NoLikeImageView}
      >
        <Image
          tintColor={isDark ? colors.White : colors.Primary}
          source={CommonIcons.NoLikes}
          style={styles.NoLikeImage}
        />
      </LinearGradient>
      <View style={styles.EmptyTextView}>
        <Text style={[styles.NoLikeTitle, { color: colors.TitleText }]}>{title}</Text>
        <Text style={[styles.NoLikeDescription, { color: isDark ? 'rgba(255, 255, 255, 0.5)' : colors.TextColor }]}>
          {description}
        </Text>
        <Pressable onPress={onRefresh} style={styles.RefreshButtonContainer}>
          <Image source={CommonIcons.sync} tintColor={colors.TextColor} style={styles.RefreshButtonIcon} />
          <Text style={[styles.RefreshButtonText, { color: colors.TextColor }]}>Refresh Page</Text>
        </Pressable>
      </View>
    </View>
  );
});

export default ListEmptyView;
