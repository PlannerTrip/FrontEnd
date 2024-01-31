import { View, Text, Image, Pressable } from "react-native";

// ================= type =================
import { MemberData } from "../../interface/invitation";

// ================= svg =================
import Avatar from "../../assets/avatar.svg";
import PlusButton from "../../assets/invitation/PlusButton.svg";
import Close from "../../assets/invitation/Close.svg";
import HalfArrowRight from "../../assets/invitation/HalfArrowRight.svg";

import { REMOVEFRIEND } from "../../utils/const";

import { CalendarRange, RangeDatepicker } from "@ui-kitten/components";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@env";
import { AuthData } from "../../contexts/authContext";

const UserCard = ({
  data,
  ownerOfCard,
  ownerOfTrip,
  setConfirmModal,
  tripId,
}: {
  data: MemberData;
  ownerOfCard: boolean;
  ownerOfTrip: boolean;
  setConfirmModal: React.Dispatch<
    React.SetStateAction<{
      display: boolean;
      type: string;
      userId: string;
      name: string;
    }>
  >;
  tripId: string;
}) => {
  const { token } = useContext(AuthData);

  // ================= useState =================
  const [dateRange, setDateRange] = useState<CalendarRange<Date | null>[]>(
    data.date.map((date) => {
      return {
        endDate: date.end === "" ? null : new Date(date.end),
        startDate: date.start === "" ? null : new Date(date.start),
      };
    })
  );

  // ================= useEffect  =================

  useEffect(() => {
    // when data update update dateRange
    setDateRange(
      data.date.map((date) => {
        return {
          endDate: date.end === "" ? null : new Date(date.end),
          startDate: date.start === "" ? null : new Date(date.start),
        };
      })
    );
  }, [data]);

  // ================= function  =================
  const handleAddDatePicker = async () => {
    try {
      await axios.post(
        `${API_URL}/trip/dateMember`,
        {
          tripId,
          date: [...data.date, { start: "", end: "" }],
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveFriend = () => {
    setConfirmModal({
      display: true,
      type: REMOVEFRIEND,
      userId: data.userId,
      name: data.username,
    });
  };

  const onSelect = async (range: CalendarRange<Date | null>, index: number) => {
    try {
      const newDateRanges = [...dateRange];
      newDateRanges[index] = range;
      setDateRange(newDateRanges);
      if (range.endDate && range.startDate) {
        const changeDateFormat = newDateRanges.map((date) => {
          return {
            start: date.startDate ? date.startDate.toDateString() : "",
            end: date.endDate ? date.endDate.toDateString() : "",
          };
        });
        await axios.post(
          `${API_URL}/trip/dateMember`,
          {
            tripId,
            date: changeDateFormat,
          },
          {
            headers: {
              authorization: token,
            },
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onPressRemoveDatePicker = async (index: number) => {
    try {
      const newDate = [...data.date];
      newDate.splice(index, 1);
      await axios.post(
        `${API_URL}/trip/dateMember`,
        {
          tripId,
          date: newDate,
        },
        {
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
    <View className="w-[328px] bg-[#fff] p-[16px] flex-col rounded-[5px] mt-[16px] relative">
      {/* header */}
      <View className="flex-row items-center mb-[8px]">
        {data.profileUrl === "" ? (
          <Avatar />
        ) : (
          <Image
            className="w-[44px] h-[44px] rounded-full"
            source={{
              uri: data.profileUrl,
            }}
          />
        )}
        <Text className="ml-[8px] font-bold text-[16px]">{data.username}</Text>
      </View>
      {/* close button */}
      {ownerOfTrip && !ownerOfCard && (
        <Pressable
          className="absolute right-[7px] top-[7px]"
          onPress={handleRemoveFriend}
        >
          <View>
            <Close />
          </View>
        </Pressable>
      )}
      {/* date picker */}
      {dateRange.map((date, index) => (
        <View
          key={index}
          className="mt-[8px] flex-row justify-center items-center"
        >
          <RangeDatepicker
            range={date}
            onSelect={(range) => {
              onSelect(range, index);
            }}
            disabled={!ownerOfCard}
            style={{ width: 256 }}
            placeholder={() => (
              <View className="flex-row items-center">
                <Text className="text-[#00000040] w-[91px]">วันเริ่มต้น</Text>
                <HalfArrowRight />
                <Text className="text-[#00000040]">วันสุดท้าย</Text>
              </View>
            )}
          />
          {/* remove button */}
          {ownerOfCard && index !== 0 && (
            <Pressable
              className="absolute left-[280px]"
              onPress={() => {
                onPressRemoveDatePicker(index);
              }}
            >
              <Close />
            </Pressable>
          )}
        </View>
      ))}
      {/* add date picker button */}
      {ownerOfCard && (
        <View className="self-center mt-[8px]">
          <Pressable onPress={handleAddDatePicker}>
            <PlusButton />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default UserCard;
