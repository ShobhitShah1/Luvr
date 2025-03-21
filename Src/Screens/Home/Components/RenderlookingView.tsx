import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Skeleton } from 'moti/skeleton';
import React, { FC, memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, GROUP_FONT } from '../../../Common/Theme';
import { useTheme } from '../../../Contexts/ThemeContext';

interface RenderLookingViewProps {
  item: {
    id: number;
    title: string;
    image: number;
  };
  IsLoading: boolean;
}

const RenderLookingView: FC<RenderLookingViewProps> = ({ item, IsLoading }) => {
  const { isDark, colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<{ CategoryDetailCards: {} }>>();

  return (
    <Pressable
      disabled={IsLoading}
      onPress={() => {
        navigation.navigate('CategoryDetailCards', { item });
      }}
      style={[styles.container, { borderColor: isDark ? colors.White : 'transparent' }]}
    >
      <Skeleton colorMode="light" show={IsLoading} colors={COLORS.LoaderGradient}>
        <View>
          <Image resizeMode="cover" source={item.image} style={styles.imageView} />
          <LinearGradient colors={COLORS.GradientViewForCards} style={styles.gradient}>
            {!IsLoading && (
              <Text numberOfLines={2} style={styles.TitleText}>
                {item?.title}
              </Text>
            )}
          </LinearGradient>
        </View>
      </Skeleton>
    </Pressable>
  );
};

export default memo(RenderLookingView);

const styles = StyleSheet.create({
  container: {
    width: 125,
    height: 125,
    overflow: 'hidden',
    marginVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  imageView: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  gradient: {
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    paddingVertical: 5,
    overflow: 'hidden',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  TitleText: {
    width: '88%',
    ...GROUP_FONT.h2,
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    color: COLORS.White,
    alignSelf: 'center',
  },
});
