import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useContext, useState } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View, Text, Pressable, ScrollView } from "react-native";
import { StackParamList } from "../../interface/navigate";
import { AuthData } from "../../contexts/authContext";

// ====================== svg ======================

import ArrowLeft from "../../assets/invitation/Arrow_left.svg";

import ButtonCustom from "../../components/button";
import axios, { AxiosResponse } from "axios";
import { API_URL } from "@env";
import { Socket, io } from "socket.io-client";
import Loading from "../Loading";
import { LOADING, SUCCESS } from "../../utils/const";

type Props = NativeStackScreenProps<StackParamList, "planSelect">;

const PlanSelect = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const { userId, token } = useContext(AuthData);

  const { tripId } = route.params;

  const [owner, setOwner] = useState(false);
  const [plan, setPlan] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    display: false,
    placeId: "",
    placeName: "",
  });
  const [status, setStatus] = useState(SUCCESS);

  const isFocused = useIsFocused();

  // ====================== useFocusEffect ======================

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        // setStatus(LOADING);
        setPlan([]);
        const socket = io(`${API_URL}`, {
          transports: ["websocket"],
        });
        handleSocket(socket);

        // get place
        return () => {
          socket.disconnect();
          console.log("didnt focus");
        };
      }
    }, [tripId, isFocused])
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
      if (data.stage === "placeSelect") {
        navigation.navigate("placeSelect", {
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
            stage: "placeSelect",
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
            เลือวันท่องเที่ยว
          </Text>
        </View>
        {/* content */}
        {status === LOADING ? (
          <View
            className={`bg-[#F5F5F5] grow flex justify-center items-center`}
          >
            <Loading />
          </View>
        ) : (
          <ScrollView className=" bg-[#EEEEEE]  ">
            {/* add button */}
          </ScrollView>
        )}
        {/* footer */}
        <View
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
        >
          <View></View>
          {/* button go to next stage */}

          <View className="h-[100px] bg-[#FFF] p-[16px] flex-row justify-center">
            <ButtonCustom
              width="w-[351px]"
              title="ต่อไป"
              disable={false}
              onPress={() => {}}
            />
          </View>
        </View>
      </View>
      {confirmModal.display && (
        <View className="absolute bg-[#0000008C] w-[100%] h-[100%] flex-col justify-center items-center "></View>
      )}
    </>
  );
};

export default PlanSelect;
