import React from "react";
import { View, Text, Pressable } from "react-native";

import MiniProfileCustom from "../miniProfile";

import RemoveCircle from "../../assets/placeCard/removeCircle.svg";

const ActivityCard = ({
  name,
  selectBy,
  onPressRemove,
}: {
  name: string;
  selectBy: { username: string; userprofile: string; userId: string }[];
  onPressRemove: () => void;
}) => {
  return (
    <View className="w-[328px] h-[64px] rounded-[5px] mt-[8px] border p-[7px] flex-col bg-white">
      {/* name */}
      <View className=" flex-row justify-between  h-[24px] items-center">
        <Text numberOfLines={1} className="text-[16px] font-bold w-[160px] ">
          {name}
        </Text>
        <Pressable onPress={onPressRemove}>
          <RemoveCircle />
        </Pressable>
      </View>
      <View className="flex-row mt-[4px] items-center">
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

export default ActivityCard;
