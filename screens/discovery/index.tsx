import React from "react"
import { View, Text, Pressable } from "react-native"
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context"

import * as SecureStore from "expo-secure-store"
import axios, { AxiosResponse } from "axios"

import { NativeStackScreenProps } from "@react-navigation/native-stack"

import { API_URL } from "@env"
import { StackParamList } from "../../interface/navigate"
import LocationCard from "../../components/Discovery/locationCard"

type Props = NativeStackScreenProps<StackParamList, "discovery">

const Discovery = ({ navigation }: Props) => {
    const insets = useSafeAreaInsets()

    const createTrip = async () => {
        try {
            console.log("createTrip")
            const token = await SecureStore.getItemAsync("key")
            const response: AxiosResponse<{ tripId: string }> =
                await axios.post(
                    `${API_URL}/trip`,
                    {},
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                )
            navigation.navigate("invitation", {
                tripId: response.data.tripId,
            })
        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data)
            }
        }
    }

    const handlePlaceInformation = (place) => {
        navigation.navigate("placeInformation", {
            placeId: place.placeId,
            type: place.type,
            forecastDate: place.forecastDate,
            forecastDuration: place.forecastDuration,
            from: "discovery",
        })
    }

    const mock = [
        { placeId: "P08000001", type: "ATTRACTION" },
        { placeId: "P03025435", type: "ATTRACTION" },
    ]

    return (
        <View>
            <View
                style={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                }}
                className="bg-[#FCF8EF] "
            >
                <View className="h-[156px] bg-[#FCF8EF] p-[16px]   flex-col gap-[16px]">
                    <Text className="leading-[60px] text-[40px] font-bold">
                        ไปเที่ยวกันเถอะ{" "}
                    </Text>
                    <Pressable onPress={createTrip}>
                        <View className="h-[48px] p-[12px] bg-[#FFC502] flex-row justify-center items-center rounded ">
                            <Text className="text-white text-[16px] font-bold ">
                                เริ่มจัดทริป
                            </Text>
                        </View>
                    </Pressable>
                </View>
            </View>

            <View className="p-[16px] bg-white h-[100%]">
                {mock.map((place) => {
                    return (
                        <View className="mt-[16px]" key={place.placeId}>
                            <Pressable
                                onPress={() => handlePlaceInformation(place)}
                            >
                                <LocationCard
                                    key={place.placeId}
                                    place={place}
                                />
                            </Pressable>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}

export default Discovery
