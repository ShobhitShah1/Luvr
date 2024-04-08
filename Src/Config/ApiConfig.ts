import remoteConfig from '@react-native-firebase/remote-config';
import {Platform} from 'react-native';

const ApiConfig = {
  DEBUG: false,
  BASE_URL: 'https://nirvanatechlabs.in/dating/',
  IMAGE_UPLOAD_BASE_URL: 'https://nirvanatechlabs.in/dating/upload',
  GET_LOCATION_API: 'http://ip-api.com/json/?fields=countryCode',
  IMAGE_BASE_URL: 'https://nirvanatechlabs.in/DATING_IMAGES/profile_images/',
  OTP_BASE_URL:
    'https://2factor.in/API/V1/5b2706aa-9db2-11ee-8cbb-0200cd936042/SMS/',
  SOCKET_BASE_URL: 'http://nirvanatechlabs.in:1111/',
  GOOGLE_WEB_CLIENT_ID:
    '591101539634-qfm6j0v8n1sokdd69985puskjb1l6fqv.apps.googleusercontent.com',
  FACEBOOK_GRAPH_API:
    'https://graph.facebook.com/v2.5/me?fields=email,name,picture,birthday,gender&access_token=',

  //* EventName's

  BlockProfile: 'block_users',
  ReportProfile: 'report_users',
};

// remoteConfig().fetch(0);

// remoteConfig()
//   .fetchAndActivate()
//   .then(() => {
//     const BASE_URL_REMOTE = remoteConfig().getValue('BASE_URL').asString();
//     const SOCKET_BASE_URL_REMOTE = remoteConfig()
//       .getValue('SOCKET_BASE_URL')
//       .asString();
//     console.log('BASE_URL_REMOTE:', BASE_URL_REMOTE);
//     console.log('SOCKET_BASE_URL_REMOTE:', SOCKET_BASE_URL_REMOTE);
//   });

// Fetch remote config values
async function fetchRemoteConfigValues() {
  try {
    await remoteConfig().fetchAndActivate();
    console.log('Remote Config activated successfully.');

    // Get BASE_URL from remote config or use default
    const BASE_URL_REMOTE = remoteConfig().getValue('BASE_URL').asString();
    if (BASE_URL_REMOTE) {
      ApiConfig.BASE_URL = BASE_URL_REMOTE;
    }

    // Get SOCKET_BASE_URL from remote config or use default
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

// Call function to fetch remote config values
fetchRemoteConfigValues();

export const skus = Platform.select({
  android: ['com.luvr.dating.donation'],
  ios: [''],
});

export default ApiConfig;
