import { TradeGroup } from '@octoco/shared';

export interface ITradeGroupsSlice {
  tradeGroups: { [id: string]: TradeGroup };
}
