import React from "react";
import { Image, View, Text, Pressable } from "react-native";

import { PlanPlaceCardInput } from "../../interface/planSelect";

import MiniProfileCustom from "../miniProfile";

import RemoveCircle from "../../assets/placeCard/removeCircle.svg";

const PlanPlaceCard = ({
  name,
  location,
  coverImg,
  selectBy,
  distant,
  onPressRemove,
}: PlanPlaceCardInput) => {
  return (
    <View className="w-[328px] h-[124px] rounded-[5px] mt-[8px] border p-[7px] flex-col bg-white">
      <View className="flex-row">
        {/* coverImg */}
        <View className="flex justify-center items-center border w-[80px] rounded-[5px] h-[80px] overflow-hidden">
          <Image source={{ uri: coverImg[0] }} className="h-[80px] w-[100%]" />
        </View>
        {/* detail */}
        <View className="ml-[16px]">
          {/* name */}
          <View className=" flex-row justify-between w-[214px] h-[24px] items-center">
            <Text
              numberOfLines={1}
              className="text-[16px] font-bold w-[140px] "
            >
              {name}
            </Text>
            <Pressable onPress={onPressRemove}>
              <RemoveCircle />
            </Pressable>
          </View>

          {/* location */}
          <View className="flex-row mt-[16px] items-center ">
            <Text className="text-[#FFC502] text-[12px] font-bold">
              {location.district},{location.province}
            </Text>
          </View>
          {/* distant */}
          <View className="flex-row mt-[4px] items-center ">
            <Text className="text-[#FFC502] text-[12px] font-bold">
              {`ห่างออกไป ${distant.toFixed(2)} กม.`}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex-row mt-[8px] items-center">
        <Text className="text-[#FFC502] text-[12px] font-bold">เลือกโดย</Text>
        {selectBy.map((item) => (
          <MiniProfileCustom
            profileUrl={item.userprofile}
            username={item.username}
            key={item.username}
          />
        ))}
      </View>
    </View>
  );
};

export default PlanPlaceCard;
