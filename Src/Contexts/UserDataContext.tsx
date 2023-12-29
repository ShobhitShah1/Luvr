import React, {ReactNode, createContext, useContext, useReducer} from 'react';
import {LocalStorageFields, UserField} from '../Types/LocalStorageFields';
import UserDataType from '../Types/UserDataType';

/**

** Data Will Store In React Native Context

** This Will Help To Track Data While App Open

*! On App Close This Will Not Work

**/

interface UserDataContextProps {
  userData: UserDataType;
  dispatch: React.Dispatch<UserAction>;
}

type UserAction =
  | {type: 'UPDATE_FIELD'; field: UserField; value: string}
  | {type: 'RESET'};

const initialState: UserDataType = Object.keys(LocalStorageFields).reduce(
  (acc, field) => ({...acc, [field]: ''}),
  {} as UserDataType,
);

const UserDataContext = createContext<UserDataContextProps | undefined>(
  undefined,
);

const userReducer = (state: UserDataType, action: UserAction): UserDataType => {
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
