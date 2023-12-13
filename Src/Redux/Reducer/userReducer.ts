import {LocalStorageFields} from '../../Types/LocalStorageFields';
import {RESET, UPDATE_FIELD, UserAction} from '../Action/userActions';
type UserData = {
  [key in keyof typeof LocalStorageFields]: string;
};

const initialState: UserData = Object.keys(LocalStorageFields).reduce(
  (acc, field) => ({...acc, [field]: ''}),
  {} as UserData,
);

const userReducer = (
  state: UserData = initialState,
  action: UserAction,
): UserData => {
  switch (action.type) {
    case UPDATE_FIELD:
      return {...state, [action.field]: action.value};
    case RESET:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
