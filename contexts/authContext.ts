import { createContext } from "react";

export const AuthData = createContext<{
  token: string;
  authStatus: string;
  setIsSignedIn: null | React.Dispatch<React.SetStateAction<Boolean>>;
  userId: string;
  setAuthInformation: null | React.Dispatch<
    React.SetStateAction<{ authStatus: string; token: string; userId: string }>
  >;
}>({
  token: "",
  authStatus: "",
  setIsSignedIn: null,
  userId: "",
  setAuthInformation: null,
});
