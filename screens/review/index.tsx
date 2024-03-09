import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Pressable,
    TextInput,
    ScrollView,
    Button,
    Image,
    Platform,
} from "react-native";
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../../interface/navigate";
import ArrowLeft from "../../assets/ArrowLeft.svg";
import DeleteImage from "../../assets/DeleteImage.svg";
import ImageUploader from "../../assets/ImageUploader.svg";

import ButtonCustom from "../../components/button";
import Star from "../../components/placeInformation/star";
import * as ImagePicker from "expo-image-picker";

import * as SecureStore from "expo-secure-store";
import { API_URL } from "@env";
import axios from "axios";

type Props = NativeStackScreenProps<StackParamList, "review">;

const Review = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets();

    const { placeId, placeName } = route.params;

    const handleGoBack = () => {
        navigation.goBack();
    };

    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const [images, setImages] = useState<string[]>([]);

    const [disableButton, setDisableButton] = useState(true);

    const handlePost = () => {
        sendPost();
    };

    useEffect(() => {
        if (content !== "" && rating > 0) {
            console.log("able");
            setDisableButton(false);
        } else {
            setDisableButton(true);
        }
    }, [rating, content]);

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

    const sendPost = async () => {
        try {
            const result = await SecureStore.getItemAsync("key");

            const formData = new FormData();

            formData.append("rating", rating);
            formData.append("content", content);
            formData.append("placeId", placeId);

            for (let i = 0; i < images.length; i++) {
                formData.append("files", {
                    uri: images[i],
                    name: `image${i}.jpg`,
                    type: "image/jpeg",
                });
            }

            const response = await axios.post(`${API_URL}/review`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    authorization: result,
                },
            });

            if (response.data.message === "success review") {
                handleGoBack();
            }
        } catch (error) {
            console.log("error", error);
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data);
            }
        }
    };

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
                <ArrowLeft onPress={handleGoBack} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View>
                    <View className="h-[68px] p-[16px] justify-center">
                        <Text className="text-[24px] leading-[36px] font-bold">
                            {placeName}
                        </Text>
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
                        <View className="flex flex-row items-center">
                            <Text className="text-[16px]  font-bold">
                                รูปภาพ
                            </Text>
                            <Text className="text-[16px] leading-[24px] text-[#9898AA] ml-[4px]">
                                ({images.length}/5)
                            </Text>
                        </View>
                        <View className="flex flex-row mt-[8px] overflow-scroll">
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                bounces={false}
                            >
                                {images &&
                                    images.map((uri, index) => {
                                        return (
                                            <View className="mr-[8px] flex flex-row">
                                                <Image
                                                    source={{ uri: uri }}
                                                    className="rounded w-[80px] h-[80px] mr-[8px]"
                                                />
                                                <DeleteImage
                                                    className="ml-[-30px]"
                                                    style={{ marginLeft: -30 }}
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
                                            </View>
                                        );
                                    })}
                                {images.length < 5 && (
                                    <ImageUploader onPress={pickImage} />
                                )}
                            </ScrollView>
                        </View>
                    </View>

                    <View className="p-[16px]  flex flex-col border-t border-[#D9D9D9]">
                        <Text className="text-[16px] font-bold">
                            คะแนนของคุณ
                        </Text>
                        <View className="mt-[8px] items-center">
                            <Star
                                rating={rating}
                                size="large"
                                width="w-[300px]"
                                setRating={setRating}
                            />
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
                    onPress={handlePost}
                    disable={disableButton}
                />
            </View>
        </View>
    );
};

export default Review;
