import { StyleSheet } from 'react-native';
import { COLORS, GROUP_FONT } from '../../../Common/Theme';

const styles = StyleSheet.create({
  FlatListStyle: {
    width: '90%',
    alignSelf: 'center',
  },
  EmptyListView: {
    flex: 1,
    justifyContent: 'center',
  },
  EmptyListText: {
    ...GROUP_FONT.h2,
    textAlign: 'center',
    color: COLORS.Primary,
  },
  container: {
    flex: 1,
  },
  LoaderContainer: {
    justifyContent: 'center',
  },
});
export default styles;
