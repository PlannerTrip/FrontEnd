import React, { useCallback, useContext, useState } from "react";
import {
    View,
    Text,
    Pressable,
    Dimensions,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as SecureStore from "expo-secure-store";

import { API_URL } from "@env";

import axios from "axios";

import * as Linking from "expo-linking";

import { StackParamList } from "../../interface/navigate";

import { AuthData } from "../../contexts/authContext";

// =============== svg ===============
import Arrow_left_brown from "../../assets/Arrow_left_brown.svg";
import AddTrip from "../../assets/placeInformation/AddTrip.svg";
import Bookmark from "../../assets/placeInformation/Bookmark.svg";
import Bookmarked from "../../assets/placeInformation/Bookmarked.svg";
import Map from "../../assets/placeInformation/Map.svg";
import Pin from "../../assets/placeInformation/Pin.svg";
import TelephoneActive from "../../assets/placeInformation/TelephoneActive.svg";
import WebsiteActive from "../../assets/placeInformation/WebsiteActive.svg";
import Check from "../../assets/modal/checkCircle.svg";
import Close from "../../assets/modal/closeCircle.svg";

// =============== components ===============
import FlatListImage from "../../components/flatListImage";
import Star from "../../components/placeInformation/star";
import PercentageBar from "../../components/placeInformation/percentageBar";
import ButtonCustom from "../../components/button";
import Review from "../../components/placeInformation/review";
import OfficeHours from "../../components/placeInformation/officeHours";
import ConfirmModal from "../../components/confirmModal";
import Loading from "../Loading";

// =============== utils ===============
import { FAIL, LOADING, SUCCESS } from "../../utils/const";
import { getCurrentLocation } from "../../utils/function";

type Props = NativeStackScreenProps<StackParamList, "placeInformation">;

const defaultData = {
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
    totalCheckIn: 0,
    // alreadyBookmark: false,
    // alreadyCheckIn: false,
    contact: { phone: "", url: "" },
    forecasts: [],
    latitude: 0,
    longitude: 0,
    placeId: "",
};

const PlaceInformation = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets();

    const { placeId, type, forecastDate, forecastDuration, from } =
        route.params;

    const { width, height } = Dimensions.get("screen");

    const { token } = useContext(AuthData);

    // =============== useState ===============
    const [data, setData] = useState(defaultData);
    const [bookmark, setBookmark] = useState(false);
    const [checkIn, setCheckIn] = useState(false);

    // display
    const [placeInformationStatus, setPlaceInformationStatus] =
        useState(LOADING);
    const [displayModalDeleteReview, setDisplayModalDeleteReview] =
        useState(false);
    const [displayModalBookmark, setDisplayModalBookmark] = useState(false);
    const [displayModalCheckInFail, setDisplayModalCheckInFail] =
        useState(false);
    const [displayModalCheckInSuccess, setDisplayModalCheckInSuccess] =
        useState(false);
    const [loadingButton, setLoadingButton] = useState(false);

    // check-in
    const [permission, setPermission] = useState(true);

    // icon
    const [disableTelephone, setDisableTelephone] = useState(true);
    const [disableWebsite, setDisableWebsite] = useState(true);

    // review
    const [numberOfReviews, setNumberOfReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingCounts, setRatingCounts] = useState<{ [key: number]: number }>(
        {}
    );
    const [targetReviewId, setTargetReviewId] = useState("");
    const [deletedReview, setDeletedReview] = useState<string[]>([]);
    const [reviews, setReviews] = useState({
        alreadyLike: false,
        content: "",
        img: [[]],
        profileUrl: "",
        rating: 0,
        reviewId: "",
        totalLike: 0,
        userId: "",
        username: "",
    });

    // =============== axios ===============
    const getPlaceInformation = async () => {
        try {
            const result = await SecureStore.getItemAsync("key");
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
            });

            const getData = response.data;
            setData(getData);

            handleReview(getData.review);

            setDisableTelephone(getData.contact.phone ? false : true);
            setDisableWebsite(getData.contact.url ? false : true);

            setBookmark(getData.alreadyBookmark);
            setCheckIn(getData.alreadyCheckIn);

            setPlaceInformationStatus(SUCCESS);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data);
            }
            setPlaceInformationStatus(FAIL);
        }
    };

    const deleteReview = async (reviewId: string) => {
        try {
            const response = await axios.delete(`${API_URL}/review/delete`, {
                headers: {
                    Authorization: token,
                },
                data: {
                    reviewId: reviewId,
                },
            });

            setDisplayModalDeleteReview(false);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data);
            }
        }
    };

    const postBookmark = async () => {
        try {
            const response = await axios.post(
                `${API_URL}/place/bookmark`,
                { placeId: data.placeId },
                {
                    headers: {
                        authorization: token,
                    },
                }
            );
            if (!bookmark) {
                setDisplayModalBookmark(true);
            }
            setBookmark(!bookmark);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data);
            }
        }
    };

    const postCheckIn = async (latitude: number, longitude: number) => {
        setLoadingButton(true);
        try {
            await axios.post(
                `${API_URL}/place/checkIn`,
                {
                    latitude: latitude,
                    longitude: longitude,
                    placeId: data.placeId,
                },
                {
                    headers: {
                        authorization: token,
                    },
                }
            );
            setCheckIn(true);
            setDisplayModalCheckInSuccess(true);
            setLoadingButton(false);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data.error);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setLoadingButton(false);
                setDisplayModalCheckInFail(true);
            }
        }
    };

    // =============== useFocusEffect ===============
    useFocusEffect(
        useCallback(() => {
            getPlaceInformation();
        }, [])
    );

    // =============== navigate ===============
    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleGoReview = () => {
        navigation.navigate("writeReview", {
            placeName: data.placeName,
            placeId: data.placeId,
        });
    };

    // =============== review ===============
    const handleDeleteReview = (reviewId: string) => {
        setDisplayModalDeleteReview(true);
        setTargetReviewId(reviewId);
    };

    const handleDeleteReviewConfirm = () => {
        setDeletedReview((prev) => {
            const updatedReview = [...prev];

            if (!updatedReview.includes(targetReviewId)) {
                updatedReview.push(targetReviewId);
            }

            return updatedReview;
        });

        deleteReview(targetReviewId);
    };

    const handleReview = (reviewsData) => {
        setReviews(reviewsData);
        const numberOfReviews: number = reviewsData.length;
        setNumberOfReviews(numberOfReviews);

        const totalRating: number = reviewsData.reduce(
            (sum, review) => sum + review.rating,
            0
        );
        const averageRating: number =
            numberOfReviews > 0 ? totalRating / numberOfReviews : 0;
        setAverageRating(averageRating);

        const ratingCounts: { [key: number]: number } = {};
        reviewsData.forEach((review) => {
            const rating = review.rating;
            ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
        });
        setRatingCounts(ratingCounts);
    };

    // =============== function ===============
    const handleCheckIn = async () => {
        const currentLocation = await getCurrentLocation();

        if (currentLocation) {
            const currentLatitude = currentLocation.coords.latitude;
            const currentLongitude = currentLocation.coords.longitude;
            postCheckIn(currentLatitude, currentLongitude);
        } else {
            setPermission(false);
        }
    };

    const handlePercentage = (n: number | undefined) => {
        if (n) {
            return (n / numberOfReviews) * 100;
        }
        return 0;
    };

    // =============== icons ===============
    const handleTelephone = () => {
        if (!disableTelephone) {
            Linking.openURL(`tel:${data.contact.phone}`);
        }
    };

    const handleWebsite = () => {
        if (!disableWebsite) {
            Linking.openURL(`https://${data.contact.url}`);
        }
    };

    const handleMap = () => {
        Linking.openURL(
            `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
        );
    };

    const handleBookmark = () => {
        postBookmark();
    };

    if (placeInformationStatus === LOADING) {
        return <Loading />;
    } else if (placeInformationStatus === SUCCESS) {
        return (
            <View
                style={{
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
                    {/* Image */}
                    <View>
                        <TouchableOpacity
                            onPress={handleGoBack}
                            className="absolute z-[10] left-[16px]"
                            style={{ top: insets.top }}
                        >
                            <Arrow_left_brown />
                        </TouchableOpacity>

                        <FlatListImage
                            item={data.coverImg ? data.coverImg : [""]}
                            width={width}
                        />

                        <Text className="absolute z-[10] bottom-[16px] left-[16px] text-[24px] text-[#FFFFFF] font-bold">
                            {data.placeName}
                        </Text>
                    </View>

                    <View className="p-[16px] ">
                        {/* Address */}
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

                        {/* Introduction */}
                        {data.introduction ? (
                            <Text className="mt-[16px] text-[16px] leading-[24px]">
                                <Text className="font-bold">
                                    {data.placeName}{" "}
                                </Text>
                                {data.introduction}
                            </Text>
                        ) : (
                            <></>
                        )}

                        {/* Tag */}
                        {data.tag.length > 0 && (
                            <View className="mt-[12px] flex flex-row flex-wrap ">
                                {data.tag.map((tag) => {
                                    return (
                                        <View className="mt-[4px]" key={tag}>
                                            <View className="self-start px-[4px] py-[2px] mr-[4px]  border border-[#54400E] rounded-[2px] justify-center">
                                                <Text className="text-[12px] leading-[16px] text-[#54400E]">
                                                    {tag}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        )}

                        {/* Icon */}
                        <View className="my-[16px] flex flex-row justify-between">
                            {/* AddTrip */}
                            {from !== "discovery" && (
                                <Pressable
                                    className="flex flex-col gap-[8px] items-center"
                                    onPress={handleTelephone}
                                >
                                    <AddTrip />
                                    <Text className="text-[12px]">
                                        เพิ่มลงทริป
                                    </Text>
                                </Pressable>
                            )}

                            {/* Map */}
                            <Pressable
                                className="flex flex-col gap-[8px] items-center"
                                onPress={handleMap}
                            >
                                <Map />
                                <Text className="text-[12px]">แผนที่</Text>
                            </Pressable>

                            {/* Website */}
                            <Pressable
                                className={`flex flex-col gap-[8px] items-center ${
                                    disableWebsite && "opacity-30"
                                }`}
                                onPress={handleWebsite}
                            >
                                <WebsiteActive />
                                <Text className="text-[12px]">เว็บไซต์</Text>
                            </Pressable>

                            {/* Telephone */}
                            <Pressable
                                className={`flex flex-col gap-[8px] items-center ${
                                    disableTelephone && "opacity-30"
                                }`}
                                onPress={handleTelephone}
                            >
                                <TelephoneActive />
                                <Text className="text-[12px]">โทร</Text>
                            </Pressable>

                            {/* Bookmark */}
                            <Pressable
                                className="flex flex-col gap-[8px] items-center"
                                onPress={handleBookmark}
                            >
                                {bookmark ? <Bookmarked /> : <Bookmark />}

                                <Text className="text-[12px]">บุ๊กมาร์ก</Text>
                            </Pressable>
                        </View>

                        {/* Office hours */}
                        <View className="flex flex-col ">
                            <Text className="text-[16px] font-bold">
                                เวลาทำการ
                            </Text>
                            <OfficeHours data={data.weekDay} />
                        </View>

                        {/* Check-in */}
                        <View className="flex flex-col mt-[16px] ">
                            <Text className="text-[16px] font-bold">
                                จำนวนคนที่เคยมาเช็กอิน {data.totalCheckIn} คน
                            </Text>
                            {checkIn ? (
                                <ButtonCustom
                                    title="เคยเช็กอินแล้ว"
                                    disable={true}
                                />
                            ) : (
                                <ButtonCustom
                                    title="เช็กอิน"
                                    onPress={handleCheckIn}
                                    loading={loadingButton}
                                />
                            )}
                        </View>

                        {/* Review */}
                        <View>
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
                                        onPress={handleGoReview}
                                    />
                                </View>
                            </View>

                            <View className="mt-[16px] border-t-[0.5px] border-[#ABABB4]">
                                {reviews &&
                                    Array.isArray(reviews) &&
                                    reviews.map((review, index) => {
                                        if (
                                            !deletedReview.includes(
                                                review.reviewId
                                            )
                                        ) {
                                            return (
                                                <Review
                                                    key={index}
                                                    username={review.username}
                                                    ownerId={review.userId}
                                                    profileUrl={
                                                        review.profileUrl
                                                    }
                                                    rating={review.rating}
                                                    createDate={
                                                        review.createDate
                                                    }
                                                    content={review.content}
                                                    img={review.img}
                                                    totalLike={review.totalLike}
                                                    alreadyLike={
                                                        review.alreadyLike
                                                    }
                                                    reviewId={review.reviewId}
                                                    handleDeleteReview={
                                                        handleDeleteReview
                                                    }
                                                />
                                            );
                                        }
                                    })}
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Modal */}
                {displayModalDeleteReview && (
                    <View className="absolute z-[100] top-0 bg-[#0000008C] w-[100%] h-[100vh] flex-col justify-center items-center ">
                        <ConfirmModal
                            title={<Text>ยืนยันที่จะลบ</Text>}
                            confirmTitle={"ลบ"}
                            onPressCancel={() => {
                                setDisplayModalDeleteReview(false);
                            }}
                            onPressConfirm={() => {
                                handleDeleteReviewConfirm();
                            }}
                        />
                    </View>
                )}

                {displayModalCheckInFail && (
                    <View className="absolute z-[100] top-0 bg-[#0000008C] w-[100%] h-[100vh] flex-col justify-center items-center ">
                        <ConfirmModal
                            title={
                                <View className="flex flex-col justify-center items-center">
                                    <Close />
                                    <Text className="mt-[8px] font-bold text-[16px] leading-[24px]">
                                        ไม่สามารถเช็คอินได้
                                    </Text>
                                    {permission ? (
                                        <>
                                            <Text className="text-[12px] leading-[18px]">
                                                คุณต้องอยู่ใกล้
                                            </Text>
                                            <Text className="text-[12px] leading-[18px]">
                                                {data.placeName}
                                            </Text>
                                            <Text className="text-[12px] leading-[18px]">
                                                ในระยะไม่เกิน 3 กิโลเมตร
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <Text className="text-[12px] leading-[18px]">
                                                โปรดตั้งค่าสิทธิ์การเข้าถึงตำแหน่งของแอปใหม่
                                            </Text>
                                        </>
                                    )}
                                </View>
                            }
                            cancelTitle={"ปิด"}
                            onPressCancel={() => {
                                setDisplayModalCheckInFail(false);
                            }}
                            confirm={false}
                        />
                    </View>
                )}

                {displayModalCheckInSuccess && (
                    <View className="absolute z-[100] top-0 bg-[#0000008C] w-[100%] h-[100vh] flex-col justify-center items-center ">
                        <ConfirmModal
                            title={
                                <View className="flex flex-col justify-center items-center">
                                    <Check />
                                    <Text className="mt-[8px] font-bold text-[16px] leading-[24px]">
                                        เช็คอินสำเร็จ
                                    </Text>
                                    <Text className=" text-[12px] leading-[18px]">
                                        {data.placeName}
                                    </Text>
                                </View>
                            }
                            cancelTitle={"ปิด"}
                            onPressCancel={() => {
                                setDisplayModalCheckInSuccess(false);
                            }}
                            confirm={false}
                        />
                    </View>
                )}

                {displayModalBookmark && (
                    <View className="absolute z-[100] top-0 bg-[#0000008C] w-[100%] h-[100vh] flex-col justify-center items-center ">
                        <ConfirmModal
                            title={
                                <View className="flex flex-col justify-center items-center">
                                    <Check />
                                    <Text className="mt-[8px] font-bold text-[16px] leading-[24px]">
                                        บุ๊คมาร์กสำเร็จ
                                    </Text>
                                    <Text className=" text-[12px] leading-[18px]">
                                        {data.placeName}
                                    </Text>
                                </View>
                            }
                            cancelTitle={"ปิด"}
                            onPressCancel={() => {
                                setDisplayModalBookmark(false);
                            }}
                            confirm={false}
                        />
                    </View>
                )}
            </View>
        );
    }
};

export default PlaceInformation;
