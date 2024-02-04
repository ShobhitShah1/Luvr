import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();
export function RootNavigation(name, type, params) {
  console.log(
    'navigationRef.isReady()',
    navigationRef.isReady(),
    name,
    type,
    params,
  );
  if (navigationRef.isReady()) {
    if (type === 'replace') {
      navigationRef.navigate(name);
    } else {
      navigationRef.navigate(name, params ? params : {});
    }
  }
}
