# Responsive Sizing Guide

This guide will help you understand and utilize the relationship between screen percentages (`hp`) and common sizes (`CommonSize`) in your React Native projects. 

Here are some examples to demonstrate this relationship:

- `hp('5.5%')` is equivalent to `CommonSize(40)`
- `hp('1.8%')` corresponds to `CommonSize(14)`
- `hp('4.1%')` aligns with `CommonSize(30)`
- `hp('4.6%')` corresponds to `CommonSize(35)`
- `hp('2.4%')` is akin to `CommonSize(18)`
- `hp('1.5%')` is equivalent to `CommonSize(10)`
- `hp('2.7%')` corresponds to `CommonSize(20)`
- `hp('1.6%')` aligns with `CommonSize(12.5)`
- `hp('1.9%')` is akin to `CommonSize(15)`

## How to Use

To use `hp`, simply provide a percentage value as a string, and it will calculate the corresponding height value for you. 

For `CommonSize`, call the function with a size value as the argument, and it will handle the adjustments for different platforms.