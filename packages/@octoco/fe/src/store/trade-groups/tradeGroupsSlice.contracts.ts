import { TradeGroup } from '@octoco/models';

export interface ITradeGroupsSlice {
  tradeGroups: { [id: string]: TradeGroup };
}
