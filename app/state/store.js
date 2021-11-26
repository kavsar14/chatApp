import { createStore, combineReducers, applyMiddleware } from 'redux';
//import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import autoMerge from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as reducers from './ducks';
//import rootSaga from './sagas';

const rootReducer = combineReducers(reducers);

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: autoMerge, // redux-persist nested merge level
    whitelist: ['auth', 'chat'] // only navigation will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

//const sagaMiddleware = createSagaMiddleware();

const store = createStore(persistedReducer);

export const persistor = persistStore(store);

//sagaMiddleware.run(rootSaga);

export default store;