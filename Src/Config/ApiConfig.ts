import remoteConfig from '@react-native-firebase/remote-config';
import { Platform } from 'react-native';

const ApiConfig = {
  DEBUG: false,
  BASE_URL: 'https://nirvanatechlabs.in/dating/',
  IMAGE_UPLOAD_BASE_URL: 'https://nirvanatechlabs.in/dating/upload',
  GET_LOCATION_API: 'http://ip-api.com/json/?fields=countryCode',
  IMAGE_BASE_URL: 'https://nirvanatechlabs.in/DATING_IMAGES/profile_images/',
  SOCKET_BASE_URL: 'http://nirvanatechlabs.in:1111/',
  GOOGLE_WEB_CLIENT_ID: '126773940218-vqp2euiee90i9pecsh3gfdiaa19hj0rv.apps.googleusercontent.com',
  FACEBOOK_GRAPH_API: 'https://graph.facebook.com/v2.5/me?fields=email,name,picture,birthday,gender&access_token=',

  SHARE_BASE: 'https://nirvanatechlabs.in/app',

  ANDROID_AD_ID: 'ca-app-pub-7557128133141253~2454494674',

  PLAY_STORE: 'https://play.google.com/store/apps/details?id=com.luvr.dating',
  APP_STORE: 'https://apps.apple.com/us/app/luvr/id6480416488',

  PLACEHOLDER_IMAGE:
    'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

  BlockProfile: 'block_users',
  ReportProfile: 'report_users',
  GetSubscription: 'get_subscriptions',
  UserReferral: 'user_referral',
  HaveReferralCode: 'have_referral_code',
  incognitoMobile: 'incognito_mobile',
  incognitoIdentity: 'incognito_identity',
};

async function fetchRemoteConfigValues() {
  try {
    await remoteConfig().fetchAndActivate();

    const BASE_URL_REMOTE = remoteConfig().getValue('BASE_URL').asString();
    if (BASE_URL_REMOTE) {
      ApiConfig.BASE_URL = BASE_URL_REMOTE;
    }

    const SOCKET_BASE_URL_REMOTE = remoteConfig().getValue('SOCKET_BASE_URL').asString();
    if (SOCKET_BASE_URL_REMOTE) {
      ApiConfig.SOCKET_BASE_URL = SOCKET_BASE_URL_REMOTE;
    }

    const AD_MOB_ID = remoteConfig().getValue('AdMobID').asString();
    if (SOCKET_BASE_URL_REMOTE) {
      ApiConfig.ANDROID_AD_ID = AD_MOB_ID;
    }

    const SHARE_BASE = remoteConfig().getValue('SHARE_BASE').asString();
    if (SOCKET_BASE_URL_REMOTE) {
      ApiConfig.SHARE_BASE = SHARE_BASE;
    }

    const IMAGE_BASE_URL = remoteConfig().getValue('IMAGE_BASE_URL').asString();
    if (IMAGE_BASE_URL) {
      ApiConfig.IMAGE_BASE_URL = IMAGE_BASE_URL;
    }

    const ANDROID_AD_ID = remoteConfig().getValue('ANDROID_AD_ID').asString();
    if (ANDROID_AD_ID) {
      ApiConfig.ANDROID_AD_ID = ANDROID_AD_ID;
    }
  } catch (error) {}
}

fetchRemoteConfigValues();

export const skus = Platform.select({
  android: ['com.luvr.dating.donation', 'com.luvr.gold.monthly', 'com.luvr.platinum.monthly'],
  ios: ['com.luvr.dating.donation', 'com.luvr.gold.monthly', 'com.luvr.platinum.monthly'],
});

export const boostSkus = Platform.select({
  android: ['com.luvr.boost.day'],
  ios: ['com.luvr.boost.day'],
});

export default ApiConfig;
