import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useContext, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackParamList } from "../../interface/navigate";
import { AuthData } from "../../contexts/authContext";

// ====================== svg ======================

import ArrowLeft from "../../assets/invitation/Arrow_left.svg";

import ButtonCustom from "../../components/button";
import axios from "axios";
import { API_URL } from "@env";
import { Socket, io } from "socket.io-client";
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<StackParamList, "placeDiscovery">;

const PlaceDiscovery = ({ route, navigation }: Props) => {
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

  return (
    <>
      <View
        style={{
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
        className="bg-[#FFF] h-[100%]"
      ></View>
    </>
  );
};

export default PlaceDiscovery;
