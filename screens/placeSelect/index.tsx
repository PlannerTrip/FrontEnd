import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useContext, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackParamList } from "../../interface/navigate";
import { AuthData } from "../../contexts/authContext";

// ====================== svg ======================

import ArrowLeft from "../../assets/invitation/Arrow_left.svg";
import Plus from "../../assets/placeSelect/plus.svg";

import ButtonCustom from "../../components/button";
import axios from "axios";
import { API_URL } from "@env";
import { Socket, io } from "socket.io-client";
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<StackParamList, "placeSelect">;

const PlaceSelect = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const { userId, token } = useContext(AuthData);
  const { tripId } = route.params;

  const [owner, setOwner] = useState(true);

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
    socket.on("updateStage", (data: { stage: string }) => {
      if (data.stage === "invitation") {
        navigation.navigate("invitation", {
          tripId: tripId,
        });
      }
    });
  };

  const onPressBack = async () => {
    try {
      if (owner) {
        await axios.post(
          `${API_URL}/trip/stage`,
          {
            tripId,
            stage: "invitation",
          },
          {
            headers: {
              authorization: token,
            },
          }
        );
      } else {
        // user click show modal confirm leave trip
      }
    } catch (err) {}
  };

  const onPressNextButton = () => {};

  const onPressAddPlace = () => {
    navigation.navigate("placeDiscovery", { tripId });
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
        <View className="h-[80px] p-[16px] bg-[#FFF]  flex-row items-end ">
          <Pressable onPress={onPressBack}>
            <ArrowLeft />
          </Pressable>
          <Text className="text-[24px] font-bold h-[40px] ml-[8px]">
            เลือกสถานที่ท่องเที่ยว
          </Text>
        </View>
        {/* content */}
        <ScrollView className=" bg-[#EEEEEE] p-[16px]">
          <View></View>
          {/* add button */}
          <Pressable onPress={onPressAddPlace}>
            <View className="border border-[#FFC502] rounded flex-row justify-center items-center h-[48px] bg-[#FFF]">
              <Plus />
              <Text className="ml-[4px] text-[#FFC502] font-bold">
                เพิ่มสถานที่ท่องเที่ยว
              </Text>
            </View>
          </Pressable>
        </ScrollView>
        {/* footer */}
        <View
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
        >
          {/* button go to next stage */}

          <View className="h-[100px] bg-[#FFF] p-[16px] flex-row justify-center">
            <ButtonCustom
              width="w-[351px]"
              title="ต่อไป"
              disable={true}
              onPress={onPressNextButton}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default PlaceSelect;
