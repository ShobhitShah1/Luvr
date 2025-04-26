import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Types/Interface';

export const useCustomNavigation = () => {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
};
