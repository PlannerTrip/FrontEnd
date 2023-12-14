import React from "react";
import { Text, View, Button } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type StackParamList = {
  Test: undefined;
  Test2: undefined;
};

type Props = NativeStackScreenProps<StackParamList, "Test2">;

const Test2 = ({ navigation }: Props) => {
  return (
    <View>
      <Text>test2</Text>
      <Button title="go to test" onPress={() => navigation.navigate("Test")} />
    </View>
  );
};

export default Test2;
