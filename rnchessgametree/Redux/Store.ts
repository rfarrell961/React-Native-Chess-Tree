import { configureStore } from '@reduxjs/toolkit';
import nodesReducer from './nodesSlice';
import settingsReducer from './settingsSlice';

export const store =  configureStore({
  reducer: {
    nodes: nodesReducer,
    settings: settingsReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;