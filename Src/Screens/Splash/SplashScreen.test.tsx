import React from 'react';
import {render} from '@testing-library/react-native';
import SplashScreen from './SplashScreen';

describe('SplashScreen', () => {
  it('renders without crashing', () => {
    render(<SplashScreen />);
  });
});
