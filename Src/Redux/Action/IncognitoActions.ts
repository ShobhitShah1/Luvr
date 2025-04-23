import { Contact } from 'react-native-contacts/type';
import UserService from '../../Services/AuthService';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { rootReducer, RootState } from '../Store/store';

export const SET_INCOGNITO_MODE = 'SET_INCOGNITO_MODE';
export const SET_CONTACTS = 'SET_CONTACTS';
export const SET_EMAILS = 'SET_EMAILS';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

interface SetIncognitoModeAction {
  type: typeof SET_INCOGNITO_MODE;
  payload: boolean;
}

interface SetContactsAction {
  type: typeof SET_CONTACTS;
  payload: Contact[];
}

interface SetEmailsAction {
  type: typeof SET_EMAILS;
  payload: EmailItem[];
}

interface SetLoadingAction {
  type: typeof SET_LOADING;
  payload: boolean;
}

interface SetErrorAction {
  type: typeof SET_ERROR;
  payload: string;
}

interface ClearErrorAction {
  type: typeof CLEAR_ERROR;
}

export interface EmailItem {
  id: string;
  email: string;
}

export type IncognitoActionTypes =
  | SetIncognitoModeAction
  | SetContactsAction
  | SetEmailsAction
  | SetLoadingAction
  | SetErrorAction
  | ClearErrorAction;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export type AppDispatch = ThunkDispatch<RootState, unknown, Action<string>>;

export const setIncognitoMode = (isEnabled: boolean): SetIncognitoModeAction => ({
  type: SET_INCOGNITO_MODE,
  payload: isEnabled,
});

export const setContacts = (contacts: Contact[]): SetContactsAction => ({
  type: SET_CONTACTS,
  payload: contacts,
});

export const setEmails = (emails: EmailItem[]): SetEmailsAction => ({
  type: SET_EMAILS,
  payload: emails,
});

export const setLoading = (isLoading: boolean): SetLoadingAction => ({
  type: SET_LOADING,
  payload: isLoading,
});

export const setError = (error: string): SetErrorAction => ({
  type: SET_ERROR,
  payload: error,
});

export const clearError = (): ClearErrorAction => ({
  type: CLEAR_ERROR,
});

export const toggleIncognitoModeCall = (isIncognitoEnabled: boolean): AppThunk => {
  return async (dispatch: AppDispatch) => {
    dispatch(clearError());

    const dataToSend = {
      eventName: 'incognito',
      mode: isIncognitoEnabled ? 1 : 0,
    };

    const response = await UserService.UserRegister(dataToSend);

    if (response?.code === 200) {
      dispatch(setIncognitoMode(isIncognitoEnabled));
    } else {
      dispatch(setError(response?.message || 'Failed to save contacts'));
    }
  };
};

export const saveContactsToApi = (contacts: Contact[]): AppThunk => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const phoneNumbers = contacts
        .filter((contact) => contact.phoneNumbers?.[0]?.number)
        .map((contact) => contact.phoneNumbers?.[0]?.number);

      const dataToSend = {
        eventName: 'incognito_mobile',
        incognito_mobile: phoneNumbers,
      };

      const response = await UserService.UserRegister(dataToSend);

      if (response?.code === 200) {
        dispatch(setContacts(contacts));
      } else {
        dispatch(setError(response?.message || 'Failed to save contacts'));
      }
    } catch (error: any) {
      dispatch(setError(error?.message || 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const saveEmailsToApi = (emails: EmailItem[]): AppThunk => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const emailAddresses = emails.map((item) => item.email);

      const dataToSend = {
        eventName: 'incognito_identity',
        incognito_identity: emailAddresses,
      };

      const response = await UserService.UserRegister(dataToSend);

      if (response?.code === 200) {
        dispatch(setEmails(emails));
      } else {
        dispatch(setError(response?.message || 'Failed to save emails'));
      }
    } catch (error: any) {
      dispatch(setError(error?.message || 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  };
};
