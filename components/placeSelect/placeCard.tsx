import React from "react";

import { View, Text, Image } from "react-native";

import { PlaceCardInput } from "../../interface/placeSelect";

import RemoveCircle from "../../assets/placeCard/removeCircle.svg";

const PlaceCard = ({
  name,
  introduction,
  tag,
  forecast,
  location,
  selectBy,
  tripId,
  coverImg,
}: PlaceCardInput) => {
  const Tag = ({ tagName }: { tagName: string }) => {
    return (
      <View className="border rounded-sm px-[4px] mt-[4px] py-[2px] mr-[4px]">
        <Text className="text-[12px]">{tagName}</Text>
      </View>
    );
  };

  return (
    <View className="mb-[16px] w-[358px] h-[230px] bg-white rounded-[5px] border-[2px] p-[8px]">
      <View className="flex-row">
        {/* cover img */}
        <View className="flex justify-center items-center overflow-hidden border w-[128px] h-[128px] rounded-[5px] mr-[16px]">
          <Image source={{ uri: coverImg[0] }} className="h-[128px] w-[100%]" />
        </View>
        {/* detail */}
        <View className="w-[196px] ">
          <View className=" flex-row justify-between h-[24px] items-center">
            <Text
              numberOfLines={1}
              className="text-[16px] font-bold w-[140px] "
            >
              {name}
            </Text>
            <RemoveCircle />
          </View>
          {/* introduction */}
          {introduction !== "" && (
            <View className="mt-[3px] h-[54px]">
              <Text numberOfLines={3} className="text-[12px]">
                {introduction}
              </Text>
            </View>
          )}
          {/* tag */}
          <View className="flex-row flex-wrap h-[78px] overflow-hidden ">
            {tag.map((tagName) => (
              <Tag tagName={tagName} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default PlaceCard;
