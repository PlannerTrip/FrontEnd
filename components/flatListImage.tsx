import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { View, Image, FlatList } from "react-native";
import PlaceImage from "../assets/defaultPlaceImage.svg";

const FlatListImage = ({
    item = [],

    width = 430,
    height = 332,
    indicator = 16,
    gradient = true,
}: {
    item: string[];

    width?: number;
    height?: number;
    indicator?: number;
    gradient?: boolean;
}) => {
    const [currentPage, setCurrentPage] = useState(0);

    const renderItem = ({ item }: { item: string }) => {
        return (
            <View
                key={item}
                style={{
                    alignItems: "center",
                    width: width,
                    height: height,
                    justifyContent: "center",
                    backgroundColor: "#ECECEC",
                }}
            >
                {item !== "" ? (
                    <Image
                        source={{
                            uri: item,
                        }}
                        className="w-[100%] h-[100%]"
                    />
                ) : (
                    <View className="mt-[30px]">
                        <PlaceImage />
                    </View>
                )}

                {gradient && (
                    <LinearGradient
                        className="w-[100%] h-[100%] absolute  "
                        colors={[
                            "rgba(255, 255, 255, 0)",
                            "rgba(0, 0, 0, 0.5)",
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                    ></LinearGradient>
                )}
            </View>
        );
    };

    return (
        <View>
            <FlatList
                data={item}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                    const offsetX = e.nativeEvent.contentOffset.x;
                    const page = Math.floor(offsetX / width);
                    setCurrentPage(page < 0 ? 0 : page);
                }}
                bounces={false}
            />
            {item && item.length > 1 && (
                <View
                    style={{
                        position: "absolute",
                        flexDirection: "row",
                        left: indicator,
                        bottom: 4,
                    }}
                >
                    {item.map((item, index) => {
                        return (
                            <View
                                key={index}
                                style={{
                                    width: currentPage === index ? 15 : 5,
                                    height: 5,
                                    borderRadius: 3,
                                    backgroundColor:
                                        currentPage === index
                                            ? "white"
                                            : "gray",
                                    marginLeft: 4,
                                }}
                            ></View>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

export default FlatListImage;
