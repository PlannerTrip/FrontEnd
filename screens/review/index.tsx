import React, { useState } from "react"
import {
    View,
    Text,
    Pressable,
    TextInput,
    ScrollView,
    Button,
    Image,
    Platform,
} from "react-native"
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context"

import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StackParamList } from "../../interface/navigate"
import ArrowLeft from "../../assets/ArrowLeft.svg"
import ImageUploader from "../../assets/ImageUploader.svg"

import ButtonCustom from "../../components/button"
import Star from "../../components/placeInformation/star"
import * as ImagePicker from "expo-image-picker"

import * as SecureStore from "expo-secure-store"
import { API_URL } from "@env"
import axios from "axios"

type Props = NativeStackScreenProps<StackParamList, "review">

const Review = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets()

    const { placeId, placeName } = route.params

    const handleGoBack = () => {
        navigation.goBack()
    }

    const [rating, setRating] = useState(3)
    const [content, setContent] = useState(`${new Date()}`)
    const [images, setImages] = useState<string[]>([
        "file:///Users/winter/Library/Developer/CoreSimulator/Devices/7B035964-4F12-46E3-AD9B-3142780AC69D/data/Containers/Data/Application/CF795AFC-B443-45C9-B1FD-F89E5C1DF5E9/Library/Caches/ExponentExperienceData/%2540anonymous%252FFrontend-44d3e110-6f16-48a0-9027-915aa21ca492/ImagePicker/34588CCF-F7C4-40F0-A865-1A08E553180F.jpg",
        "file:///Users/winter/Library/Developer/CoreSimulator/Devices/7B035964-4F12-46E3-AD9B-3142780AC69D/data/Containers/Data/Application/CF795AFC-B443-45C9-B1FD-F89E5C1DF5E9/Library/Caches/ExponentExperienceData/%2540anonymous%252FFrontend-44d3e110-6f16-48a0-9027-915aa21ca492/ImagePicker/34588CCF-F7C4-40F0-A865-1A08E553180F.jpg",
    ])

    const handlePost = () => {
        sendPost()
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: true,
            selectionLimit: 10,
        })

        if (!result.canceled) {
            const img = result.assets
            // console.log(img)

            const imageUris = img.map((item) => item.uri)
            // console.log(imageUris)
            setImages(imageUris)
        }
    }

    const sendPost = async () => {
        try {
            const result = await SecureStore.getItemAsync("key")

            const formData = new FormData()

            formData.append("rating", rating)
            formData.append("content", content)
            formData.append("placeId", placeId)

            // formData.append("files", x)

            for (let i = 0; i < images.length; i++) {
                console.log(i)
                // const response = await fetch(images[i])
                // const blob = await response.blob()
                // const fileOfBlob = new File([blob], `image${i}.jpg`)
                // formData.append("files", fileOfBlob, `image${i}.jpg`)

                formData.append("files", {
                    uri: images[i],
                    name: `image${i}.jpg`,
                    type: "image/jpeg",
                })
            }

            const x = [
                "file:///Users/winter/Library/Developer/CoreSimulator/Devices/7B035964-4F12-46E3-AD9B-3142780AC69D/data/Containers/Data/Application/CF795AFC-B443-45C9-B1FD-F89E5C1DF5E9/Library/Caches/ExponentExperienceData/%2540anonymous%252FFrontend-44d3e110-6f16-48a0-9027-915aa21ca492/ImagePicker/34588CCF-F7C4-40F0-A865-1A08E553180F.jpg",
            ]

            const r = await fetch(x[0])
            const blob = await r.blob()
            const fileOfBlob = new File([blob], `image${0}.jpg`)
            // formData.append("files", fileOfBlob)

            console.log("formData", formData)
            console.log(images)

            const response = await axios.post(`${API_URL}/review`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    authorization: result,
                },
            })
            // console.log("POST RESPONSE: " + JSON.stringify(response))
        } catch (error) {
            console.log("error", error)
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data)
            }
        }
    }

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
                        <Text className="text-[16px] font-bold">รูปภาพ</Text>

                        <View className="flex flex-row mt-[8px]">
                            {images &&
                                images.map((uri, index) => {
                                    // console.log(index, uri)
                                    return (
                                        <Image
                                            source={{ uri: uri }}
                                            className="rounded w-[80px] h-[80px] mr-[8px]"
                                        />
                                    )
                                })}
                            <ImageUploader onPress={pickImage} />
                        </View>
                    </View>

                    <View className="p-[16px]  flex flex-col border-t border-[#D9D9D9]">
                        <Text className="text-[16px] font-bold">
                            คะแนนของคุณ
                        </Text>
                        <View className="mt-[8px] items-center">
                            <Star rating={0} size="large" width="w-[300px]" />
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
                <ButtonCustom title="โพสต์" onPress={handlePost} />
            </View>
        </View>
    )
}

export default Review
