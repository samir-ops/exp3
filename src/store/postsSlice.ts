import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Post } from '../types';
import type { RootState } from './store';

// Normalized state using EntityAdapter
const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState(),
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      postsAdapter.addOne(state, action.payload);
    },
    removePost: (state, action: PayloadAction<string>) => {
      postsAdapter.removeOne(state, action.payload);
    }
  },
});

export const { addPost, removePost } = postsSlice.actions;

// Memoized Selectors (Exp 1.2.2)
export const {
  selectAll: selectAllPosts,
} = postsAdapter.getSelectors((state: RootState) => state.posts);

export const selectFilteredPosts = createSelector(
  [selectAllPosts, (_state: RootState, filter: string) => filter],
  (posts, filter) => {
    if (!filter) return posts;
    return posts.filter(post => post.content.toLowerCase().includes(filter.toLowerCase()));
  }
);

export default postsSlice.reducer;
