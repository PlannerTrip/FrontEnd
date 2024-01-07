import React, { useCallback, useState } from "react"
import { View, Text, Image } from "react-native"
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context"

// icon
import Arrow_left_brown from "../../assets/Arrow_left_brown.svg"
import AddTrip from "../../assets/AddTrip.svg"
import Bookmark from "../../assets/Bookmark.svg"
import Bookmarked from "../../assets/Bookmarked.svg"
import Map from "../../assets/Map.svg"
import Pin from "../../assets/Pin.svg"
import TelephoneActive from "../../assets/TelephoneActive.svg"
import WebsiteActive from "../../assets/WebsiteActive.svg"

import * as SecureStore from "expo-secure-store"
import { API_URL } from "@env"
import axios from "axios"
import { useFocusEffect } from "@react-navigation/native"

const PlaceInformation = () => {
    const insets = useSafeAreaInsets()
    console.log(insets)

    const marginTop = `mt-[-${insets.top}px]`
    const [placeName, setPlaceName] = useState("ชื่อสถานที่")

    const getPlaceInformation = async () => {
        try {
            const result = await SecureStore.getItemAsync("key")
            const response = await axios.get(`${API_URL}/place/information`, {
                headers: {
                    authorization: result,
                },
                params: {
                    placeId: "P03025435",
                    type: "ATTRACTION",
                },
            })
            console.log(response.data)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data)
            }
        }
    }

    useFocusEffect(
        useCallback(() => {
            getPlaceInformation()
        }, [])
    )

    return (
        <View
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }}
        >
            {/* <Text>PlaceInformation </Text> */}

            <View className={`absolute h-[332px] w-[100%] ${marginTop}`}>
                <Image
                    source={require("../../assets/MockPlacePicture.png")}
                    className="h-[100%] w-[100%]"
                />
            </View>

            <View className="px-[16px]">
                <Arrow_left_brown className="" />
                <Text>{placeName}</Text>
            </View>
        </View>
    )
}

export default PlaceInformation
