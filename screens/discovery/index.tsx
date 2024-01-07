import React from "react"
import { View, Text, Pressable } from "react-native"
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context"

const Discovery = () => {
    const insets = useSafeAreaInsets()

    const handlePlaceInformation = () => {
        console.log("handlePlaceInformation")
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
                <Pressable>
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
