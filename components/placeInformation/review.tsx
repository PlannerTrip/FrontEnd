import React from "react"
import { View, Dimensions, Text } from "react-native"
import Profile from "../profile"
import Star from "./star"
import FlatListCustom from "../flatList"

const Review = ({
    name,
    profilePicture,
    score,
    date,
    text,
    picture = [""],
}: {
    name: string
    profilePicture?: string
    score: number
    date: Date
    text: string
    picture: string[]
}) => {
    const formattedDate = date.toLocaleDateString().split(" ")[0]
    const { width, height } = Dimensions.get("screen")
    console.log(picture)
    return (
        <View className="py-[16px] border-b-[0.5px] border-[#ABABB4] px-[8px]">
            <Profile name={name} profilePicture={profilePicture} />

            <View className="mt-[4px] flex flex-row items-center">
                <Star score={score} size="small" />
                <Text className="text-[#9898AA] ml-[10px] tex-[12px]">
                    {formattedDate}
                </Text>
            </View>

            <View className="mt-[4px]">
                <Text className="tex-[12px]">{text}</Text>
            </View>

            <View className="mt-[4px]">
                <FlatListCustom
                    item={picture}
                    height={200}
                    width={width - 16 - 32}
                    indicator={4}
                />
            </View>
        </View>
    )
}

export default Review
