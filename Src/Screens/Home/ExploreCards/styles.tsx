import { StyleSheet } from 'react-native';

import { COLORS, GROUP_FONT } from '../../../Common/Theme';

const styles = StyleSheet.create({
  EmptyListText: {
    ...GROUP_FONT.h2,
    color: COLORS.Primary,
    textAlign: 'center',
  },
  EmptyListView: {
    flex: 1,
    justifyContent: 'center',
  },
  FlatListStyle: {
    alignSelf: 'center',
    width: '90%',
  },
  LoaderContainer: {
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
});

export default styles;
