import {StyleSheet} from 'react-native';
import {COLORS} from '../../Common/Theme';
import { CommonSize } from '../../Common/CommonSize';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center', 
    backgroundColor: COLORS.Primary,
  },
  TinderLogoStyle:{
    width: CommonSize(65),
    height: CommonSize(80),
    justifyContent:'center',
    alignSelf:'center'
  }
});

export default styles;
