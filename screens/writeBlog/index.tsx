import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    Pressable,
    TextInput,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ImageView from "react-native-image-viewing";
import { useFocusEffect } from "@react-navigation/native";

import { StackParamList } from "../../interface/navigate";

import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";

import { API_URL } from "@env";

import axios, { Axios } from "axios";
// =============== svg ===============
import ArrowLeft from "../../assets/ArrowLeft.svg";
import DeleteImage from "../../assets/DeleteImage.svg";
import ImageUploader from "../../assets/ImageUploader.svg";
import HalfArrowRight from "../../assets/invitation/HalfArrowRight.svg";

// =============== components ===============
import ButtonCustom from "../../components/button";

import {
    CalendarRange,
    RangeDatepicker,
    Icon,
    IconElement,
    Datepicker,
    Autocomplete,
    AutocompleteItem,
} from "@ui-kitten/components";

import AutoCompleteCustom from "../../components/autoComplete";
import { PlaceOption } from "../../interface/blog";
import CoverImage from "../../assets/blog/defaultCoverImage.svg";
import Close from "../../assets/blog/close.svg";

type Props = NativeStackScreenProps<StackParamList, "writeBlog">;

const WriteBlog = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets();

    // const { placeId, placeName } = route.params;

    const { width, height } = Dimensions.get("screen");

    const handleGoBack = () => {
        navigation.goBack();
    };

    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<CalendarRange<Date>>({
        startDate: new Date(),
        endDate: new Date(),
    });
    const [selectedTrip, setSelectedTrip] = useState("");
    const [selectedPlaces, setSelectedPlaces] = useState<PlaceOption[]>([]);

    const [disableButton, setDisableButton] = useState(true);
    const [loadingButton, setLoadingButton] = useState(false);
    const [targetImage, setTargetImage] = useState(0);
    const [visible, setIsVisible] = useState(false);

    // =============== useFocusEffect ===============
    useFocusEffect(
        useCallback(() => {
            if (content !== "" && title !== "") {
                setDisableButton(false);
            } else {
                setDisableButton(true);
            }
        }, [content])
    );

    // =============== axios ===============
    const sendPost = async () => {
        setLoadingButton(true);
        try {
            const result = await SecureStore.getItemAsync("key");

            const formData = new FormData();

            // title
            // date

            formData.append("name", title);

            formData.append("note", content);

            formData.append("startDate", dateRange.startDate.toDateString());

            formData.append("endDate", dateRange.endDate.toDateString());

            formData.append("tripIdReference", selectedTrip);

            selectedPlaces.map((place) =>
                formData.append("placeId", place.placeId)
            );

            for (let i = 0; i < images.length; i++) {
                formData.append("files", {
                    uri: images[i],
                    name: `image${i}.jpg`,
                    type: "image/jpeg",
                });
            }

            const response = await axios.post(`${API_URL}/blog`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    authorization: result,
                },
            });

            setLoadingButton(false);
            handleGoBack();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data);
            }
            setLoadingButton(false);
        }
    };

    // =============== image ===============
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: true,
            selectionLimit: 5 - images.length,
        });

        if (!result.canceled) {
            const img = result.assets;

            const imageUris = img.map((item) => item.uri);

            setImages((prevImages) => [...prevImages, ...imageUris]);
        }
    };

    // =============== date ===============
    const onSelectDatePicker = (range: CalendarRange<Date>) => {
        setDateRange({ startDate: range.startDate, endDate: range.endDate });
    };

    const [optionsTrip, setOptionsTrip] = useState([]);
    const [optionsPlace, setOptionsPlace] = useState<PlaceOption[]>([]);

    const [searchTrip, setSearchTrip] = useState("");
    const [searchPlace, setSearchPlace] = useState("");

    const [loadingTrip, setLoadingTrip] = useState(false);
    const [loadingPlace, setLoadingPlace] = useState(false);

    // blogSearch
    useFocusEffect(
        useCallback(() => {
            const abortController = new AbortController();
            const signal = abortController.signal;

            console.log("text", searchPlace);
            if (searchPlace.length >= 2) {
                (async () => {
                    setLoadingPlace(true);
                    try {
                        const result = await SecureStore.getItemAsync("key");
                        const response = await axios.get(
                            `${API_URL}/place/blogSearch`,
                            {
                                headers: {
                                    authorization: result,
                                },
                                params: {
                                    input: searchPlace,
                                },
                                signal: signal,
                            }
                        );
                        console.log(response.data);
                        setOptionsPlace(response.data);
                        setLoadingPlace(false);
                    } catch (error) {
                        if (axios.isAxiosError(error) && error.response) {
                            console.log(error.response.data);
                        }
                        setOptionsPlace([]);
                        setLoadingPlace(false);
                    }
                })();
            }

            return () => {
                abortController.abort();
            };
        }, [searchPlace])
    );

    useFocusEffect(
        useCallback(() => {
            console.log("selectedTrip", selectedTrip);
        }, [selectedTrip])
    );

    useFocusEffect(
        useCallback(() => {
            console.log("selectedPlaces", selectedPlaces);
        }, [selectedPlaces])
    );

    return (
        <View
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }}
            className="bg-[#FFFFFF] h-[100%] w-[100%] overflow-scroll "
        >
            <View
                className="bg-white h-[52px] p-[16px]"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                }}
            >
                <Pressable className="w-[30px]" onPress={handleGoBack}>
                    <ArrowLeft />
                </Pressable>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={{ flexGrow: 1 }}
                automaticallyAdjustKeyboardInsets={true}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ paddingBottom: insets.bottom + 40 + 48 }}>
                    <View className="p-[16px] justify-center">
                        <TextInput
                            value={title}
                            className="text-[24px] leading-[36px] font-bold"
                            onChangeText={setTitle}
                            placeholder="ชื่อเรื่อง"
                            placeholderTextColor={"#D9D9D9"}
                            multiline={true}
                        />
                    </View>
                    <View className="border-y border-[#D9D9D9] p-[16px]">
                        <TextInput
                            value={content}
                            className="text-[16px] leading-[24px] min-h-[300px]"
                            onChangeText={setContent}
                            placeholder="พิมพ์เล่าประสบการณ์"
                            placeholderTextColor={"#D9D9D9"}
                            multiline={true}
                        />
                    </View>

                    <View className="p-[16px]  flex flex-col ">
                        <View className="flex flex-row justify-between items-center">
                            <View className="flex flex-row">
                                <Text className="text-[16px] font-bold">
                                    รูปภาพ
                                </Text>
                                <Text className="text-[16px] leading-[24px] text-[#9898AA] ml-[4px]">
                                    ({images.length}/5)
                                </Text>
                            </View>
                        </View>
                        <View className="flex flex-row mt-[8px] overflow-scroll">
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                bounces={false}
                            >
                                {images &&
                                    images.map((uri, index) => {
                                        console.log(uri);
                                        return (
                                            <Pressable
                                                key={index}
                                                className="mr-[8px] flex flex-row"
                                                onPress={() => {
                                                    setTargetImage(index);
                                                    setIsVisible(true);
                                                }}
                                            >
                                                <ImageView
                                                    images={images.map(
                                                        (uri) => ({ uri })
                                                    )}
                                                    imageIndex={targetImage}
                                                    visible={visible}
                                                    onRequestClose={() =>
                                                        setIsVisible(false)
                                                    }
                                                />
                                                <Image
                                                    source={{ uri: uri }}
                                                    className="rounded w-[80px] h-[80px] mr-[8px]"
                                                />
                                                <DeleteImage
                                                    className="ml-[-30px]"
                                                    style={{
                                                        marginLeft: -30,
                                                    }}
                                                    onPress={() => {
                                                        const updatedImages = [
                                                            ...images,
                                                        ];

                                                        updatedImages.splice(
                                                            index,
                                                            1
                                                        );

                                                        setImages(
                                                            updatedImages
                                                        );
                                                    }}
                                                />
                                                {index === 0 && (
                                                    <View className="h-[24px] w-[60px] bg-white flex justify-center items-center absolute bottom-[7px] left-[10px] rounded-[4px] border border-[#FFFFFF]">
                                                        <Text className="text-[12px] leading-[18px]">
                                                            รูปปก
                                                        </Text>
                                                    </View>
                                                )}
                                            </Pressable>
                                        );
                                    })}
                                {images.length < 5 && (
                                    <ImageUploader onPress={pickImage} />
                                )}
                            </ScrollView>
                        </View>
                    </View>

                    <View className="p-[16px] flex flex-col border-t border-[#D9D9D9]">
                        <Text className="text-[16px] font-bold mb-[8px]">
                            ทริปการท่องเที่ยวของคุณ
                        </Text>

                        {/* Trip */}
                        <AutoCompleteCustom
                            selected={selectedTrip}
                            setSelected={setSelectedTrip}
                            placeholder="เลือกทริปการท่องเที่ยว"
                            options={optionsTrip}
                            search={searchTrip}
                            setSearch={setSearchTrip}
                            loading={loadingTrip}
                        />

                        <Text className="text-[16px] font-bold mt-[16px] mb-[8px]">
                            ทริปนี้เดินทางเมื่อไหร่
                        </Text>

                        <RangeDatepicker
                            size="medium" // 40
                            range={dateRange}
                            onSelect={onSelectDatePicker}
                            placeholder={() => (
                                <View className="flex-row items-center">
                                    <Text className="text-[#00000040] w-[142px]">
                                        วันเริ่มต้น
                                    </Text>
                                    <HalfArrowRight />
                                    <Text className="text-[#00000040]">
                                        วันสุดท้าย
                                    </Text>
                                </View>
                            )}
                            placement={"top"}
                            accessoryRight={
                                <Icon
                                    fill="#D9D9D9"
                                    name="calendar"
                                    onPress={() => {
                                        console.log("TEST");
                                    }}
                                />
                            }
                        />

                        <Text className="text-[16px] font-bold mt-[16px] mb-[8px]">
                            ทริปนี้แวะที่ไหนบ้าง
                        </Text>

                        {/* Place */}
                        <AutoCompleteCustom
                            selectedMultiple={selectedPlaces}
                            setSelectedMultiple={setSelectedPlaces}
                            placeholder="เลือกสถานที่ท่องเที่ยว"
                            options={optionsPlace}
                            search={searchPlace}
                            setSearch={setSearchPlace}
                            multiple={true}
                            loading={loadingPlace}
                        />

                        <View className="my-[8px]">
                            {selectedPlaces.map((place, index) => {
                                const district = place.location.district;
                                const province = place.location.province;
                                const placeId = place.placeId;
                                const placeName = place.placeName;
                                const coverImg = place.coverImg;

                                return (
                                    <View
                                        key={index}
                                        className={`border border-[#54400E] p-[8px] flex flex-row rounded-[5px] mt-[16px]`}
                                    >
                                        {coverImg ? (
                                            <Image
                                                source={{
                                                    uri: coverImg,
                                                }}
                                                className="w-[80px] h-[80px] rounded-[5px] border border-[#54400E]"
                                            />
                                        ) : (
                                            <CoverImage />
                                        )}

                                        <View className="ml-[16px] flex flex-col justify-between flex-1 ">
                                            <Text
                                                style={{
                                                    width:
                                                        width -
                                                        (16 * 2 +
                                                            8 * 2 +
                                                            16 +
                                                            24) -
                                                        100,
                                                }}
                                                className={`text-[14px] truncate font-bold`}
                                                numberOfLines={1}
                                            >
                                                {placeName}
                                            </Text>

                                            <Text className="text-[12px] font-bold text-[#FFC502]">
                                                {district}, {province}
                                            </Text>

                                            <Pressable
                                                className="absolute right-0"
                                                onPress={() => {
                                                    console.log("", placeId);
                                                    setSelectedPlaces(
                                                        (prev) => {
                                                            const index =
                                                                prev.findIndex(
                                                                    (item) =>
                                                                        item.placeId ===
                                                                        placeId
                                                                );

                                                            const updatedArray =
                                                                [...prev];
                                                            updatedArray.splice(
                                                                index,
                                                                1
                                                            );
                                                            return updatedArray;
                                                        }
                                                    );
                                                }}
                                            >
                                                <Close />
                                            </Pressable>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View
                className="bg-[#FFFFFF] flex px-[20px] pb-[20px] pt-[12px] absolute w-[100%] "
                style={{
                    bottom: 0,
                    height: insets.bottom + 40 + 48,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                }}
            >
                <ButtonCustom
                    title="โพสต์"
                    onPress={() => {
                        sendPost();
                    }}
                    disable={disableButton}
                    loading={loadingButton}
                />
            </View>
        </View>
    );
};

export default WriteBlog;
