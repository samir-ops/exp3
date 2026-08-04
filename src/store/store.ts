import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice';
import draftsReducer from './draftsSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    drafts: draftsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
