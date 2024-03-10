import { useState } from "react";
import { View, Text } from "react-native";

import { Plan } from "../../interface/tripSummary";

import TextTitle from "../tripCreate/TextTitle";
import PlanPlaceCard from "./planPlaceCard";

import { changeDateFormat } from "../../utils/function";

import PlanActivityCard from "./planActivityCard";
import DateTimePicker from "@react-native-community/datetimepicker";

import Empty from "../../assets/tripSummary/Empty.svg";

const PlanCard = ({ dailyPlan }: { dailyPlan: Plan }) => {
  const [plan, setPlan] = useState([
    ...dailyPlan.places.map((item) => ({
      id: item.placeId,
      startTime: item.startTime,
      endTime: item.endTime,
      type: "place",
      name: item.placeName,
      coverImg: item.covetImg,
      location: item.location,
      latitude: item.latitude,
      longitude: item.longitude,
    })),
    ...dailyPlan.activity.map((item) => ({
      id: item.activityId,
      startTime: item.startTime,
      endTime: item.endTime,
      type: "activity",
      name: item.name,
      coverImg: [],
      location: { address: "", district: "", province: "" },
      latitude: 0,
      longitude: 0,
    })),
  ]);
  return (
    <View className="w-[358px] p-[16px] bg-white mt-[16px]">
      {/* header */}
      <View className="flex-row items-center">
        <TextTitle title={`วันที่ ${dailyPlan.day}`} />
        <View className="ml-[8px]" />
        <TextTitle title={changeDateFormat(dailyPlan.date)} color="#FFC502" />
      </View>

      <DateTimePicker value={new Date()} mode="time" textColor="#FFC502" />

      {/* content */}
      {plan.length === 0 ? (
        <View className="mt-[16px] w-[326px] h-[92px] flex items-center">
          <Empty />

          <Text
            className={`text-[16px] leading-[24px]  mt-[8px] text-[#CCCCCC]`}
          >
            ไม่มีสถานที่
          </Text>
        </View>
      ) : (
        <>
          {plan.map((item) => {
            return (
              <View className="flex-row">
                {item?.type === "place" ? (
                  <PlanPlaceCard
                    key={item.id}
                    startTime={item.startTime}
                    endTime={item.endTime}
                    name={item.name}
                    distance={0}
                    location={item.location}
                    coverImg={item.coverImg}
                  />
                ) : (
                  item && <PlanActivityCard key={item.id} name={item.name} />
                )}
              </View>
            );
          })}
        </>
      )}
    </View>
  );
};

export default PlanCard;
