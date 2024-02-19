import React, { useCallback, useState } from "react"
import {
    View,
    Text,
    Image,
    Pressable,
    Dimensions,
    FlatList,
    ScrollView,
} from "react-native"
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context"

// icon
import Arrow_left_brown from "../../assets/Arrow_left_brown.svg"
import AddTrip from "../../assets/placeInformation/AddTrip.svg"
import Bookmark from "../../assets/placeInformation/Bookmark.svg"
import Bookmarked from "../../assets/placeInformation/Bookmarked.svg"
import Map from "../../assets/placeInformation/Map.svg"
import Pin from "../../assets/placeInformation/Pin.svg"
import TelephoneActive from "../../assets/placeInformation/TelephoneActive.svg"
import WebsiteActive from "../../assets/placeInformation/WebsiteActive.svg"

import * as SecureStore from "expo-secure-store"
import { API_URL } from "@env"
import axios from "axios"
import { useFocusEffect } from "@react-navigation/native"

import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StackParamList } from "../../interface/navigate"

import FlatListCustom from "../../components/flatList"
import Star from "../../components/placeInformation/star"
import PercentageBar from "../../components/placeInformation/percentageBar"
import ButtonCustom from "../../components/button"
import Review from "../../components/placeInformation/review"

type Props = NativeStackScreenProps<StackParamList, "placeInformation">

const PlaceInformation = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets()

    const { placeId, type, forecastDate, forecastDuration } = route.params

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
        weekDay: [],
    })

    const [isCheckIn, setIsCheckIn] = useState(false)

    // =============== axios ===============
    const getPlaceInformation = async () => {
        try {
            const result = await SecureStore.getItemAsync("key")
            const response = await axios.get(`${API_URL}/place/information`, {
                headers: {
                    authorization: result,
                },
                params: {
                    placeId: placeId,
                    type: type,
                    forecastDate: forecastDate,
                    forecastDuration: forecastDuration,
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

    // =============== function ===============
    const handleGoBack = () => {
        navigation.goBack()
    }

    const handleCheckIn = () => {}

    const handleReview = () => {}

    return (
        <View
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }}
            className="bg-[#FFFFFF] h-[100%] w-[100%] overflow-scroll"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <View>
                    <Pressable
                        onPress={handleGoBack}
                        className="absolute z-[10] top-[16px] left-[16px]"
                    >
                        <Arrow_left_brown />
                    </Pressable>
                    <FlatListCustom
                        item={data.coverImg}
                        marginTop={-insets.top}
                    />
                    <Text className="absolute z-[10] bottom-[16px] left-[16px] text-[24px] text-[#FFFFFF] font-bold">
                        {data.placeName}
                    </Text>
                </View>

                <View className="p-[16px] ">
                    <View className="flex flex-row gap-[8px] items-center">
                        <Pin />
                        <Text className="text-[16px] text-[#FFC502] font-bold">
                            {data.location.address} {data.location.district}{" "}
                            {data.location.province}
                        </Text>
                    </View>

                    <Text className="mt-[16px] text-[16px] leading-[24px]">
                        <Text className="font-bold">{data.placeName}</Text>{" "}
                        {data.introduction}
                    </Text>

                    <View className="mt-[16px] ">
                        {data.tag.map((tag) => {
                            return (
                                <View className="self-start px-[4px] py-[2px]  border border-[#54400E] rounded-[2px] justify-center">
                                    <Text className="text-[12px] leading-[16px] text-[#54400E]">
                                        {tag}
                                    </Text>
                                </View>
                            )
                        })}
                    </View>

                    <View className="mt-[16px] flex flex-row justify-between">
                        <View className="flex flex-col gap-[8px] items-center">
                            <AddTrip />
                            <Text className="text-[12px]">เพิ่มลงทริป</Text>
                        </View>
                        <View className="flex flex-col gap-[8px] items-center">
                            <Map />
                            <Text className="text-[12px]">แผนที่</Text>
                        </View>
                        <View className="flex flex-col gap-[8px] items-center">
                            <WebsiteActive />
                            <Text className="text-[12px]">เว็บไซต์</Text>
                        </View>

                        <View className="flex flex-col gap-[8px] items-center">
                            <TelephoneActive />
                            <Text className="text-[12px]">โทร</Text>
                        </View>
                        <View className="flex flex-col gap-[8px] items-center">
                            <Bookmark />
                            <Text className="text-[12px]">บุ๊กมาร์ก</Text>
                        </View>
                    </View>

                    <View className="mt-[16px] flex flex-col ">
                        <Text className="text-[16px] font-bold">เวลาทำการ</Text>

                        <View className="mt-[8px]">
                            {Object.keys(data.weekDay).map((dayKey) => {
                                const dayInfo = data.weekDay[dayKey]
                                console.log(dayKey, dayInfo, data.weekDay)
                                return (
                                    <View
                                        className="flex flex-row items-center mt-[4px]"
                                        key={dayKey}
                                    >
                                        <Text className="text-[16px] w-[100px]">
                                            {dayInfo.day}
                                        </Text>
                                        <Text className="text-[16px]">
                                            {dayInfo.time}
                                        </Text>
                                    </View>
                                )
                            })}
                        </View>
                    </View>

                    <View className=" flex flex-col ">
                        <Text className="text-[16px] font-bold">
                            จำนวนคนที่เคยมาเช็กอิน 1,234 คน
                        </Text>
                        {isCheckIn ? (
                            <ButtonCustom
                                title="เคยเช็กอินแล้ว"
                                disable={true}
                            />
                        ) : (
                            <ButtonCustom title="เช็กอิน" />
                        )}
                    </View>

                    <View className="mt-[16px] ">
                        <Text className="text-[16px] font-bold">
                            รีวืวสถานที่
                        </Text>
                        <View className="flex flex-row mt-[8px]">
                            <View className="flex flex-col w-[150px]">
                                <View className="flex flex-row">
                                    <View className="w-[150px] items-center flex flex-col ">
                                        <Text className="text-[24px] font-bold mb-[7px]">
                                            5.0
                                        </Text>
                                        <Star score={4.3} />
                                        <Text className="mt-[7px]">
                                            543 รีวิว
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View className="ml-[8px] flex flex-grow">
                                <PercentageBar starText={5} percentage={10} />
                                <PercentageBar starText={4} percentage={10} />
                                <PercentageBar starText={3} percentage={10} />
                                <PercentageBar starText={2} percentage={10} />
                                <PercentageBar starText={1} percentage={10} />
                            </View>
                        </View>

                        <View className=" items-center flex">
                            <ButtonCustom
                                title="เขียนรีวิว"
                                fill="outline"
                                size="small"
                                width="w-[100px]"
                                onPress={handleReview}
                            />
                        </View>
                    </View>

                    <View className="mt-[16px] border-t-[0.5px] border-[#ABABB4]">
                        <Review
                            name="Winter"
                            profilePicture="https://tatapi.tourismthailand.org/tatfs/Image/custompoi/picture/P03000001_5.jpg"
                            score={4}
                            date={new Date()}
                            text="รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว รีวิว"
                            picture={[
                                "https://tatapi.tourismthailand.org/tatfs/Image/custompoi/picture/P03000001_1.jpg",
                                "https://tatapi.tourismthailand.org/tatfs/Image/custompoi/picture/P03000001_2.jpg",
                                "https://tatapi.tourismthailand.org/tatfs/Image/custompoi/picture/P03000001_3.jpg",
                                "https://tatapi.tourismthailand.org/tatfs/Image/custompoi/picture/P03000001_4.jpg",
                                "https://tatapi.tourismthailand.org/tatfs/Image/custompoi/picture/P03000001_5.jpg",
                            ]}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default PlaceInformation
