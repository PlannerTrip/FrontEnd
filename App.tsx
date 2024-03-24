import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import * as SecureStore from "expo-secure-store";

import { useEffect, useState, createContext } from "react";

// =================== screen ===================

import PlaceInformation from "./screens/placeInformation";
import Loading from "./screens/Loading";
import Invitation from "./screens/invitation";
import Tab from "./screens/tab";
import InviteVerify from "./screens/InviteVerify";
import Welcome from "./screens/Welcome";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Forgot from "./screens/Forgot";
import WriteReview from "./screens/writeReview";
import PlaceSelect from "./screens/placeSelect";
import PlaceDiscovery from "./screens/placeDiscovery";
import WriteBlog from "./screens/writeBlog";
import BlogInformation from "./screens/blogInformation";
import MyTrip from "./screens/profile/myTrip";
import MyBookmark from "./screens/profile/myBookmark";
import MyBlog from "./screens/profile/myBlog";
import MyLikeBlog from "./screens/profile/myLikeBlog";
import EditInformation from "./screens/profile/editInformation";
import ChangePassword from "./screens/profile/changePassword";
import Suggest from "./screens/profile/suggest";

// =================== type ===================
import { StackParamList } from "./interface/navigate";

import { API_URL } from "@env";
import axios from "axios";

import * as Linking from "expo-linking";

import { FAIL, LOADING, SUCCESS } from "./utils/const";

import { AuthData } from "./contexts/authContext";

import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
} from "@ui-kitten/components";

import PlanSelect from "./screens/planSelect";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TripSummary from "./screens/tripSummary";

import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { default as mapping } from "./mapping.json"; // <-- import mapping
import { default as theme } from "./theme.json"; // <-- import mapping
import TripMember from "./screens/tripMember";

const prefix = Linking.createURL("/");

export default function App() {
  console.log(prefix);
  // =================== deepLink ===================
  const config = {
    screens: {
      inviteVerify: "inviteVerify/:inviteLink",
      forgot: "forgot/:forgotCode",
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
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  const [authInformation, setAuthInformation] = useState({
    authStatus: LOADING,
    token: "",
    userId: "",
  });

  const [isSignedIn, setIsSignedIn] = useState<Boolean>(false);

  const Stack = createNativeStackNavigator<StackParamList>();

  // =================== function ===================

  const authCheck = async () => {
    try {
      const localToken = await SecureStore.getItemAsync("key");
      if (!localToken) throw new Error("can't get token");
      const response = await axios.get(`${API_URL}/authCheck`, {
        headers: {
          authorization: localToken,
        },
      });
      console.log("authCheck");
      setAuthInformation({
        authStatus: SUCCESS,
        token: localToken,
        userId: response.data.userId,
      });
      setIsSignedIn(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setAuthInformation({
        authStatus: FAIL,
        token: "",
        userId: "",
      });
      // if (axios.isAxiosError(error) && error.response) {
      //   setAuthInformation({
      //     authStatus: FAIL,
      //     token: "",
      //     userId: "",
      //   });
      //   console.log(error.response.data);
      // }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApplicationProvider
        {...eva}
        theme={{ ...eva.light, ...theme }}
        customMapping={mapping}
      >
        <AuthData.Provider
          value={{
            ...authInformation,
            setIsSignedIn: setIsSignedIn,
            setAuthInformation: setAuthInformation,
          }}
        >
          <IconRegistry icons={EvaIconsPack} />
          <NavigationContainer linking={linking}>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                animation: "none",
              }}
            >
              {isLoading ? (
                <Stack.Screen name="loading" component={Loading} />
              ) : isSignedIn ? (
                <>
                  <Stack.Screen name="tab" component={Tab} />
                  <Stack.Screen name="invitation" component={Invitation} />
                  <Stack.Screen name="placeSelect" component={PlaceSelect} />
                  <Stack.Screen
                    name="placeInformation"
                    component={PlaceInformation}
                  />
                  <Stack.Screen
                    name="placeDiscovery"
                    component={PlaceDiscovery}
                  />
                  <Stack.Screen name="planSelect" component={PlanSelect} />
                  <Stack.Screen name="writeReview" component={WriteReview} />
                  <Stack.Screen name="tripSummary" component={TripSummary} />
                  <Stack.Screen name="tripMember" component={TripMember} />
                  <Stack.Screen name="writeBlog" component={WriteBlog} />
                  <Stack.Screen
                    name="blogInformation"
                    component={BlogInformation}
                  />
                  {/* profile */}
                  <Stack.Screen name="myTrip" component={MyTrip} />
                  <Stack.Screen name="myBookmark" component={MyBookmark} />
                  <Stack.Screen name="myBlog" component={MyBlog} />
                  <Stack.Screen name="myLikeBlog" component={MyLikeBlog} />
                  <Stack.Screen
                    name="editInformation"
                    component={EditInformation}
                  />
                  <Stack.Screen
                    name="changePassword"
                    component={ChangePassword}
                  />
                  <Stack.Screen name="suggest" component={Suggest} />
                </>
              ) : (
                <>
                  <Stack.Screen name="welcome" component={Welcome} />
                  <Stack.Screen name="signIn" component={SignIn} />
                  <Stack.Screen name="signUp" component={SignUp} />
                  <Stack.Screen name="forgot" component={Forgot} />
                </>
              )}

              <Stack.Screen name="inviteVerify" component={InviteVerify} />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthData.Provider>
      </ApplicationProvider>
    </GestureHandlerRootView>
  );
}
