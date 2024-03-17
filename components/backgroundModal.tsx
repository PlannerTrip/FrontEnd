import React from "react";
import { View } from "react-native";

const BackgroundModal = ({ children }: { children: React.ReactNode }) => {
  return (
    <View className="absolute bg-[#0000008C] w-[100%] h-[100%] flex-col justify-center items-center ">
      {children}
    </View>
  );
};

export default BackgroundModal;
