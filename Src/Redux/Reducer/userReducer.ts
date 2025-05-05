import { LocalStorageFields } from '../../Types/LocalStorageFields';
import UserDataType from '../../Types/UserDataType';
import {
  ON_SWIPE_LEFT,
  ON_SWIPE_RIGHT,
  RESET,
  RESET_SWIPER_KEYS,
  SET_USER_DATA,
  UPDATE_FIELD,
  ADD_NOTIFICATION,
  CURRENT_SCREEN,
  RESET_RIGHT_SWIPE,
  SET_CARD_SKIP_NUMBER,
  RESET_SWIPE_COUNT,
} from '../Action/actions';

const initialState: UserDataType & { swipedLeftUserIds: string[] } & { swipedRightUserIds: string[] } & {
  userData: string[];
} & { notifications: string[] } & { swipeCount: number } & {
  cardSkipNumber: number;
} = {
  ...Object.keys(LocalStorageFields).reduce((acc, field) => ({ ...acc, [field]: '' }), {} as UserDataType),
  swipedLeftUserIds: [],
  swipedRightUserIds: [],
  userData: [],
  notifications: [],
  CurrentScreen: '',
  swipeCount: 0,
  cardSkipNumber: 0,
};

const userReducer = (
  state: UserDataType & {
    swipedLeftUserIds: string[];
  } & {
    swipedRightUserIds: string[];
  } & {
    userData: string[];
  } & {
    notifications: string[];
  } & {
    CurrentScreen: string;
  } & {
    swipeCount: number;
  } = initialState,
  action: any
) => {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        userData: action.value || action.payload,
      };
    case UPDATE_FIELD:
      return {
        ...state,
        [action.field]: action.value,
      };
    case ON_SWIPE_LEFT:
      return {
        ...state,
        swipedLeftUserIds: [...(state?.swipedLeftUserIds || []), action.userId],
        swipeCount: state.swipeCount + 1,
      };
    case ON_SWIPE_RIGHT:
      const newUserId = action.userId instanceof Array ? action.userId : [action.userId];
      const uniqueUserIds = new Set([...(state?.swipedRightUserIds || []), ...newUserId]);

      return {
        ...state,
        swipedRightUserIds: Array.from(uniqueUserIds),
        swipeCount: state.swipeCount + 1,
      };
    case RESET_RIGHT_SWIPE:
      return {
        ...state,
        swipedRightUserIds: [],
      };
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case RESET_SWIPER_KEYS:
      return {
        ...state,
        swipedLeftUserIds: [],
        swipedRightUserIds: [],
        swipeCount: 0,
      };
    case CURRENT_SCREEN:
      return {
        ...state,
        CurrentScreen: action.value || action.payload,
      };
    case SET_CARD_SKIP_NUMBER:
      return {
        ...state,
        cardSkipNumber: action.payload,
      };
    case RESET_SWIPE_COUNT:
      return {
        ...state,
        swipeCount: 0,
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
