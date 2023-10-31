import {StyleSheet} from 'react-native';
import {CommonSize} from '../../../Common/CommonSize';
import {COLORS, FONTS} from '../../../Common/Theme';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  SubContainerView: {
    margin: CommonSize(20),
  },
  borderStyleBase: {
    width: 30,
    height: 45
  },
  CodeAndNumberView:{
    marginVertical: CommonSize(5),
    marginHorizontal: CommonSize(20),
  },
  MyCodeText:{
    fontSize: CommonSize(20),
    fontFamily: FONTS.Bold,
    color: COLORS.Black,
  },
  NumberText:{
    marginVertical: CommonSize(10),
    fontSize: CommonSize(15),
    fontFamily: FONTS.Medium,
    color: COLORS.Silver,
  },
  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  }, 
});

export default styles;
