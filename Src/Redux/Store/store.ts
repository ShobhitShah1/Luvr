import { createStore, combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import userReducer from '../Reducer/userReducer';
import donationReducer from '../Reducer/donationReducer';
import membershipReducer from '../Reducer/membershipReducer';

const rootReducer = combineReducers({
  user: userReducer,
  donation: donationReducer,
  membership: membershipReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
