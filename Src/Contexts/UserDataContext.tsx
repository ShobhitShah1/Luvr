import React, {ReactNode, createContext, useContext, useReducer} from 'react';
import {LocalStorageFields, UserField} from '../Types/LocalStorageFields';

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

interface UserDataContextProps {
  userData: UserData;
  dispatch: React.Dispatch<UserAction>;
}

type UserAction =
  | {type: 'UPDATE_FIELD'; field: UserField; value: String}
  | {type: 'RESET'};

const initialState: UserData = Object.keys(LocalStorageFields).reduce(
  (acc, field) => ({...acc, [field]: ''}),
  {} as UserData,
);

const UserDataContext = createContext<UserDataContextProps | undefined>(
  undefined,
);

const userReducer = (state: UserData, action: UserAction): UserData => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {...state, [action.field]: action.value};
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const UserDataProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [userData, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserDataContext.Provider value={{userData, dispatch}}>
      {children}
    </UserDataContext.Provider>
  );
};

const useUserData = (): UserDataContextProps => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

export {UserDataProvider, useUserData};
