import { AxiosRequestConfig } from 'axios';
import { ProfileType } from './ProfileType';

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
  index: number;
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
