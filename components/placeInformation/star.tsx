import React from "react";
import { View, Image, Pressable } from "react-native";

const Star = ({
    rating,
    size = "middle",
    width = "",
    setRating = () => {},
}: {
    rating: number;
    size?: string;
    width?: string;
    setRating?: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const renderStar = () => {
        const starSizeStyleLarge = { width: 40, height: 40 };
        const starSizeStyleMiddle = { width: 22, height: 22 };
        const starSizeStyleSmall = { width: 16, height: 16 };

        const starFull = require("../../assets/placeInformation/StarFull.png");
        const starHalf = require("../../assets/placeInformation/StarHalf.png");
        const starNone = require("../../assets/placeInformation/StarNone.png");

        const handleSize = () => {
            if (size === "large") {
                return starSizeStyleLarge;
            } else if (size === "middle") {
                return starSizeStyleMiddle;
            } else {
                return starSizeStyleSmall;
            }
        };

        const handleStar = (n: number) => {
            if (rating < n - 0.5) {
                return starNone;
            } else if (rating < n) {
                return starHalf;
            }
            return starFull;
        };

        return (
            <View className={`flex flex-row justify-between ${width}`}>
                <Pressable
                    onPress={() => {
                        setRating(1);
                    }}
                >
                    <Image source={handleStar(1)} style={handleSize()} />
                </Pressable>
                <Pressable
                    onPress={() => {
                        setRating(2);
                    }}
                >
                    <Image source={handleStar(2)} style={handleSize()} />
                </Pressable>
                <Pressable
                    onPress={() => {
                        setRating(3);
                    }}
                >
                    <Image source={handleStar(3)} style={handleSize()} />
                </Pressable>
                <Pressable
                    onPress={() => {
                        setRating(4);
                    }}
                >
                    <Image source={handleStar(4)} style={handleSize()} />
                </Pressable>
                <Pressable
                    onPress={() => {
                        setRating(5);
                    }}
                >
                    <Image source={handleStar(5)} style={handleSize()} />
                </Pressable>
            </View>
        );
    };
    return <View className="flex flex-row">{renderStar()}</View>;
};

export default Star;
