import { User } from "./Types";

export const isAdmin = (user: User | undefined) =>
  user === undefined ||
  user.role === "admin";