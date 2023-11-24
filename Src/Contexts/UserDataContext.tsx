import React, {createContext, useContext, useReducer, ReactNode} from 'react';
import {UserField, LocalStorageFields} from '../Types/LocalStorageFields';

interface UserData {
  [LocalStorageFields.firstName]: string;
  [LocalStorageFields.dob]: string;
  [LocalStorageFields.gender]: string;
  [LocalStorageFields.sexualOrientation]: string[];
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
