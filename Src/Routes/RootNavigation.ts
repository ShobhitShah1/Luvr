import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export function RootNavigation(name: string, type: string, params: object) {
  if (navigationRef.isReady()) {
    if (type === 'replace') {
      navigationRef.navigate(name);
    } else {
      navigationRef.navigate(name, params ? params : {});
    }
  }
}
