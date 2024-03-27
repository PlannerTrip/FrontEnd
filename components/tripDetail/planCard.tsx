import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";

import { PlaceCard, Plan } from "../../interface/tripSummary";

import TextTitle from "../tripCreate/TextTitle";
import PlanPlaceCard from "../tripSummary/planPlaceCard";

import { changeDateFormat, getCurrentLocation } from "../../utils/function";

import PlanActivityCard from "../tripSummary/planActivityCard";

import Empty from "../../assets/tripSummary/Empty.svg";
import Refresh from "../../assets/tripPlanner/Refresh_light.svg";
import RefreshBlack from "../../assets/tripPlanner/RefreshBlack.svg";
import Close from "../../assets/modal/closeCircle.svg";

import axios from "axios";
import { API_URL } from "@env";
import ConfirmModal from "../confirmModal";
import BackgroundModal from "../backgroundModal";

const PlanCard = ({
  prevPlaceStatus,
  currentPlace,
  index,
  dailyPlan,
  tripId,
  token,
  day,
  date,
  owner,
  setDisplayModalCheckInFail,
  setSuccessModal,
  setModalConfirmUndo,
}: {
  prevPlaceStatus: string;
  currentPlace: string;
  index: number;
  dailyPlan: PlaceCard[];
  tripId: string;
  token: string;
  day: number;
  date: string;
  owner: boolean;
  setDisplayModalCheckInFail: React.Dispatch<
    React.SetStateAction<{
      display: boolean;
      name: string;
    }>
  >;
  setSuccessModal: React.Dispatch<
    React.SetStateAction<{
      display: boolean;
      name: string;
    }>
  >;
  setModalConfirmUndo: React.Dispatch<
    React.SetStateAction<{
      display: boolean;
      prevPlace: string;
    }>
  >;
}) => {
  const onPressCheckIn = async (nextPlace: string, name: string) => {
    try {
      const currentLocation = await getCurrentLocation();
      if (currentLocation) {
        const currentLatitude = currentLocation.coords.latitude;
        const currentLongitude = currentLocation.coords.longitude;
        await axios.put(
          `${API_URL}/trip/checkIn`,
          {
            tripId,
            nextPlace,
            latitude: currentLatitude,
            longitude: currentLongitude,
          },
          { headers: { Authorization: token } },
        );
      }
      setSuccessModal({ display: true, name: name });
    } catch (err) {
      setDisplayModalCheckInFail({ display: true, name: name });
    }
  };

  const onPressSkip = async (nextPlace: string) => {
    try {
      await axios.put(
        `${API_URL}/trip/skip`,
        { tripId, nextPlace },
        { headers: { Authorization: token } },
      );
    } catch (err) {
      console.log(err);
    }
  };

  const onPressUndo = async () => {
    try {
      const index = dailyPlan.findIndex((item) => item.id === currentPlace);

      setModalConfirmUndo({
        display: true,
        prevPlace: dailyPlan[index].prevPlace ?? "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <View className="w-[358px] py-[16px] px-[8px] bg-white mt-[16px]">
        {/* header */}
        <View className="flex-row items-center">
          <TextTitle title={`วันที่ ${day}`} />
          <View className="ml-[8px]" />
          <TextTitle title={changeDateFormat(date)} color="#FFC502" />
          <View className="flex-row justify-end items-center grow">
            {prevPlaceStatus === "skip" &&
            dailyPlan.some((plan) => plan.id === currentPlace) ? (
              <RefreshBlack onPress={onPressUndo} />
            ) : (
              <Refresh />
            )}
          </View>
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
          <View className={` `}>
            {dailyPlan.map((item, index) => {
              return (
                <View
                  className={`${currentPlace === item.id ? "bg-[#FFF9E5] " : ""} p-[8px] rounded-[5px] flex-row`}
                  key={item.id}
                >
                  {/* <View>
                    <Text>{item.prevPlace}</Text>
                    <Text className="text-red-400">{item.id}</Text>
                    <Text>{item.nextPlace}</Text>
                  </View> */}
                  {/* time select */}
                  <View className="w-[40px] mr-[8px] h-[100px] opacity-1   ">
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
                  <View className="mt-[-16px]">
                    {item?.type === "place" ? (
                      <PlanPlaceCard
                        onPressCheckIn={() => {
                          onPressCheckIn(item.nextPlace ?? "", item.name);
                        }}
                        onPressSkip={() => {
                          onPressSkip(item.nextPlace ?? "");
                        }}
                        currentPlace={currentPlace === item.id}
                        firstPlace={item.firstPlace}
                        key={item.id}
                        startTime={item.startTime}
                        endTime={item.endTime}
                        name={item.name}
                        distance={item.distant}
                        location={item.location}
                        coverImg={item.coverImg}
                        latitude={item.latitude}
                        longitude={item.longitude}
                      />
                    ) : (
                      item && (
                        <PlanActivityCard key={item.id} name={item.name} />
                      )
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </>
  );
};

export default PlanCard;
