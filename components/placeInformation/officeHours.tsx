import React from "react";
import { View, Text } from "react-native";
import Empty from "../../assets/empty.svg";
import { Time } from "@expo/html-elements";

type DayInfo = {
    _id: string;
    day: string;
    time: string;
};

type WeekSchedule = {
    _id: string;
    day1: DayInfo;
    day2: DayInfo;
    day3: DayInfo;
    day4: DayInfo;
    day5: DayInfo;
    day6: DayInfo;
    day7: DayInfo;
};

const OfficeHours = ({ data }: { data: WeekSchedule | undefined }) => {
    console.log("data", data);

    if (data) {
        if (data["day1"]) {
            return (
                <View className="mt-[8px]">
                    <View>
                        {Object.keys(data).map((dayKey) => {
                            const dayInfo = (data as any)[dayKey];
                            if (dayInfo.time) {
                                return (
                                    <View
                                        className="flex flex-row items-center mt-[4px]"
                                        key={dayKey}
                                    >
                                        <Text className="text-[16px] w-[100px]">
                                            {dayInfo.day}
                                        </Text>
                                        <Text className="text-[16px]">
                                            {dayInfo.time}{" "}
                                            {dayInfo.time ? "น." : ""}
                                        </Text>
                                    </View>
                                );
                            }
                        })}
                    </View>
                </View>
            );
        }
    }
    return (
        <View className="flex flex-row justify-center">
            <Empty />
        </View>
    );
};

export default OfficeHours;
