import React, { useCallback, useState } from "react"
import {
    View,
    Text,
    Image,
    Pressable,
    Dimensions,
    FlatList,
} from "react-native"

const ImageFlatList = ({ data }: { data: string[] }) => {
    const data2 = [
        "https://tatapi.tourismthailand.org/tatfs/Image/custompoi/picture/P03000001_1.jpg",
        "https://tatapi.tourismthailand.org/tatfs/Image/custompoi/picture/P03000001_2.jpg",
        "https://tatapi.tourismthailand.org/tatfs/Image/custompoi/picture/P03000001_3.jpg",
        "https://tatapi.tourismthailand.org/tatfs/Image/custompoi/picture/P03000001_4.jpg",
        "https://tatapi.tourismthailand.org/tatfs/Image/custompoi/picture/P03000001_5.jpg",
    ]
    const renderItem = ({ item }: { item: string }) => (
        <View className="w-[430px] h-[400px]  bg-green-300">
            <View className={`h-[332px] w-[100%]`}>
                <Image
                    source={{
                        uri: item,
                    }}
                    style={{ height: "100%", width: "100%" }}
                />
            </View>
        </View>
    )

    return (
        <View>
            <Text> {data}</Text>
            <FlatList
                data={data2}
                keyExtractor={(item) => item}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                // className="absolute"
            />
            <View className="flex flex-row gap-[3px]">
                {data.map((item) => {
                    return (
                        <View className="w-[5px] h-[5px] rounded-[1px] bg-[#00000033]"></View>
                    )
                })}
            </View>
        </View>
    )
}

export default ImageFlatList
