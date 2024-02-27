import React, { useCallback, useContext, useState } from "react"
import {
    View,
    Text,
    Image,
    Pressable,
    Dimensions,
    FlatList,
    ScrollView,
    Linking,
    Alert,
    Platform,
    TouchableOpacity,
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

import FlatListImage from "../../components/flatListImage"
import Star from "../../components/placeInformation/star"
import PercentageBar from "../../components/placeInformation/percentageBar"
import ButtonCustom from "../../components/button"
import Review from "../../components/placeInformation/review"
import OfficeHours from "../../components/placeInformation/officeHours"
import { AuthData } from "../../contexts/authContext"
import { FAIL, LOADING, SUCCESS } from "../../utils/const"
import ConfirmModal from "../../components/confirmModal"

type Props = NativeStackScreenProps<StackParamList, "placeInformation">

const PlaceInformation = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets()

    const { placeId, type, forecastDate, forecastDuration, from } = route.params

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
        review: {
            alreadyLike: false,
            content: "",
            img: [[]],
            profileUrl: "",
            rating: 0,
            reviewId: "",
            totalLike: 0,
            userId: "",
            username: "",
        },
        totalCheckIn: 0,
        alreadyBookmark: false,
        alreadyCheckIn: false,
        contact: { phone: "", url: "" },
        forecasts: [],
        latitude: 13.72042,
        longitude: 100.528338,

        placeId: "",
    })

    // https://www.google.com/maps/place/@13.72042,100.5257631,17z

    const { width, height } = Dimensions.get("screen")

    const { userId, token } = useContext(AuthData)
    const [numberOfReviews, setNumberOfReviews] = useState(0)
    const [averageRating, setAverageRating] = useState(0)
    const [ratingCounts, setRatingCounts] = useState<{ [key: number]: number }>(
        {}
    )
    const [placeInformationStatus, setPlaceInformationStatus] =
        useState(LOADING)
    const [modalDisplay, setModalDisplay] = useState(false)
    const [targetReviewId, setTargetReviewId] = useState("")

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
            console.log(response.status)

            const reviews = response.data.review

            // Count the number of reviews
            const numberOfReviews: number = reviews.length
            setNumberOfReviews(numberOfReviews)

            // Calculate the average rating
            const totalRating: number = reviews.reduce(
                (sum, review) => sum + review.rating,
                0
            )
            const averageRating: number =
                numberOfReviews > 0 ? totalRating / numberOfReviews : 0
            setAverageRating(averageRating)

            // Count the occurrences of each rating
            const ratingCounts: { [key: number]: number } = {}
            reviews.forEach((review) => {
                const rating = review.rating
                ratingCounts[rating] = (ratingCounts[rating] || 0) + 1
            })
            setRatingCounts(ratingCounts)

            setPlaceInformationStatus(SUCCESS)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data)
            }
            setPlaceInformationStatus(FAIL)
        }
    }
    const postLikeReview = async (reviewId: number) => {
        try {
            const response = await axios.post(
                `${API_URL}/review/like`,
                { reviewId: reviewId },
                {
                    headers: {
                        authorization: token,
                    },
                }
            )
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data)
            }
        }
    }
    const deleteReview = async (reviewId: number) => {
        try {
            const response = await axios.delete(`${API_URL}/review/delete`, {
                headers: {
                    Authorization: token,
                },
                data: {
                    reviewId: reviewId,
                },
            })
            console.log(response.data)
            if (response.data === "delete review success") {
                setModalDisplay(false)
            }
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

    // =============== navigate ===============
    const handleGoBack = () => {
        navigation.goBack()
    }

    const handleReview = () => {
        navigation.navigate("review", {
            placeName: data.placeName,
            placeId: data.placeId,
        })
    }

    // =============== review ===============
    const handleDeleteReview = (reviewId: string) => {
        setModalDisplay(true)
        setTargetReviewId(reviewId)
    }

    const handleDeleteReviewConfirm = async () => {
        console.log("delete", targetReviewId)
    }

    // =============== function ===============
    const handleCheckIn = () => {}

    const handlePercentage = (n: number | undefined) => {
        if (n) {
            return (n / numberOfReviews) * 100
        }
        return 0
    }

    //
    const handleCall = () => {
        console.log("call", data.contact.phone, Platform.OS)
        const phone = "119"
        let phoneNumber = ""

        if (Platform.OS === "ios") {
            phoneNumber = `telprompt:${phone}`
        } else if (Platform.OS === "android") {
            phoneNumber = `tel:${phone}`
        }

        Linking.canOpenURL(phoneNumber)
            .then((supported) => {
                console.log("supported", supported)
                if (!supported) {
                    Alert.alert("Phone number is not available")
                } else {
                    return Linking.openURL(phoneNumber)
                }
            })
            .catch((err) => console.log(err))
    }

    // const callNumber = phone => {
    //     console.log('callNumber ----> ', phone);
    //     let phoneNumber = phone;
    //     if (Platform.OS !== 'android') {
    //       phoneNumber = `telprompt:${phone}`;
    //     }
    //     else  {
    //       phoneNumber = `tel:${phone}`;
    //     }
    //     Linking.canOpenURL(phoneNumber)
    //     .then(supported => {
    //       if (!supported) {
    //         Alert.alert('Phone number is not available');
    //       } else {
    //         return Linking.openURL(phoneNumber);
    //       }
    //     })
    //     .catch(err => console.log(err));
    //   };

    if (placeInformationStatus === LOADING) {
        return (
            <View>
                <Text>LOADING</Text>
                <Pressable
                    onPress={() => console.log(data)}
                    className="bg-black h-[100px] w-[100px]"
                ></Pressable>
            </View>
        )
    } else if (placeInformationStatus === SUCCESS) {
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
                    bounces={false}
                >
                    <View>
                        <TouchableOpacity
                            onPress={handleGoBack}
                            className="absolute z-[10] top-[16px] left-[16px]"
                        >
                            <Arrow_left_brown />
                        </TouchableOpacity>
                        <FlatListImage
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
                            <Text
                                className="text-[16px] text-[#FFC502] font-bold"
                                style={{ width: width - 24 - 8 - 16 * 2 }}
                            >
                                {data.location?.address}{" "}
                                {data.location?.district}
                                {data.location?.province}
                            </Text>
                        </View>

                        {data.introduction ? (
                            <Text className="mt-[16px] text-[16px] leading-[24px]">
                                <Text className="font-bold">
                                    {data.placeName}
                                </Text>
                                {data.introduction}
                            </Text>
                        ) : (
                            <></>
                        )}

                        {data.tag.length > 0 && (
                            <View className="mt-[12px] flex flex-row flex-wrap ">
                                {data.tag.map((tag) => {
                                    return (
                                        <View className="mt-[4px]">
                                            <View className="self-start px-[4px] py-[2px] mr-[4px]  border border-[#54400E] rounded-[2px] justify-center">
                                                <Text className="text-[12px] leading-[16px] text-[#54400E]">
                                                    {tag}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        )}

                        <View className="mt-[16px] flex flex-row justify-between">
                            {from !== "discovery" && (
                                <View className="flex flex-col gap-[8px] items-center">
                                    <AddTrip />
                                    <Text className="text-[12px]">
                                        เพิ่มลงทริป
                                    </Text>
                                </View>
                            )}
                            <View className="flex flex-col gap-[8px] items-center">
                                <Map />
                                <Text className="text-[12px]">แผนที่</Text>
                            </View>
                            <View className="flex flex-col gap-[8px] items-center">
                                <WebsiteActive />
                                <Text className="text-[12px]">เว็บไซต์</Text>
                            </View>

                            <Pressable onPress={handleCall}>
                                <View className="flex flex-col gap-[8px] items-center">
                                    <TelephoneActive />
                                    <Text className="text-[12px]">โทร</Text>
                                </View>
                            </Pressable>

                            <View className="flex flex-col gap-[8px] items-center">
                                <Bookmark />
                                <Text className="text-[12px]">บุ๊กมาร์ก</Text>
                            </View>
                        </View>

                        <View className="mt-[16px] flex flex-col ">
                            <Text className="text-[16px] font-bold">
                                เวลาทำการ
                            </Text>
                            <OfficeHours data={data.weekDay} />
                        </View>

                        <View className=" flex flex-col ">
                            <Text className="text-[16px] font-bold">
                                จำนวนคนที่เคยมาเช็กอิน {data.totalCheckIn} คน
                            </Text>
                            {data.alreadyCheckIn ? (
                                <ButtonCustom
                                    title="เคยเช็กอินแล้ว"
                                    disable={true}
                                />
                            ) : (
                                <ButtonCustom
                                    title="เช็กอิน"
                                    onPress={handleCheckIn}
                                />
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
                                                {averageRating.toFixed(1)}
                                            </Text>
                                            <Star rating={averageRating} />
                                            <Text className="mt-[7px]">
                                                {numberOfReviews} รีวิว
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View className="ml-[8px] flex flex-grow">
                                    <PercentageBar
                                        starText={5}
                                        percentage={handlePercentage(
                                            ratingCounts[5]
                                        )}
                                    />
                                    <PercentageBar
                                        starText={4}
                                        percentage={handlePercentage(
                                            ratingCounts[4]
                                        )}
                                    />
                                    <PercentageBar
                                        starText={3}
                                        percentage={handlePercentage(
                                            ratingCounts[3]
                                        )}
                                    />
                                    <PercentageBar
                                        starText={2}
                                        percentage={handlePercentage(
                                            ratingCounts[2]
                                        )}
                                    />
                                    <PercentageBar
                                        starText={1}
                                        percentage={handlePercentage(
                                            ratingCounts[1]
                                        )}
                                    />
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
                            {data.review &&
                                Array.isArray(data.review) &&
                                data.review.map((review, index) => {
                                    return (
                                        <Review
                                            key={index}
                                            username={review.username}
                                            ownerId={review.userId}
                                            profileUrl={review.profileUrl}
                                            rating={review.rating}
                                            createDate={review.createDate}
                                            content={review.content}
                                            img={review.img}
                                            totalLike={review.totalLike}
                                            alreadyLike={review.alreadyLike}
                                            reviewId={review.reviewId}
                                            handleDeleteReview={
                                                handleDeleteReview
                                            }
                                        />
                                    )
                                })}
                        </View>
                    </View>
                </ScrollView>

                {modalDisplay && (
                    <View className="absolute z-[100] top-0 bg-[#0000008C] w-[100%] h-[100vh] flex-col justify-center items-center ">
                        <ConfirmModal
                            title={<Text>ยืนยันที่จะลบ</Text>}
                            confirmTitle={"ลบ"}
                            onPressCancel={() => {
                                setModalDisplay(false)
                            }}
                            onPressConfirm={() => {
                                handleDeleteReviewConfirm()
                            }}
                        />
                    </View>
                )}
            </View>
        )
    }
}

export default PlaceInformation
