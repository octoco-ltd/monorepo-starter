import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GridOperator } from '@octoco/models';
import { RootState } from '../store';
import { IGridOperatorSlice } from './gridOperatorSlice.contracts';

const initialState: IGridOperatorSlice = {
  gridOperators: {},
};

const gridOperatorSlice = createSlice({
  name: 'gridOperator',
  initialState,
  reducers: {
    addGridOperators(
      state,
      action: PayloadAction<{ gridOperators: GridOperator[] }>
    ) {
      for (const gridOperator of action.payload.gridOperators) {
        state.gridOperators[gridOperator.id] = gridOperator;
      }
    },
  },
});

export default gridOperatorSlice.reducer;

export const { addGridOperators } = gridOperatorSlice.actions;

export const selectGridOperators = (state: RootState) =>
  Object.values(state.gridOperator.gridOperators);
