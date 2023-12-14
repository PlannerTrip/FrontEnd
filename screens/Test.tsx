import React from "react";
import { Button, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type StackParamList = {
  Test: undefined;
  Test2: undefined;
};

type Props = NativeStackScreenProps<StackParamList, "Test">;

const Test = ({ navigation }: Props) => {
  return (
    <View className=" bg-gray-400">
      <Text>test</Text>

      <Button
        title="go to test2"
        onPress={() => navigation.navigate("Test2")}
      />
    </View>
  );
};

export default Test;
