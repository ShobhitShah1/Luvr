import {LocalStorageFields} from '../../Types/LocalStorageFields';
import {RESET, UPDATE_FIELD} from '../Action/userActions';
// type UserData = {
//   [key in keyof typeof LocalStorageFields]: string;
// };

interface UserData {
  [LocalStorageFields.eventName]: String;
  [LocalStorageFields.loginType]: String;
  [LocalStorageFields.userFrom]: String;
  [LocalStorageFields.mobileNo]: String;
  [LocalStorageFields.identity]: String;
  [LocalStorageFields.profileImage]: String;
  [LocalStorageFields.fullName]: String;
  [LocalStorageFields.birthdate]: String;
  [LocalStorageFields.gender]: String;
  [LocalStorageFields.city]: String;
  [LocalStorageFields.orientation]: String[];
  [LocalStorageFields.isOrientationVisible]: boolean;
  [LocalStorageFields.hoping]: String;
  [LocalStorageFields.educationDegree]: String;
  [LocalStorageFields.collegeName]: String;
  [LocalStorageFields.habitsExercise]: String;
  [LocalStorageFields.habitsSmoke]: String;
  [LocalStorageFields.habitsMovies]: String;
  [LocalStorageFields.habitsDrink]: String;
  [LocalStorageFields.magicalPersonCommunicationStr]: String;
  [LocalStorageFields.magicalPersonReceivedLove]: String;
  [LocalStorageFields.magicalPersonEducationLevel]: String;
  [LocalStorageFields.magicalPersonStarSign]: String;
  [LocalStorageFields.likesInto]: String[];
  [LocalStorageFields.isBlockContact]: boolean;
  [LocalStorageFields.latitude]: number;
  [LocalStorageFields.longitude]: number;
  [LocalStorageFields.radius]: number;
  [LocalStorageFields.recentPik]: String[];
  [LocalStorageFields.OTP]: number;
}

const initialState: UserData = Object.keys(LocalStorageFields).reduce(
  (acc, field) => ({...acc, [field]: ''}),
  {} as UserData,
);

const userReducer = (state: UserData = initialState, action: any) => {
  console.log('REDUX LOG:', action.type, action?.field, action?.value);
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
