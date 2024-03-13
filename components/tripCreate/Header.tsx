import React from "react";
import { Pressable, View, Text } from "react-native";

import ArrowLeft from "../../assets/invitation/Arrow_left.svg";

const Header = ({
  onPressBack,
  title,
}: {
  onPressBack: () => void;
  title: string;
}) => {
  return (
    <View className="h-[80px] p-[16px] bg-[#FFF]  flex-row items-end ">
      <Pressable onPress={onPressBack}>
        <ArrowLeft />
      </Pressable>
      <Text className="text-[24px] font-bold h-[40px] ml-[8px]">{title}</Text>
    </View>
  );
};

export default Header;
