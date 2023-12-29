import {LocalStorageFields} from '../../Types/LocalStorageFields';
import UserDataType from '../../Types/UserDataType';
import {RESET, UPDATE_FIELD} from '../Action/userActions';

const initialState: UserDataType = Object.keys(LocalStorageFields).reduce(
  (acc, field) => ({...acc, [field]: ''}),
  {} as UserDataType,
);

const userReducer = (state: UserDataType = initialState, action: any) => {
  switch (action.type) {
    case UPDATE_FIELD:
      return {
        ...state,
        [action.field]: action.value,
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
