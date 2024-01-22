import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { View, Text, Button } from "react-native";
import * as Clipboard from "expo-clipboard";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
// ====================== type ======================

import { StackParamList } from "../../interface/navigate";

import axios, { AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";
import * as Linking from "expo-linking";

import { Socket, io } from "socket.io-client";
import { API_URL } from "@env";

type Props = NativeStackScreenProps<StackParamList, "invitation">;

const Invitation = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const { tripId } = route.params;

  const prefix = Linking.createURL("/");

  useFocusEffect(
    useCallback(() => {
      const socket = io(`${API_URL}`, {
        transports: ["websocket"],
      });
      setCurrentSocket(socket);
      socket.on("connect", () => {
        console.log("connect");
      });

      socket.on("connect_error", (error) => {
        console.log("Socket Error", error.message);
      });

      socket.on("updateMember", (data) => {
        console.log("updateMember : ", data);
      });

      // get data of user
      getMember();

      return () => {
        socket.disconnect();
        console.log("didnt focus");
      };
    }, [tripId])
  );

  // ====================== useState ======================

  const [displayMember, setDisplayMember] = useState([]);
  const [currentSocket, setCurrentSocket] = useState<any>();
  const [currentTripId, setCurrentTripId] = useState(tripId ? tripId : "");
  const [owner, setOwner] = useState(false);

  useEffect(() => {
    if (currentTripId && currentSocket) {
      currentSocket.emit("joinTrip", currentTripId);
    }
  }, [currentTripId]);

  // ====================== function ======================

  const getMember = async () => {
    try {
      console.log(tripId);
      const token = await SecureStore.getItemAsync("key");
      //  add response type
      const response = await axios.get(`${API_URL}/trip/information`, {
        params: { tripId: tripId, type: "member" },
        headers: {
          authorization: token,
        },
      });
      setOwner(response.data.owner);
      setDisplayMember(response.data.data);
    } catch (err) {
      console.log({ error: err });
    }
  };

  const getInvitationLink = async () => {
    try {
      const token = await SecureStore.getItemAsync("key");
      const response: AxiosResponse<{ inviteLink: string }> = await axios.get(
        `${API_URL}/trip/invitation`,
        {
          params: { tripId: currentTripId },
          headers: {
            authorization: token,
          },
        }
      );
      // copy to Clipboard
      await Clipboard.setStringAsync(
        prefix + "inviteVerify/" + response.data.inviteLink
      );
    } catch (err) {
      console.log({ error: err });
    }
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="flex-1 bg-[#FFF]"
    >
      <View className="h-[80px] p-[16px] bg-[#FFF] justify-between flex-row items-end">
        <Text>icon</Text>
        <Text className="text-[24px] font-bold">
          เลือกวันที่จะเดินทางท่องเที่ยว
        </Text>
      </View>

      <View className="grow bg-[#EEEEEE]"></View>
      <Button
        title="goback"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Text>Invitation</Text>
      <Button title="invite link" onPress={getInvitationLink} />
      {displayMember.map((user) => (
        <View className="h-[20px] m-[20px] bg-yellow-100" key={user.userId}>
          <Text>{user.userId}</Text>
        </View>
      ))}
    </View>
  );
};

export default Invitation;
