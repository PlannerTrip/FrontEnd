import React, { useContext, useState } from "react";
import { View, Dimensions, Text, Pressable } from "react-native";
import Profile from "../profile";
import Star from "./star";
import FlatListImage from "../flatListImage";

import HeartNone from "../../assets/placeInformation/HeartNone.svg";
import HeartFill from "../../assets/placeInformation/HeartFill.svg";
import Bin from "../../assets/placeInformation/Bin.svg";

import * as SecureStore from "expo-secure-store";
import { API_URL } from "@env";
import axios from "axios";

import { AuthData } from "../../contexts/authContext";
import Modal from "../modal";
import ConfirmModal from "../confirmModal";

const Review = ({
    username,
    ownerId,
    profileUrl,
    rating,
    createDate,
    content,
    img = [""],
    totalLike,
    alreadyLike,
    reviewId,
    handleDeleteReview,
}: {
    username: string;
    ownerId: string;
    profileUrl?: string;
    rating: number;
    createDate: Date;
    content: string;
    img?: string[];
    totalLike: number;
    alreadyLike: boolean;
    reviewId: string;
    handleDeleteReview: (reviewId: string) => void;
}) => {
    const convertDateFormat = (originalDateString: Date) => {
        const originalDate = new Date(originalDateString);

        const year = originalDate.getFullYear();
        const month = (originalDate.getMonth() + 1).toString().padStart(2, "0");
        const day = originalDate.getDate();

        const formattedDateString = `${day}/${month}/${year + 543}`;

        return formattedDateString;
    };

    const { width, height } = Dimensions.get("screen");

    const { userId, token } = useContext(AuthData);

    const [liked, setLiked] = useState(alreadyLike);
    const [likedCount, setLikeCount] = useState(totalLike);

    const postLikeReview = async () => {
        try {
            const response = await axios.post(
                `${API_URL}/review/like`,
                { reviewId: reviewId },
                {
                    headers: {
                        authorization: token,
                    },
                }
            );
            console.log(alreadyLike);
            console.log(response.data.message);
            if (response.data.message === "Like success") {
                setLiked(true);
                setLikeCount(likedCount + 1);
            } else if (response.data.message === "Unlike success") {
                setLiked(false);
                setLikeCount(likedCount - 1);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data);
            }
        }
    };

    return (
        <View className="py-[16px] border-b-[0.5px] border-[#ABABB4] px-[8px]">
            <Profile username={username} profileUrl={profileUrl} />

            <View className="mt-[4px] flex flex-row items-center">
                <Star rating={rating} size="small" />
                <Text className="text-[#9898AA] ml-[10px] tex-[12px]">
                    {convertDateFormat(createDate)}
                </Text>
            </View>

            <View className="my-[12px]">
                <Text className="text-[12px]">{content}</Text>
            </View>

            <View>
                <FlatListImage
                    item={img}
                    height={200}
                    width={width - 16 - 32}
                    indicator={4}
                    gradient={false}
                />
            </View>

            <View className="flex flex-row justify-between mt-[8px]">
                <View className="flex flex-row">
                    <Pressable onPress={postLikeReview}>
                        {liked ? <HeartFill /> : <HeartNone />}
                    </Pressable>
                    <Text className="text-[12px] leading-[18px] ml-[4px]">
                        {likedCount}
                    </Text>
                </View>

                {ownerId === userId && (
                    <Bin onPress={() => handleDeleteReview(reviewId)} />
                )}
            </View>
        </View>
    );
};

export default Review;
