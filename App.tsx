import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import * as SecureStore from "expo-secure-store";

import { useEffect, useState } from "react";

// =================== screen ===================
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Achievement from "./screens/achievement";
import Blog from "./screens/blog";
import Discovery from "./screens/discovery";
import Profile from "./screens/profile";
import TripPlaner from "./screens/tripPlanner";

// =================== type ===================
import { StackParamList, TabParamList } from "./interface/navigate";

// =================== Icon ===================

import BlogIcon from "./assets/tabBar/blog.svg";

import { API_URL } from "@env";
import axios from "axios";

import * as Linking from "expo-linking";
import { Image } from "react-native";
import { SvgUri } from "react-native-svg";

const Tab = () => {
  const BaseTab = createBottomTabNavigator<TabParamList>();
  return (
    <BaseTab.Navigator
      screenOptions={{ headerShown: false, tabBarActiveTintColor: "#FFC502" }}
    >
      <BaseTab.Screen
        name="discovery"
        component={Discovery}
        options={{
          tabBarLabel: "ไปเที่ยวกัน",
          tabBarIcon: ({ color, size }) => <View></View>,
        }}
      />
      <BaseTab.Screen
        name="blog"
        component={Blog}
        options={{
          tabBarLabel: "บล็อก",
          tabBarIcon: ({ color, size }) => <View></View>,
        }}
      />
      <BaseTab.Screen
        name="tripPlanner"
        component={TripPlaner}
        options={{
          tabBarLabel: "ทริปของฉัน",
          tabBarIcon: ({ color, size }) => <View></View>,
        }}
      />
      <BaseTab.Screen
        name="achievement"
        component={Achievement}
        options={{
          tabBarLabel: "ภารกิจ",
          tabBarIcon: ({ color, size }) => (
            <Image source={require("./assets/tabBar/achievement.png")} />
          ),
        }}
      />
      <BaseTab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarLabel: "ข้อมูลผู้ใช้",
          tabBarIcon: ({ color, size }) => <View></View>,
        }}
      />
    </BaseTab.Navigator>
  );
};

const prefix = Linking.createURL("/");

export default function App() {
  // =================== deepLink ===================
  const config = {
    screens: {
      tab: {
        screens: {
          home: "home/:sort?",
        },
      },
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
  const [isSignedIn, setIsSignedIn] = useState<Boolean>(true);

  const Stack = createNativeStackNavigator<StackParamList>();

  // =================== function ===================

  const authCheck = async () => {
    try {
      const result = await SecureStore.getItemAsync("key");
      const response = await axios.get(`${API_URL}/authCheck`, {
        headers: {
          authorization: result,
        },
      });
      setIsSignedIn(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data);
      }
    }
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <>
            <Stack.Screen name="tab" component={Tab} />
          </>
        ) : (
          <>
            <Stack.Screen name="signIn" component={SignIn} />
            <Stack.Screen name="signUp" component={SignUp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
