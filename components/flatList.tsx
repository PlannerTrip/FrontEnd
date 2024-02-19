import { LinearGradient } from "expo-linear-gradient"
import React, { useState } from "react"
import { View, Image, FlatList } from "react-native"

const FlatListCustom = ({
    item,
    marginTop = 0,
    width = 430,
    height = 332,
    indicator = 16,
}: {
    item: string[]
    marginTop?: number
    width?: number
    height?: number
    indicator?: number
}) => {
    const [currentPage, setCurrentPage] = useState(0)

    console.log(item)

    const renderItem = ({ item }: { item: string }) => (
        <View
            style={{
                marginTop: marginTop,
                alignItems: "center",
                width: width,
                height: height,
            }}
        >
            <Image
                source={{
                    uri: item,
                }}
                className="w-[100%] h-[100%]"
            />

            <LinearGradient
                className="w-[100%] h-[100%] absolute  "
                colors={["rgba(255, 255, 255, 0)", "rgba(0, 0, 0, 0.5)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            ></LinearGradient>
        </View>
    )
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={item}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                    const offsetX = e.nativeEvent.contentOffset.x
                    const page = Math.floor(offsetX / width)
                    setCurrentPage(page < 0 ? 0 : page)
                }}
            />
            {item.length > 1 && (
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
                        )
                    })}
                </View>
            )}
        </View>
    )
}

export default FlatListCustom
