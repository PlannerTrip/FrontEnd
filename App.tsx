import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import * as SecureStore from "expo-secure-store";

import { useEffect, useState } from "react";

// =================== screen ===================
import Test from "./screens/Test";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Home from "./screens/Home";

// =================== type ===================
import { StackParamList, TabParamList } from "./interface/navigate";

import { API_URL } from "@env";
import axios from "axios";
import SocketTab from "./screens/SocketTab";

const Tab = () => {
  const BaseTab = createBottomTabNavigator<TabParamList>();
  return (
    <BaseTab.Navigator screenOptions={{ headerShown: false }}>
      <BaseTab.Screen name="home" component={Home} />
      <BaseTab.Screen name="socket" component={SocketTab} />
    </BaseTab.Navigator>
  );
};

export default function App() {
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
    <NavigationContainer>
      <Stack.Navigator>
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
