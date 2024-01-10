import {LocalStorageFields} from '../../Types/LocalStorageFields';
import UserDataType from '../../Types/UserDataType';
import {ON_SWIPE_LEFT, RESET, UPDATE_FIELD} from '../Action/userActions';

// const initialState: UserDataType = Object.keys(LocalStorageFields).reduce(
//   (acc, field) => ({...acc, [field]: ''}),
//   {} as UserDataType,
// );
const initialState: UserDataType & {swipedLeftUserIds: string[]} = {
  ...Object.keys(LocalStorageFields).reduce(
    (acc, field) => ({...acc, [field]: ''}),
    {} as UserDataType,
  ),
  swipedLeftUserIds: [],
};

const userReducer = (
  state: UserDataType & {swipedLeftUserIds: string[]} = initialState,
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
        swipedLeftUserIds: [...state?.swipedLeftUserIds, action.userId],
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
