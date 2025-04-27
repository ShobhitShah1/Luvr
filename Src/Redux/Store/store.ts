import AsyncStorage from '@react-native-async-storage/async-storage';
import { applyMiddleware, combineReducers, createStore, Reducer } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';

import { thunk } from 'redux-thunk';
import boostModalReducer, { BoostModalState } from '../Reducer/BoostModalReducer';
import donationReducer from '../Reducer/donationReducer';
import incognitoReducer, { IncognitoState } from '../Reducer/IncognitoReducer';
import membershipReducer from '../Reducer/membershipReducer';
import userReducer from '../Reducer/userReducer';
import boostReducer from '../Reducer/boostReducer';
import { BoostState } from '../../Types/Interface';

interface UserState {}
interface DonationState {}
interface MembershipState {}

export const rootReducer = combineReducers({
  user: userReducer,
  donation: donationReducer,
  membership: membershipReducer,
  incognito: incognitoReducer as Reducer<IncognitoState | undefined>,
  boostModal: boostModalReducer as Reducer<BoostModalState | undefined>,
  boost: boostReducer as Reducer<BoostState | undefined>,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { persistor, store };
