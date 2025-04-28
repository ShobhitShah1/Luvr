import { AxiosRequestConfig } from 'axios';
import { ProfileType } from './ProfileType';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { chatRoomDataType } from './chatRoomDataType';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  SplashScreen: undefined;

  NumberVerificationStack: {
    screen?: 'Login' | 'PhoneNumber' | 'OTP';
    params?: any;
  };

  NumberVerification: {
    screen?: 'PhoneNumber' | 'OTP';
    params?: any;
  };

  LoginStack: {
    screen?:
      | 'AddEmail'
      | 'IdentifyYourSelf'
      | 'HopingToFind'
      | 'DistancePreference'
      | 'YourEducation'
      | 'AddDailyHabits'
      | 'WhatAboutYou'
      | 'YourIntro'
      | 'AddRecentPics'
      | 'SexualOrientationScreen';
    params?: any;
  };

  BottomTab: {
    screen?: 'Home' | 'ExploreCard' | 'MyLikes' | 'ChatRoom' | 'Profile';
  };

  LocationStack: {
    screen?: 'LocationPermission';
    params?: any;
  };

  Login: undefined;
  PhoneNumber: undefined;
  OTP: { number?: string };

  LocationPermission: undefined;

  AddEmail: undefined;
  IdentifyYourSelf: undefined;
  SexualOrientationScreen: undefined;
  HopingToFind: undefined;
  DistancePreference: undefined;
  YourEducation: undefined;
  AddDailyHabits: undefined;
  WhatAboutYou: undefined;
  YourIntro: undefined;
  AddRecentPics: undefined;

  CategoryDetailCards: {
    item: {
      id: number;
      title: string;
      image: any;
    };
  };
  ExploreCardDetail: {
    props: ProfileType;
  };
  Chat: {
    id?: string;
    ChatData?: chatRoomDataType;
  };
  EditProfile: undefined;
  Setting: undefined;
  Notification: undefined;
  Donation: undefined;
  QRCodeScreen: undefined;
  RedeemReferralCode: { fromRegistration?: boolean };
  IncognitoScreen: undefined;
};

export type StackNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, T>;

export type StackRouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;

export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<T>;
  route: StackRouteProp<T>;
};

export interface FetchWrapper {
  get: (url: string, params?: Record<string, any>, config?: AxiosRequestConfig) => Promise<any>;
  post: (url: string, params: Record<string, any>, config?: AxiosRequestConfig) => Promise<any>;
  uploadHandler: (
    url: string,
    formData: FormData | Record<string, any> | any,
    config?: AxiosRequestConfig
  ) => Promise<any>;
}

export interface ReportOrBlockInterface {
  isVisible: boolean;
  setReportAndBlockModal: (value: boolean) => void;
  setShowReportModalView: (value: boolean) => void;
  onBlockProfileClick: () => void;
  ShowReportModalView: boolean;
}

export interface ChatRoomProps {
  item: ChatRoomDataType;
  index?: number;
}

interface MessageType {
  id: string;
  is_read: number;
  message: string;
  time: number;
}

interface ChatRoomDataType {
  chat: MessageType[];
  profile?: string;
  last_updated_time: number;
  name: string;
  reciver_socket_id: string | null;
  to: string;
}

// ChatRoom
interface ChatMessage {
  senderId: string;
  message: string;
  timestamp: number;
}

export interface MessageItem {
  chat: ChatMessage[];
  last_updated_time: number;
  name: string;
  reciver_socket_id: string;
  to: string;
  profile: string;
}

interface ListResponseData {
  data: MessageItem[];
}

export interface SocketEventHandlers {
  List: (data: ListResponseData | null) => void;
  message: (data: any) => void;
}

export interface SubscriptionPlan {
  key: string;
  title: string;
  description: string;
  benefits: string[];
}

export interface RemoteConfigData {
  subscriptions: SubscriptionPlan[];
}

// LIKE MATCH AND CRUSH DATA WITH USER PROFILE PROPS

export interface LikeMatchAndCrushAPIDataTypes {
  match: ListDetailProps[];
  like: ListDetailProps[];
  crush: ListDetailProps[];
}

export interface ListDetailProps {
  _id: string;
  first_approch: string;
  second_approch: string;
  status: string;
  user_details: ProfileType[];
}

// NEW

export interface SubscriptionPlanProps {
  _id: string;
  benefits: string[];
  colors: Colors;
  date: Date;
  description: string;
  enable: number;
  icon: string;
  key: string;
  popularityTag: string;
  price: string;
  title: string;
}

interface Date {
  $date: string;
}

interface Colors {
  dark: Dark;
  light: Dark;
}

interface Dark {
  background: string;
  border: string;
  buyButton: string[];
  buyButtonBorder: string;
  buyButtonText: string;
  checkIcon: string;
  crownBackground: string;
  crownBorder: string;
  featuresBackground: string;
  featuresBackgroundDark: string;
  gradientColors: string[];
  priceContainerBorder: string;
  priceUnselectedColor: string;
  secondary: string;
  title: string;
}

export interface BoostModalProps {
  isVisible: boolean;
  isLoading: boolean;
  onClose: () => void;
  onBoostMe: () => void;
}

export interface HomeListProps {
  item: {
    id: number;
    title: string;
    image: number;
  };
}

export interface BoostPaymentResponse {
  platform: string;
  productId: string;
  productIds: string[];
  purchaseToken: string;
  transactionId: string;
  transactionDate: number;
  autoRenewing?: boolean;
  isAcknowledged?: boolean;
  purchaseState?: number;
  packageName?: string;
  signature?: string;
  developerPayload?: string;
  obfuscatedAccountId?: string;
  obfuscatedProfileId?: string;
  transactionReceipt?: any;
  dataAndroid?: any;
}

export interface BoostData {
  _id: string;
  user_id: string;
  payment_response: BoostPaymentResponse;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  is_active: boolean;
}

export interface BoostState {
  isLoading: boolean;
  error: string | null;
  activeBoost: BoostData | null;
  isBoostActive: boolean;
}
