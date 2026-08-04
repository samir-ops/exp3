import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Draft } from '../types';
import type { RootState } from './store';

// Normalized state using EntityAdapter
const draftsAdapter = createEntityAdapter<Draft>({
  sortComparer: (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
});

const draftsSlice = createSlice({
  name: 'drafts',
  initialState: draftsAdapter.getInitialState(),
  reducers: {
    saveDraft: (state, action: PayloadAction<Draft>) => {
      draftsAdapter.upsertOne(state, action.payload);
      // Simulating Exp 1.1.2 requirement: persist drafts
      localStorage.setItem('saved_drafts', JSON.stringify(state.entities));
    },
    removeDraft: (state, action: PayloadAction<string>) => {
      draftsAdapter.removeOne(state, action.payload);
      localStorage.setItem('saved_drafts', JSON.stringify(state.entities));
    },
    loadDrafts: (state, action: PayloadAction<Draft[]>) => {
      draftsAdapter.setAll(state, action.payload);
    }
  },
});

export const { saveDraft, removeDraft, loadDrafts } = draftsSlice.actions;

// Memoized Selectors (Exp 1.2.2)
export const {
  selectAll: selectAllDrafts,
} = draftsAdapter.getSelectors((state: RootState) => state.drafts);

export const selectDraftsByPlatform = createSelector(
  [selectAllDrafts, (_state: RootState, platform: string) => platform],
  (drafts, platform) => {
    if (platform === 'all') return drafts;
    return drafts.filter(draft => draft.platforms.includes(platform));
  }
);

export default draftsSlice.reducer;
