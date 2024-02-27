import React from "react"
import { View, Text } from "react-native"

const PercentageBar = ({
    starText,
    percentage,
}: {
    starText: number
    percentage: number
}) => {
    return (
        <View className="flex flex-row items-center  ">
            <Text className="text-[12px]">{starText}</Text>
            <View className="h-[18px] flex flex-grow justify-center">
                <View className="bg-[#F5F5F5] h-[8px] rounded-[24px] ml-[4px]">
                    <View
                        style={[
                            {
                                width: `${percentage}%`,
                            },
                        ]}
                        className="bg-[#FFCC48] h-[8px] rounded-[24px]"
                    />
                </View>
            </View>
        </View>
    )
}

export default PercentageBar
