import {Alert, Linking} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {COLORS} from '../Common/Theme';

interface OpenURLProps {
  URL: string;
}

type AsyncFC<P> = (props: P) => Promise<void>;

const OpenURL: AsyncFC<OpenURLProps> = async ({URL}) => {
  try {
    if ((await InAppBrowser.isAvailable()) && URL) {
      await InAppBrowser.open(URL, {
        //* iOS Properties
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: COLORS.Primary,
        preferredControlTintColor: 'white',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
        //* Android Properties
        showTitle: true,
        toolbarColor: COLORS.Primary,
        secondaryToolbarColor: 'black',
        navigationBarColor: 'black',
        navigationBarDividerColor: 'white',
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        //* Specify full animation resource identifier(package:anim/name)
        //*  or only resource name(in case of animation bundled with app).
        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right',
        },
      });
    } else {
      Linking.openURL(URL);
    }
  } catch (error: any) {
    Alert.alert(error.message);
  }
};

export default OpenURL;
