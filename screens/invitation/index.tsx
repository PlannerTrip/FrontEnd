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

  const { inviteLink, tripId } = route.params;

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

      if (inviteLink) {
        verifyInviteLink(inviteLink);
      } else if (tripId) {
        // get data of user
        getMember(tripId);
      }

      return () => {
        socket.disconnect();
        console.log("didnt focus");
      };
    }, [inviteLink, tripId])
  );

  // ====================== useState ======================

  const [displayMember, setDisplayMember] = useState([]);
  const [currentSocket, setCurrentSocket] = useState<any>();
  const [currentTripId, setCurrentTripId] = useState(tripId ? tripId : "");

  useEffect(() => {
    if (currentTripId && currentSocket) {
      currentSocket.emit("joinTrip", currentTripId);
    }
  }, [currentTripId]);

  // ====================== function ======================

  const getMember = async (id: string) => {
    try {
      const token = await SecureStore.getItemAsync("key");
      //  add response type
      const response = await axios.get(`${API_URL}/trip/information`, {
        params: { tripId: id, type: "member" },
        headers: {
          authorization: token,
        },
      });
      setDisplayMember(response.data);
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
        prefix + "invitation/" + response.data.inviteLink
      );
    } catch (err) {
      console.log({ error: err });
    }
  };

  const verifyInviteLink = async (inviteCode: string) => {
    try {
      const token = await SecureStore.getItemAsync("key");
      const response = await axios.get(`${API_URL}/trip/verifyInvitation`, {
        params: { inviteLink: inviteCode },
        headers: {
          authorization: token,
        },
      });

      setDisplayMember(response.data.member);
      setCurrentTripId(response.data.tripId);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data);
      }
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
    >
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
