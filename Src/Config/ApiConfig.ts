import remoteConfig from '@react-native-firebase/remote-config';
import {Platform} from 'react-native';

const ApiConfig = {
  DEBUG: false,
  BASE_URL: 'https://nirvanatechlabs.in/dating/',
  IMAGE_UPLOAD_BASE_URL: 'https://nirvanatechlabs.in/dating/upload',
  GET_LOCATION_API: 'http://ip-api.com/json/?fields=countryCode',
  IMAGE_BASE_URL: 'https://nirvanatechlabs.in/DATING_IMAGES/profile_images/',
  SOCKET_BASE_URL: 'http://nirvanatechlabs.in:1111/',
  GOOGLE_WEB_CLIENT_ID:
    '126773940218-vqp2euiee90i9pecsh3gfdiaa19hj0rv.apps.googleusercontent.com',
  FACEBOOK_GRAPH_API:
    'https://graph.facebook.com/v2.5/me?fields=email,name,picture,birthday,gender&access_token=',

  //* EventName's
  BlockProfile: 'block_users',
  ReportProfile: 'report_users',
};

async function fetchRemoteConfigValues() {
  try {
    await remoteConfig().fetchAndActivate();

    const BASE_URL_REMOTE = remoteConfig().getValue('BASE_URL').asString();
    if (BASE_URL_REMOTE) {
      ApiConfig.BASE_URL = BASE_URL_REMOTE;
    }

    const SOCKET_BASE_URL_REMOTE = remoteConfig()
      .getValue('SOCKET_BASE_URL')
      .asString();
    if (SOCKET_BASE_URL_REMOTE) {
      ApiConfig.SOCKET_BASE_URL = SOCKET_BASE_URL_REMOTE;
    }

    console.log('BASE_URL_REMOTE:', ApiConfig.BASE_URL);
    console.log('SOCKET_BASE_URL_REMOTE:', ApiConfig.SOCKET_BASE_URL);
  } catch (error) {
    console.error('Error fetching remote config:', error);
  }
}

fetchRemoteConfigValues();

export const skus = Platform.select({
  android: ['com.luvr.dating.donation', 'com.luvr.gold', 'com.luve.platinum'],
  ios: ['com.luvr.dating.donation', 'com.luvr.gold', 'com.luve.platinum'],
});

export default ApiConfig;
