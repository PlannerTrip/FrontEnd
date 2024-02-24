import React from "react";
import { Image, View, Text } from "react-native";
import { PlaceCardInput } from "../../interface/planSelect";
import ForecastCustom from "../forecast";

function PlaceCard({
  name,
  forecast,
  location,
  tripId,
  coverImg,
}: PlaceCardInput) {
  return (
    <View className="w-[358px] h-[120px] rounded-[5px] border-[2px] p-[6px] flex-row bg-white">
      {/* coverImg */}
      <View className="flex justify-center items-center border w-[104px] rounded-[5px] h-[104px] overflow-hidden">
        <Image source={{ uri: coverImg[0] }} className="h-[104px] w-[100%]" />
      </View>
      {/* detail */}
      <View className="ml-[16px]">
        {/* name */}
        <View className=" flex-row justify-between h-[24px] items-center">
          <Text numberOfLines={1} className="text-[16px] font-bold w-[140px] ">
            {name}
          </Text>
        </View>
        {forecast.length !== 0 && (
          <View className="flex-row  mt-[8px] h-[50px]">
            {forecast.map((item) => (
              <View key={item.time} className="mr-[9px]">
                <ForecastCustom predict={item.data.cond} date={item.time} />
              </View>
            ))}
          </View>
        )}
        {/* location */}
        <View className="flex-row mt-[4px] items-center ">
          <Text className="text-[#FFC502] text-[12px]">
            {location.district},{location.province}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default PlaceCard;
