import React from "react";
import { View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import LoadingCustom from "../components/loading";

const Loading = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className=" h-[100%] flex-1 justify-center items-center"
    >
      <LoadingCustom />
    </View>
  );
};

export default Loading;
