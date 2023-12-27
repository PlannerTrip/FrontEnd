import React from "react";
import { Button, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated from "react-native-reanimated";
import { useSharedValue } from "react-native-reanimated";

type StackParamList = {
  Test: undefined;
  Test2: undefined;
};

type Props = NativeStackScreenProps<StackParamList, "Test">;

const Test = ({ navigation }: Props) => {
  const width = useSharedValue(100);

  const handlePress = () => {
    width.value = width.value + 50;
  };

  return (
    <View className=" bg-gray-400 ">
      <Text>test</Text>
      <Animated.View
        style={{
          width,
          height: 100,
          backgroundColor: "violet",
        }}
      />
      <Button onPress={handlePress} title="Click me" />
      <Button
        title="go to test2"
        onPress={() => navigation.navigate("Test2")}
      />
    </View>
  );
};

export default Test;
