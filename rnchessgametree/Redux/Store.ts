import { configureStore } from '@reduxjs/toolkit';
import { setNodes } from './nodesSlice';
import nodesReducer from './nodesSlice';
import settingsReducer from './settingsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ITreeNode from '../Interfaces/treeNode';

export const store =  configureStore({
  reducer: {
    nodes: nodesReducer,
    settings: settingsReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;