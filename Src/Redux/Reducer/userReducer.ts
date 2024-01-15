import {LocalStorageFields} from '../../Types/LocalStorageFields';
import UserDataType from '../../Types/UserDataType';
import {
  ON_SWIPE_LEFT,
  ON_SWIPE_RIGHT,
  RESET,
  UPDATE_FIELD,
} from '../Action/userActions';

// const initialState: UserDataType = Object.keys(LocalStorageFields).reduce(
//   (acc, field) => ({...acc, [field]: ''}),
//   {} as UserDataType,
// );
const initialState: UserDataType & {swipedLeftUserIds: string[]} & {
  swipedRightUserIds: string[];
} = {
  ...Object.keys(LocalStorageFields).reduce(
    (acc, field) => ({...acc, [field]: ''}),
    {} as UserDataType,
  ),
  swipedLeftUserIds: [],
  swipedRightUserIds: [],
};

const userReducer = (
  state: UserDataType & {swipedLeftUserIds: string[]} & {
    swipedRightUserIds: string[];
  } = initialState,
  action: any,
) => {
  switch (action.type) {
    case UPDATE_FIELD:
      return {
        ...state,
        [action.field]: action.value,
      };
    case ON_SWIPE_LEFT:
      return {
        ...state,
        swipedLeftUserIds: [...(state?.swipedLeftUserIds || []), action.userId],
      };
    case ON_SWIPE_RIGHT:
      return {
        ...state,
        swipedRightUserIds: [
          ...(state?.swipedRightUserIds || []),
          ...action.userId,
        ],
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
