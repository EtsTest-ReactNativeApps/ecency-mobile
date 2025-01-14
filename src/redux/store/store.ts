import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import Reactotron from '../../../reactotron-config';

import reducer from '../reducers';

const transformCacheVoteMap = createTransform(
  (inboundState:any) => ({ ...inboundState, votes : Array.from(inboundState.votes)}),
  (outboundState) => ({ ...outboundState, votes:new Map(outboundState.votes)}),
  {whitelist:['cache']}
);

// Middleware: Redux Persist Config
const persistConfig = {
  // Root
  key: 'root',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Blacklist (Don't Save Specific Reducers)
  blacklist: ['nav', 'application', 'communities', 'user'],
  timeout: 0,
  transforms:[transformCacheVoteMap]
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, reducer);

const middleware = [thunk];

const enhancers = __DEV__
  ? compose(applyMiddleware(...middleware), Reactotron.createEnhancer())
  : applyMiddleware(...middleware);

const store = createStore(persistedReducer, enhancers);

const persistor = persistStore(store);

export { store, persistor };


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch