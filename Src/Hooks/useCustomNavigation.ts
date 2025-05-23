import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../Types/Interface';

export const useCustomNavigation = () => {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
};
