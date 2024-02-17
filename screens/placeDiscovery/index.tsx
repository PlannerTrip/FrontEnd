import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useContext, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackParamList } from "../../interface/navigate";
import { AuthData } from "../../contexts/authContext";

// ====================== svg ======================

import ArrowLeft from "../../assets/invitation/Arrow_left.svg";

import axios from "axios";
import { API_URL } from "@env";
import { Socket, io } from "socket.io-client";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "react-native";

type Props = NativeStackScreenProps<StackParamList, "placeDiscovery">;

const PlaceDiscovery = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const { userId, token } = useContext(AuthData);
  const { tripId } = route.params;

  const suggest = "suggest";
  const bookmark = "bookmark";
  const [currentTab, setCurrentTab] = useState(suggest);

  // ====================== useFocusEffect ======================

  useFocusEffect(
    useCallback(() => {
      const socket = io(`${API_URL}`, {
        transports: ["websocket"],
      });
      handleSocket(socket);

      // get place

      return () => {
        socket.disconnect();
        console.log("didnt focus");
      };
    }, [tripId])
  );

  // ====================== function ======================

  const handleSocket = (socket: Socket) => {
    socket.on("connect", () => {
      console.log("connect");
    });

    socket.emit("joinTrip", tripId);

    socket.on("connect_error", (error) => {
      console.log("Socket Error", error.message);
    });
  };

  const onPressBack = () => {
    navigation.navigate("placeSelect", { tripId });
  };

  return (
    <>
      <View
        style={{
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
        className="bg-[#FFF] h-[100%]"
      >
        {/* header */}
        <View className="h-[80px] items-end px-[16px] pt-[16px] bg-[#FFF]  flex-row justify-between">
          <Pressable onPress={onPressBack} className="mb-[16px]">
            <ArrowLeft />
          </Pressable>
          {/* tab */}
          <View className="w-[262px] h-[80px] items-end flex-row justify-between">
            <Pressable
              onPress={() => {
                setCurrentTab(suggest);
              }}
              className={`w-[123px] h-[48px] ${
                currentTab === suggest ? "border-b-[2px] border-[#FFC502]" : ""
              } flex justify-center items-center`}
            >
              <Text
                className={`${
                  currentTab === suggest ? "text-[#FFC502] " : ""
                } font-bold`}
              >
                แนะนำ
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setCurrentTab(bookmark);
              }}
              className={`w-[123px] h-[48px]    flex justify-center items-center  ${
                currentTab === bookmark ? "border-b-[2px] border-[#FFC502]" : ""
              }`}
            >
              <Text
                className={` ${
                  currentTab === bookmark ? "text-[#FFC502] " : ""
                } font-bold`}
              >
                บุ๊กมาร์ก
              </Text>
            </Pressable>
          </View>
          <Pressable className="mb-[16px]">
            <Image source={require("../../assets/placeDiscovery/search.png")} />
          </Pressable>
        </View>
        {/* content */}
        <ScrollView className="bg-[#F5F5F5]"></ScrollView>
      </View>
    </>
  );
};

export default PlaceDiscovery;
