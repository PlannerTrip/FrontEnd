import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Test from "./screens/Test";
import Test2 from "./screens/Test2";

type StackParamList = {
  Test: undefined;
  Test2: undefined;
};

export default function App() {
  const Stack = createNativeStackNavigator<StackParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Test2">
        <Stack.Screen name="Test" component={Test} />
        <Stack.Screen name="Test2" component={Test2} />
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
