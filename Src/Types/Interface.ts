import {AxiosRequestConfig} from 'axios';
import {ProfileType} from './ProfileType';

export interface FetchWrapper {
  get: (
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
  ) => Promise<any>;
  post: (
    url: string,
    params: Record<string, any>,
    config?: AxiosRequestConfig,
  ) => Promise<any>;
  uploadHandler: (
    url: string,
    formData: FormData | Record<string, any> | any,
    config?: AxiosRequestConfig,
  ) => Promise<any>;
}

export interface LikeInterface {
  _id: string;
  first_approch: string;
  second_approch: string;
  status: string;
  user_details: ProfileType[];
}

export interface MembershipProductsType {
  currency: string;
  description: string;
  localizedPrice: string;
  name: string;
  oneTimePurchaseOfferDetails: OneTimePurchaseOfferDetails;
  price: string;
  productId: string;
  productType: string;
  title: string;
}

export interface OneTimePurchaseOfferDetails {
  formattedPrice: string;
  priceAmountMicros: string;
  priceCurrencyCode: string;
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
//
