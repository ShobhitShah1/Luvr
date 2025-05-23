import type { Contact } from 'react-native-contacts/type';

import {
  SET_INCOGNITO_MODE,
  SET_CONTACTS,
  SET_EMAILS,
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
} from '../Action/IncognitoActions';
import type { IncognitoActionTypes, EmailItem } from '../Action/IncognitoActions';

export interface IncognitoState {
  isIncognitoEnabled: boolean;
  contacts: Contact[];
  emails: EmailItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IncognitoState = {
  isIncognitoEnabled: false,
  contacts: [],
  emails: [],
  isLoading: false,
  error: null,
};

const incognitoReducer = (state = initialState, action: IncognitoActionTypes): IncognitoState => {
  switch (action.type) {
    case SET_INCOGNITO_MODE:
      return {
        ...state,
        isIncognitoEnabled: action.payload,
      };

    case SET_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
      };

    case SET_EMAILS:
      return {
        ...state,
        emails: action.payload,
      };

    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default incognitoReducer;
