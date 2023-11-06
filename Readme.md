# 📏 The Art of Responsive Sizing 🎨

Welcome to the enchanting world of responsive design, where percentages and common sizes unite to craft a visually captivating experience in your React Native projects! 🪄✨

## Unveiling the Magic Numbers 🔮

Prepare to be amazed by the mystical transformation of percentages into common sizes:

- 📐 `hp('5.5%')` magically transforms into `CommonSize(40)`
- 🌟 `hp('1.8%')` gracefully morphs into `CommonSize(14)`
- ✨ `hp('4.1%')` dances elegantly as it aligns with `CommonSize(30)`
- 💫 `hp('4.6%')` elegantly resonates with `CommonSize(35)`
- 🌠 `hp('2.4%')` shapeshifts into the likeness of `CommonSize(18)`
- 🌻 `hp('1.5%')` gleams and transforms into the grace of `CommonSize(10)`
- 🌆 `hp('2.7%')` gracefully corresponds to the elegance of `CommonSize(20)`
- 🌇 `hp('1.6%')` pirouettes into the enchantment of `CommonSize(12.5)`
- 🌄 `hp('1.9%')` beautifully harmonizes with `CommonSize(15)`

## Master the Spell 🪄

To harness the power of `hp`, simply speak its name with a percentage value, and it will conjure the perfect height for you. ✨

For the enigmatic `CommonSize`, invoke the function with a size value, and it shall gracefully adapt to the unique attributes of various platforms. 🧙‍♂️

```javascript
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
