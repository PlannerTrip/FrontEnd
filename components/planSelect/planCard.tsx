import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Plan } from "../../interface/planSelect";
import { changeDateFormat } from "../../utils/function";

import Plus from "../../assets/placeSelect/plusNoCircle.svg";
import PlanPlaceCard from "./planPlaceCard";
import ActivityCard from "./activityCard";

import axios from "axios";

import { API_URL } from "@env";
import { AuthData } from "../../contexts/authContext";

const PlanCard = ({ plan, tripId }: { plan: Plan; tripId: string }) => {
  const { userId, token } = useContext(AuthData);

  const onPressRemove = async (id: string) => {
    try {
      await axios.delete(
        `${API_URL}/trip/plan`,

        {
          data: { id, tripId, day: plan.day },
          headers: {
            authorization: token,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View className="w-[358px] p-[16px] bg-white mt-[16px]">
      {/* header */}
      <View className="h-[24px] items-center flex-row justify-between ">
        <View className="flex-row items-center">
          <Text className="text-[16px] font-bold">{`วันที่ ${plan.day}`}</Text>
          <Text className="font-bold text-[#FFC502] text-[16px] ml-[8px]">
            {changeDateFormat(plan.date)}
          </Text>
        </View>
        <View className="h-[24px] w-[106px] rounded-full border-2 border-[#FFC502] flex-row px-[12px] justify-between items-center">
          <Plus />
          <Text className="text-[12px] text-[#FFC502]">เพิ่มกิจกรรม</Text>
        </View>
      </View>
      {/* content */}
      {plan.place.length === 0 && plan.activity.length === 0 ? (
        <View className="h-[24px] flex-row justify-center items-center mt-[16px]">
          <Text className="text-[16px] text-[#9898AA]">
            ลากสถานที่เข้ามาในช่อง
          </Text>
        </View>
      ) : (
        <View className="pt-[8px]">
          {plan.place.map((place) => (
            <PlanPlaceCard
              coverImg={place.coverImg}
              distant={place.distant}
              location={place.location}
              name={place.placeName}
              selectBy={place.selectBy}
              onPressRemove={() => {
                onPressRemove(place.placePlanId);
              }}
              key={place.placePlanId}
            />
          ))}
          {plan.activity.map((activity) => (
            <ActivityCard
              name={activity.name}
              key={activity.activityId}
              selectBy={activity.selectBy}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default PlanCard;
