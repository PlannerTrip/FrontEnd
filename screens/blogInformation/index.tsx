import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackParamList } from "../../interface/navigate";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "react-native";
import Edit from "../../assets/blog/edit.svg";
import {
  LOADING,
  RECENT,
  RECENT_LABEL,
  RECOMMEND,
  RECOMMEND_LABEL,
} from "../../utils/const";

type Props = NativeStackScreenProps<StackParamList, "blogInformation">;

const BlogInformation = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const { blogId } = route.params;

  const [status, setStatus] = useState(LOADING);

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
        className="p-[16px]"
      >
        <Text>{blogId}</Text>
      </ScrollView>
    </View>
  );
};

export default BlogInformation;
