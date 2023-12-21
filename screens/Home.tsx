import React, { useCallback, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { TabParamList } from "../interface/navigate";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<TabParamList, "home">;

const Home = ({ route, navigation }: Props) => {
  useEffect(() => {
    setSortValue(route.params ? route.params.sort : "");
  }, [route]);

  const [sortValue, setSortValue] = useState(
    route.params ? route.params.sort : ""
  );
  return (
    <View>
      <Text>{sortValue}</Text>
    </View>
  );
};

export default Home;
