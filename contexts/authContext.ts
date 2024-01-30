import { createContext } from "react";

export const AuthData = createContext<{
  token: string;
  authStatus: string;
  setIsSignedIn: null | React.Dispatch<React.SetStateAction<Boolean>>;
  userId:string;
}>({
  token: "",
  authStatus: "",
  setIsSignedIn: null,
  userId:''
});