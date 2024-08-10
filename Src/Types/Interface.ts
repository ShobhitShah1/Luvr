import {ProfileType} from './ProfileType';

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
