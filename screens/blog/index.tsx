import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackParamList } from "../../interface/navigate";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import Edit from "../../assets/blog/edit.svg";

type Props = NativeStackScreenProps<StackParamList, "blog">;

const Blog = ({ route, navigation }: Props) => {
    const insets = useSafeAreaInsets();
    return (
        <View
            style={{
                paddingTop: insets.top,
                // paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }}
            className="bg-[#FFFFFF] h-[100%] w-[100%] overflow-scroll"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                bounces={false}
            ></ScrollView>
            <View
                className="absolute"
                style={{ right: insets.right, bottom: 0 }}
            >
                <Edit
                    onPress={() => {
                        navigation.navigate("writeBlog");
                    }}
                />
            </View>
        </View>
    );
};

export default Blog;
