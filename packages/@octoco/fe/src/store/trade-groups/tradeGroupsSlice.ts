import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TradeGroup } from '@octoco/models';
import { RootState } from '../store';
import { ITradeGroupsSlice } from './tradeGroupsSlice.contracts';

const initialState: ITradeGroupsSlice = {
  tradeGroups: {},
};

const tradeGroupsSlice = createSlice({
  name: 'tradeGroups',
  initialState,
  reducers: {
    addTradeGroups(
      state,
      action: PayloadAction<{ tradeGroups: TradeGroup[] }>
    ) {
      for (const tradeGroups of action.payload.tradeGroups) {
        state.tradeGroups[tradeGroups.id] = tradeGroups;
      }
    },
  },
});

export default tradeGroupsSlice.reducer;

export const { addTradeGroups } = tradeGroupsSlice.actions;

export const selectTradeGroups = (state: RootState) =>
  Object.values(state.tradeGroups.tradeGroups);
