import React from "react"
import { View, Text } from "react-native"
import Empty from "../../assets/empty.svg"

type DayInfo = {
    _id: string
    day: string
    time: string
}

type WeekSchedule = {
    _id: string
    day1: DayInfo
    day2: DayInfo
    day3: DayInfo
    day4: DayInfo
    day5: DayInfo
    day6: DayInfo
    day7: DayInfo
}

const OfficeHours = ({ data }: { data: WeekSchedule }) => {
    console.log("data", data)
    return (
        <View className="mt-[8px] mb-[16px]">
            {data["day1"] ? (
                <View>
                    {Object.keys(data).map((dayKey) => {
                        const dayInfo = (data as any)[dayKey]

                        return (
                            <View
                                className="flex flex-row items-center mt-[4px]"
                                key={dayKey}
                            >
                                <Text className="text-[16px] w-[100px]">
                                    {dayInfo.day}
                                </Text>
                                <Text className="text-[16px]">
                                    {dayInfo.time} {dayInfo.time ? "น." : ""}
                                </Text>
                            </View>
                        )
                    })}
                </View>
            ) : (
                <View className="flex flex-row justify-center">
                    <Empty />
                </View>
            )}
        </View>
    )
}

export default OfficeHours
