// Context/UserDataContext.tsx
import React, { ReactNode, createContext, useContext, useReducer, useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LocalStorageFields, UserField } from '../Types/LocalStorageFields';
import { store } from '../Redux/Store/store';
import { updateField as reduxUpdateField } from '../Redux/Action/actions';
import { createSelector } from 'reselect';
import UserDataType from '../Types/UserDataType';
import { SubscriptionData } from '../Types/SubscriptionTypes';
import { debouncedGetSubscription } from '../Services/SubscriptionService';

interface RootState {
  user: {
    userData?: any[];
    [key: string]: any;
  };
  membership: {
    subscription: SubscriptionData | null;
    isSubscriptionActive: boolean;
    isLoading: boolean;
    error: string | null;
  };
}

interface UserDataContextProps {
  userData: UserDataType;
  subscription: {
    data: SubscriptionData | null;
    isActive: boolean;
    isLoading: boolean;
    error: string | null;
  };
  updateField: (field: UserField, value: any) => void;
  resetUserData: () => void;
  refreshSubscription: () => Promise<boolean>;
}

type UserAction =
  | { type: 'UPDATE_FIELD'; field: UserField; value: any }
  | { type: 'SET_ALL_DATA'; data: Partial<UserDataType> }
  | { type: 'RESET' };

const initialState: UserDataType = Object.keys(LocalStorageFields).reduce(
  (acc, field) => ({ ...acc, [field]: '' }),
  {} as UserDataType
);

const UserDataContext = createContext<UserDataContextProps | undefined>(undefined);

const userReducer = (state: UserDataType, action: UserAction): UserDataType => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      // Avoid re-renders if the value hasn't changed
      if (state[action.field] === action.value) {
        return state;
      }
      return { ...state, [action.field]: action.value };
    case 'SET_ALL_DATA':
      // Only update if there are actual changes
      const hasChanges = Object.entries(action.data).some(([key, value]) => state[key as UserField] !== value);
      if (!hasChanges) {
        return state;
      }
      return { ...state, ...action.data };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const selectUserState = (state: RootState) => state.user;
const selectUserFields = (state: RootState) => state.user;
const selectUserDataArray = (state: RootState) => state.user.userData;
const selectSubscription = (state: RootState) => state.membership;

const selectUserData = createSelector(
  [selectUserState, selectUserFields, selectUserDataArray],
  (userState, userFields, userDataArray): Partial<UserDataType> => {
    const userData: Partial<UserDataType> = {};

    Object.keys(LocalStorageFields).forEach((field) => {
      const key = field as UserField;
      if (key in userState) {
        userData[key] = userState[key];
      }
    });

    if (userDataArray && userDataArray.length > 0) {
      // Check if userData[0] is an object before processing
      const firstUserData = userDataArray[0];
      if (firstUserData && typeof firstUserData === 'object') {
        Object.entries(firstUserData).forEach(([key, value]) => {
          if (key in LocalStorageFields) {
            userData[key as UserField] = value;
          }
        });
      }
    }

    return userData;
  }
);

const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [localUserData, dispatch] = useReducer(userReducer, initialState);
  const prevReduxData = useRef<Record<string, any>>({});

  const reduxUserData = useSelector(selectUserData);
  const subscriptionData = useSelector(selectSubscription);

  useEffect(() => {
    const hasDataChanged = () => {
      if (Object.keys(reduxUserData).length === 0) return false;

      return Object.entries(reduxUserData).some(([key, value]) => {
        return prevReduxData.current[key] !== value;
      });
    };

    if (hasDataChanged()) {
      dispatch({ type: 'SET_ALL_DATA', data: reduxUserData });
      prevReduxData.current = { ...reduxUserData };
    }
  }, [reduxUserData]);

  // Fetch subscription data on initial load
  useEffect(() => {
    debouncedGetSubscription();
  }, []);

  const updateField = (field: UserField, value: any) => {
    store.dispatch(reduxUpdateField(field, value));

    if (localUserData[field] !== value) {
      dispatch({ type: 'UPDATE_FIELD', field, value });
    }
  };

  const resetUserData = () => {
    dispatch({ type: 'RESET' });
  };

  const refreshSubscription = async () => {
    return await debouncedGetSubscription();
  };

  const contextValue = useMemo(
    () => ({
      userData: localUserData,
      subscription: {
        data: subscriptionData.subscription,
        isActive: subscriptionData.isSubscriptionActive,
        isLoading: subscriptionData.isLoading,
        error: subscriptionData.error,
      },
      updateField,
      resetUserData,
      refreshSubscription,
    }),
    [localUserData, subscriptionData]
  );

  return <UserDataContext.Provider value={contextValue}>{children}</UserDataContext.Provider>;
};

const useUserData = (): UserDataContextProps => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

export { UserDataProvider, useUserData };
