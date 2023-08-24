import { configureStore } from '@reduxjs/toolkit';
import treesReducer from './treesSlice';

export const store =  configureStore({
  reducer: {
    trees: treesReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;