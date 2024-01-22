import { Text } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import * as SecureStore from "expo-secure-store";

import { useEffect, useState, createContext, useContext } from "react";

// =================== screen ===================
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Achievement from "./screens/achievement";
import Blog from "./screens/blog";
import Discovery from "./screens/discovery";
import Profile from "./screens/profile";
import TripPlanner from "./screens/tripPlanner";
import PlaceInformation from "./screens/placeInformation";
import Loading from "./screens/Loading";
import Invitation from "./screens/invitation";

// =================== type ===================
import { StackParamList } from "./interface/navigate";

// =================== Icon ===================

import UnActiveBlogIcon from "./assets/tabBar/blog.svg";
import ActiveBlogIcon from "./assets/tabBar/activeBlog.svg";
import UnActiveDiscovery from "./assets/tabBar/discovery.svg";
import ActiveDiscovery from "./assets/tabBar/activeDiscovery.svg";
import UnActiveProfile from "./assets/tabBar/profile.svg";
import ActiveProfile from "./assets/tabBar/activeProfile.svg";
import UnActiveTripPlanner from "./assets/tabBar/tripPlanner.svg";
import ActiveTripPlaner from "./assets/tabBar/activeTripPlanner.svg";

import { API_URL } from "@env";
import axios from "axios";

import * as Linking from "expo-linking";
import { Image } from "react-native";

import { FAIL, LOADING, SUCCESS } from "./utils/const";
import InviteVerify from "./screens/InviteVerify";

const Tab = () => {
  const BaseTab = createBottomTabNavigator<StackParamList>();
  return (
    <BaseTab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 100,
        },
        tabBarIconStyle: { marginTop: 14 },

        headerShown: false,
      }}
    >
      <BaseTab.Screen
        name="discovery"
        component={Discovery}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`text-[12px] ${
                focused
                  ? "text-[#FFC502] font-extrabold"
                  : "text-[#9898AA] font-normal"
              }`}
            >
              ไปเที่ยวกัน
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            focused ? <ActiveDiscovery /> : <UnActiveDiscovery />,
        }}
      />
      <BaseTab.Screen
        name="blog"
        component={Blog}
        options={({ route }) => ({
          tabBarLabel: ({ focused }) => (
            <Text
              className={`text-[12px] ${
                focused
                  ? "text-[#FFC502] font-extrabold"
                  : "text-[#9898AA] font-normal"
              }`}
            >
              บล็อก
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            focused ? <ActiveBlogIcon /> : <UnActiveBlogIcon />,
        })}
      />
      <BaseTab.Screen
        name="tripPlanner"
        component={TripPlanner}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`text-[12px] ${
                focused
                  ? "text-[#FFC502] font-extrabold"
                  : "text-[#9898AA] font-normal"
              }`}
            >
              ทริปของฉัน
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            focused ? <ActiveTripPlaner /> : <UnActiveTripPlanner />,
        }}
      />
      <BaseTab.Screen
        name="achievement"
        component={Achievement}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`text-[12px] ${
                focused
                  ? "text-[#FFC502] font-extrabold"
                  : "text-[#9898AA] font-normal"
              }`}
            >
              ภารกิจ
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image
                source={require("./assets/tabBar/activeAchievement.png")}
              />
            ) : (
              <Image source={require("./assets/tabBar/achievement.png")} />
            ),
        }}
      />
      <BaseTab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`text-[12px] ${
                focused
                  ? "text-[#FFC502] font-extrabold"
                  : "text-[#9898AA] font-normal"
              }`}
            >
              ข้อมูลผู้ใช้
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            focused ? <ActiveProfile /> : <UnActiveProfile />,
        }}
      />
    </BaseTab.Navigator>
  );
};

const prefix = Linking.createURL("/");

const AuthStatus = createContext("");

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

  const Stack = createNativeStackNavigator<StackParamList>();

  // =================== function ===================

  const authCheck = async () => {
    try {
      const token = await SecureStore.getItemAsync("key");
      await axios.get(`${API_URL}/authCheck`, {
        headers: {
          authorization: token,
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
    <AuthStatus.Provider value={authCheckStatus}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
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
              <Stack.Screen
                name="signIn"
                component={SignIn}
                initialParams={{ setIsSignedIn: setIsSignedIn }}
              />
              <Stack.Screen name="signUp" component={SignUp} />
            </>
          )}

          <Stack.Screen name="inviteVerify" component={InviteVerify} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthStatus.Provider>
  );
}

export const useAuthStatus = () => {
  const authCheckStatus = useContext(AuthStatus);
  if (authCheckStatus === null) {
    throw new Error("useAuthStatus must be used within an AuthStatusProvider");
  }
  return authCheckStatus;
};
