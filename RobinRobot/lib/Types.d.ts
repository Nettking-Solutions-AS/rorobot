// A common storage for the types used in the app

export type UserRole = "admin" | "customer";

export type ID = string;

export type User = {
  id: ID;
  name: string;
  email: string;
  role: UserRole;
  APIKey: string;
  APISecret: string;
};

export type GlobalState = {
  currentUser?: User;
};

export type DispatchAction = "SET_STATE" | "SET_CURRENT_USER";

export type DispatchObject = {
  type: DispatchAction;
  payload: any;
};

export type Error = {
  type: string;
  message: string;
};

export interface Network {
  network: string;
  coin: string;
  withdrawIntegerMultiple: string;
  isDefault: boolean;
  depositEnable: boolean;
  withdrawEnable: boolean;
  depositDesc: string;
  withdrawDesc: string;
  specialTips: string;
  specialWithdrawTips: string;
  name: string;
  resetAddressStatus: boolean;
  addressRegex: string;
  addressRule: string;
  memoRegex: string;
  withdrawFee: string;
  withdrawMin: string;
  withdrawMax: string;
  minConfirm: number;
  unLockConfirm: number;
  sameAddress: boolean;
  estimatedArrivalTime: number;
}

export interface Coin {
  coin: string;
  depositAllEnable: boolean;
  withdrawAllEnable: boolean;
  name: string;
  free: string;
  locked: string;
  freeze: string;
  withdrawing: string;
  ipoing: string;
  ipoable: string;
  storage: string;
  isLegalMoney: boolean;
  trading: boolean;
  networkList: Network[];
}

export interface Stat {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}
