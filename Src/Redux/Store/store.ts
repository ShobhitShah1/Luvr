import AsyncStorage from '@react-native-async-storage/async-storage';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import type { Reducer } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { thunk } from 'redux-thunk';

import type { BoostState } from '../../Types/Interface';
import boostModalReducer from '../Reducer/BoostModalReducer';
import type { BoostModalState } from '../Reducer/BoostModalReducer';
import boostReducer from '../Reducer/boostReducer';
import donationReducer from '../Reducer/donationReducer';
import incognitoReducer from '../Reducer/IncognitoReducer';
import type { IncognitoState } from '../Reducer/IncognitoReducer';
import membershipReducer from '../Reducer/membershipReducer';
import userReducer from '../Reducer/userReducer';

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
