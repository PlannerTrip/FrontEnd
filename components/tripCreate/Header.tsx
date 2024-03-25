import React from "react";
import { Pressable, View, Text } from "react-native";

import ArrowLeft from "../../assets/invitation/Arrow_left.svg";
import TextTitle from "./TextTitle";
import { StyleSheet } from "react-native";

const Header = ({
  onPressBack,
  title,
  totalPlaceSelect = 0,
  showTotal = false,
}: {
  onPressBack: () => void;
  title: string;
  totalPlaceSelect?: number;
  showTotal?: boolean;
}) => {
  return (
    <>
      <View className="h-[80px] p-[16px] bg-[#FFF]  flex-row items-end ">
        <Pressable onPress={onPressBack}>
          <ArrowLeft />
        </Pressable>
        <Text className="text-[24px] font-bold h-[40px] ml-[8px]">{title}</Text>
        {showTotal && totalPlaceSelect > 0 && (
          <View className="grow flex items-end justify-end">
            <View className="bg-[#FFC502] h-[40px] w-[40px] rounded-full flex justify-center items-center">
              <TextTitle title={`${totalPlaceSelect}`} color="#FFFFFF" />
            </View>
          </View>
        )}
      </View>
    </>
  );
};

export default Header;
