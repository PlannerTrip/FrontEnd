import React, { useState } from "react"
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

const PlaceInformation = () => {
    const insets = useSafeAreaInsets()
    console.log(insets)

    const marginTop = `mt-[-${insets.top}px]`
    const [placeName, setPlaceName] = useState("ชื่อสถานที่")
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
