import React from "react";

import { View, Text, Image, Pressable } from "react-native";

import { PlaceCardInput } from "../../interface/placeSelect";

import RemoveCircle from "../../assets/placeCard/removeCircle.svg";
import PlusCircle from "../../assets/placeCard/AddCircle.svg";
import CorrectCircle from "../../assets/placeCard/correct.svg";

import ForecastCustom from "../forecast";
import MiniProfileCustom from "../miniProfile";

const PlaceCard = ({
  name,
  introduction,
  tag,
  forecast,
  location,
  selectBy = [],
  tripId,
  coverImg,
  onPressIcon,
  showIcon = true,
  showSelectBy = true,
  iconType = "mark",
}: PlaceCardInput) => {
  const Tag = ({ tagName }: { tagName: string }) => {
    return (
      <View className="border rounded-sm px-[4px] mt-[4px] py-[2px] mr-[4px]">
        <Text className="text-[12px]">{tagName}</Text>
      </View>
    );
  };

  return (
    <View className=" w-[358px] bg-white rounded-[5px] border-[2px] p-[8px]">
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
            {showIcon && (
              <Pressable onPress={onPressIcon}>
                {iconType === "mark" ? (
                  <RemoveCircle />
                ) : iconType === "plus" ? (
                  <PlusCircle />
                ) : iconType === "correct" ? (
                  <CorrectCircle />
                ) : (
                  <></>
                )}
              </Pressable>
            )}
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
          <View
            className={`flex-row flex-wrap ${
              introduction === "" ? "h-[78px]" : "h-[26px]"
            } overflow-hidden `}
          >
            {tag.map((tagName) => (
              <Tag tagName={tagName} key={tagName} />
            ))}
          </View>
          {/* location */}
          <View className="flex-row mt-[3px] items-center ">
            <Text className="text-[#FFC502] text-[12px] font-bold">
              {location.district},{location.province}
            </Text>
          </View>
        </View>
      </View>
      {/* forecast */}
      {forecast.length !== 0 && (
        <View className="flex-row  mt-[8px]">
          {forecast.map((item) => (
            <View key={item.time} className="mr-[37.25px]">
              <ForecastCustom predict={item.data.cond} date={item.time} />
            </View>
          ))}
        </View>
      )}
      {/* selectBy */}
      {showSelectBy && (
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
      )}
    </View>
  );
};

export default PlaceCard;
