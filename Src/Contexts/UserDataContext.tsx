import React, {createContext, useContext, useReducer, ReactNode} from 'react';
import {UserField, LocalStorageFields} from '../Types/LocalStorageFields';

interface UserData {
  [LocalStorageFields.eventName]: string;
  [LocalStorageFields.loginType]: string;
  [LocalStorageFields.userFrom]: string;
  [LocalStorageFields.mobileNo]: string;
  [LocalStorageFields.identity]: string;
  [LocalStorageFields.profileImage]: string;
  [LocalStorageFields.fullName]: string;
  [LocalStorageFields.birthdate]: string;
  [LocalStorageFields.gender]: string;
  [LocalStorageFields.city]: string;
  [LocalStorageFields.orientation]: string[];
  [LocalStorageFields.isOrientationVisible]: boolean;
  [LocalStorageFields.hoping]: string;
  [LocalStorageFields.educationDegree]: string;
  [LocalStorageFields.collegeName]: string;
  [LocalStorageFields.habitsExercise]: string;
  [LocalStorageFields.habitsSmoke]: string;
  [LocalStorageFields.habitsMovies]: string;
  [LocalStorageFields.habitsDrink]: string;
  [LocalStorageFields.magicalPersonCommunicationStr]: string;
  [LocalStorageFields.magicalPersonReceivedLove]: string;
  [LocalStorageFields.magicalPersonEducationLevel]: string;
  [LocalStorageFields.magicalPersonStarSign]: string;
  [LocalStorageFields.likesInto]: string[];
  [LocalStorageFields.isBlockContact]: boolean;
  [LocalStorageFields.latitude]: number;
  [LocalStorageFields.longitude]: number;
  [LocalStorageFields.radius]: number;
  [LocalStorageFields.recentPik]: string[];
}

interface UserDataContextProps {
  userData: UserData;
  dispatch: React.Dispatch<UserAction>;
}

type UserAction =
  | {type: 'UPDATE_FIELD'; field: UserField; value: string}
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
