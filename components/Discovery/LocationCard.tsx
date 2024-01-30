import { useState, useCallback } from "react"
import { View, Text, Image, Dimensions } from "react-native"
import { useFocusEffect } from "@react-navigation/native"

import React from "react"

import * as SecureStore from "expo-secure-store"
import { API_URL } from "@env"
import axios from "axios"

const LocationCard = ({ place }: { place: any }) => {
    const [data, setData] = useState({
        placeName: "",
        coverImg: [],
        introduction: "",
        location: {
            address: "",
            district: "",
            province: "",
        },
        type: "",
        tag: [],
    })

    const { width, height } = Dimensions.get("screen")
    const widthTruncate = `w-[${width - 2 * 16 - 2 * 8 - 16 - 128}px]`

    // =============== axios ===============
    const getPlaceInformation = async () => {
        try {
            const result = await SecureStore.getItemAsync("key")
            const response = await axios.get(`${API_URL}/place/information`, {
                headers: {
                    authorization: result,
                },
                params: {
                    placeId: place.placeId,
                    type: place.type,
                    forecastDate: place.forecastDate,
                    forecastDuration: place.forecastDuration,
                },
            })

            setData(response.data)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data)
            }
        }
    }

    // =============== useFocusEffect ===============
    useFocusEffect(
        useCallback(() => {
            getPlaceInformation()
        }, [])
    )

    return (
        <View className="h-[144px] w-[100%] p-[8px] bg-[#FFFFFF] flex flex-row ">
            <View
                className={`w-[128px] h-[128px] rounded-[5px] overflow-hidden border-[1px] border-[#54400E]`}
            >
                <Image
                    source={{
                        uri: data.coverImg[0],
                    }}
                    className="w-[100%] h-[100%]"
                />
            </View>

            <View className="ml-[16px] ">
                <Text
                    className={`text-[16px]  leading-[24px] truncate  font-bold ${widthTruncate} `}
                    numberOfLines={1}
                >
                    {data.placeName}
                </Text>

                <Text
                    className={`text-[16px] leading-[24px] truncate  mt-[8px] ${widthTruncate}`}
                    numberOfLines={2}
                >
                    {data.introduction}
                </Text>

                <View className="mt-[4px] ">
                    {data.tag.map((tag, index) => {
                        return (
                            <View className="self-start px-[4px]  py-[2px]  border border-[#54400E] rounded-[2px] justify-center">
                                <Text className="text-[12px] leading-[16px] text-[#54400E]">
                                    {tag}
                                </Text>
                            </View>
                        )
                    })}
                </View>

                <View className="mt-[4px] flex flex-row justify-between">
                    <Text className="text-[12px] font-bold text-[#FFC502]">
                        {data.location.district}, {data.location.province}
                    </Text>
                    <Text className="text-[12px] font-bold text-[#FFC502]">
                        10.00 กม.
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default LocationCard