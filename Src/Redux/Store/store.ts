import { createStore, combineReducers, Reducer, applyMiddleware } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import userReducer from '../Reducer/userReducer';
import donationReducer from '../Reducer/donationReducer';
import membershipReducer from '../Reducer/membershipReducer';
import incognitoReducer, { IncognitoState } from '../Reducer/IncognitoReducer';
import { thunk } from 'redux-thunk';

interface UserState {}
interface DonationState {}
interface MembershipState {}

export const rootReducer = combineReducers({
  user: userReducer,
  donation: donationReducer,
  membership: membershipReducer,
  incognito: incognitoReducer as Reducer<IncognitoState | undefined>,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };
