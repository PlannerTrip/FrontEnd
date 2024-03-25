import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";

import { PlaceCard, Plan } from "../../interface/tripSummary";

import TextTitle from "../tripCreate/TextTitle";
import PlanPlaceCard from "../tripSummary/planPlaceCard";

import { changeDateFormat } from "../../utils/function";

import PlanActivityCard from "../tripSummary/planActivityCard";

import Empty from "../../assets/tripSummary/Empty.svg";

const PlanCard = ({
  currentPlace,
  index,
  dailyPlan,
  tripId,
  token,
  day,
  date,
  owner,
}: {
  currentPlace: string;
  index: number;
  dailyPlan: PlaceCard[];
  tripId: string;
  token: string;
  day: number;
  date: string;
  owner: boolean;
}) => {
  return (
    <View className="w-[358px] p-[16px] bg-white mt-[16px]">
      {/* header */}
      <View className="flex-row items-center">
        <TextTitle title={`วันที่ ${day}`} />
        <View className="ml-[8px]" />
        <TextTitle title={changeDateFormat(date)} color="#FFC502" />
      </View>

      {/* content */}
      {dailyPlan.length === 0 ? (
        <View className="mt-[16px] w-[326px] h-[92px] flex items-center">
          <Empty />

          <Text
            className={`text-[16px] leading-[24px]  mt-[8px] text-[#CCCCCC]`}
          >
            ไม่มีสถานที่
          </Text>
        </View>
      ) : (
        <View>
          {dailyPlan.map((item, index) => {
            return (
              <View className="flex-row" key={item.id}>
                {/* time select */}
                <View className="w-[40px] mr-[8px] h-[100px] opacity-1  mt-[16px] ">
                  <Text
                    className={`${
                      item.startTime === "" ? "text-[#D9D9D9]" : ""
                    } absolute text-[12px] leading-[18px] font-bold`}
                  >
                    {item.startTime === "" ? "00:00" : item.startTime}
                  </Text>
                  <Text
                    className={`top-[20px] absolute text-[12px] leading-[18px] font-bold ${
                      item.startTime === "" || item.endTime === ""
                        ? "text-[#D9D9D9]"
                        : ""
                    }`}
                  >
                    -
                  </Text>
                  <Text
                    className={`${
                      item.endTime === "" ? "text-[#D9D9D9]" : ""
                    } absolute top-[40px] text-[12px] leading-[18px] font-bold`}
                  >
                    {item.endTime === "" ? "00:00" : item.endTime}
                  </Text>
                </View>
                {/* place and activity */}
                {item?.type === "place" ? (
                  <PlanPlaceCard
                    currentPlace={currentPlace === item.id}
                    firstPlace={item.firstPlace}
                    key={item.id}
                    startTime={item.startTime}
                    endTime={item.endTime}
                    name={item.name}
                    distance={item.distant}
                    location={item.location}
                    coverImg={item.coverImg}
                  />
                ) : (
                  item && <PlanActivityCard key={item.id} name={item.name} />
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default PlanCard;
