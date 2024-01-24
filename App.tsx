import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import * as SecureStore from "expo-secure-store";

import { useEffect, useState, createContext } from "react";

// =================== screen ===================
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import PlaceInformation from "./screens/placeInformation";
import Loading from "./screens/Loading";
import Invitation from "./screens/invitation";
import Tab from "./screens/tab";
import InviteVerify from "./screens/InviteVerify";

// =================== type ===================
import { StackParamList } from "./interface/navigate";

import { API_URL } from "@env";
import axios from "axios";

import * as Linking from "expo-linking";

import { FAIL, LOADING, SUCCESS } from "./utils/const";
import { AuthData } from "./contexts/authContext";

const prefix = Linking.createURL("/");

export default function App() {
  // =================== deepLink ===================
  const config = {
    screens: {
      inviteVerify: "inviteVerify/:inviteLink",
    },
  };

  const linking = {
    prefixes: [prefix],
    config,
  };

  // =================== useEffect ===================

  useEffect(() => {
    authCheck();
  }, []);

  // =================== useState ===================
  const [isSignedIn, setIsSignedIn] = useState<Boolean>(false);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [authCheckStatus, setAuthCheckStatus] = useState(LOADING);
  const [token, setToken] = useState("");

  const Stack = createNativeStackNavigator<StackParamList>();

  // =================== function ===================

  const authCheck = async () => {
    try {
      const localToken = await SecureStore.getItemAsync("key");
      if (!localToken) throw new Error("can't get token");
      setToken(localToken);
      await axios.get(`${API_URL}/authCheck`, {
        headers: {
          authorization: localToken,
        },
      });
      setAuthCheckStatus(SUCCESS);
      setIsSignedIn(true);
      setIsLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setAuthCheckStatus(FAIL);
        console.log(error.response.data);
      }
    }
  };

  return (
    <AuthData.Provider
      value={{
        authStatus: authCheckStatus,
        token: token,
        setIsSignedIn: setIsSignedIn,
      }}
    >
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          screenOptions={{ headerShown: false, animation: "none" }}
        >
          {isLoading ? (
            <Stack.Screen name="loading" component={Loading} />
          ) : isSignedIn ? (
            <>
              <Stack.Screen name="tab" component={Tab} />
              <Stack.Screen name="invitation" component={Invitation} />
              <Stack.Screen
                name="placeInformation"
                component={PlaceInformation}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="signIn" component={SignIn} />
              <Stack.Screen name="signUp" component={SignUp} />
            </>
          )}

          <Stack.Screen name="inviteVerify" component={InviteVerify} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthData.Provider>
  );
}
