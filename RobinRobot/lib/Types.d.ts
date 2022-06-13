// A common storage for the types used in the app

export type UserRole = "admin" | "customer";

export type ID = string;

export type User = {
  id: ID;
  name: string;
  email: string;
  role: UserRole;
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
