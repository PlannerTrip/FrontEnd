import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";

import { PlaceCard, Plan } from "../../interface/tripSummary";

import TextTitle from "../tripCreate/TextTitle";
import PlanPlaceCard from "./planPlaceCard";

import { changeDateFormat } from "../../utils/function";

import PlanActivityCard from "./planActivityCard";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import Empty from "../../assets/tripSummary/Empty.svg";

import axios from "axios";
import { API_URL } from "@env";

const PlanCard = ({
  dailyPlan,
  tripId,
  token,
  day,
  date,
}: {
  dailyPlan: PlaceCard[];
  tripId: string;
  token: string;
  day: number;
  date: string;
}) => {
  const today = new Date();

  // ===================== function =====================
  const handleChangeTime = async (
    type: string,
    id: string,
    event: DateTimePickerEvent,
    date?: Date
  ) => {
    try {
      if (date) {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const formattedTime = `${hours}:${minutes}`;

        await axios.put(
          `${API_URL}/trip/planTime`,
          { tripId, id, type, time: formattedTime },
          { headers: { Authorization: token } }
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);

    const dateWithTime =
      time === ""
        ? new Date()
        : new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            hours,
            minutes
          );
    return dateWithTime;
  };

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
          {dailyPlan.map((item) => {
            return (
              <View className="flex-row">
                {/* time select */}
                <View className="w-[40px] mr-[8px] h-[100px] opacity-1  mt-[16px] ">
                  <Pressable onPress={() => {}}>
                    <Text
                      className={`${
                        item.startTime === "" ? "text-[#D9D9D9]" : ""
                      } absolute text-[12px] leading-[18px] font-bold`}
                    >
                      {item.startTime === "" ? "00:00" : item.startTime}
                    </Text>
                  </Pressable>
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
                  <View className="opacity-0">
                    <DateTimePicker
                      value={formatTime(item.startTime)}
                      mode="time"
                      onChange={(event: DateTimePickerEvent, date?: Date) => {
                        handleChangeTime("startTime", item.id, event, date);
                      }}
                    />

                    <DateTimePicker
                      value={formatTime(item.endTime)}
                      mode="time"
                      onChange={(event: DateTimePickerEvent, date?: Date) => {
                        handleChangeTime("endTime", item.id, event, date);
                      }}
                    />
                  </View>
                </View>
                {/* place and activity */}
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
        </View>
      )}
    </View>
  );
};

export default PlanCard;