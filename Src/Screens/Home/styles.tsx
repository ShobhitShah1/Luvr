import {StyleSheet} from 'react-native';
import {COLORS} from '../../Common/Theme';
import {heightPercentageToDP} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  FlatListStyle: {
    width: '90%',
    alignSelf: 'center',
  },
});

export default styles;
