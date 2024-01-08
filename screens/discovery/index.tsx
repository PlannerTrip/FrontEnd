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

type Props = NativeStackScreenProps<StackParamList, "discovery">

const Discovery = ({ navigation }: Props) => {
    const insets = useSafeAreaInsets()

    const createTrip = async () => {
        try {
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
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data)
            }
        }
    }

    const handlePlaceInformation = () => {
        console.log("handlePlaceInformation")
        navigation.navigate("placeInformation", {
            placeId: "P03000001",
            type: "ATTRACTION",
            // forecastDate: "string",
            // forecastDuration: "string",
        })
    }

    return (
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

                <Pressable onPress={handlePlaceInformation}>
                    <View className="mt-[120px] h-[48px] p-[12px] bg-[#FFC502] flex-row justify-center items-center rounded ">
                        <Text className="text-white text-[16px] font-bold ">
                            info
                        </Text>
                    </View>
                </Pressable>
            </View>
        </View>
    )
}

export default Discovery
