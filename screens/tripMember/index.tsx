import React, { useCallback, useContext, useState } from "react";
import { View,ScrollView } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { StackParamList } from "../../interface/navigate";
import { MemberData } from "../../interface/invitation";

import { AuthData } from "../../contexts/authContext";


import Header from "../../components/tripCreate/Header";
import MemberCard from "../../components/tripMember/memberCard";
import InviteButton from "../../components/invitation/inviteButton";
import BackgroundModal from "../../components/backGroundModal";
import UrlModal from "../../components/invitation/urlModal";


import axios, { AxiosResponse } from "axios";

import { API_URL } from "@env";

import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { Socket, io } from "socket.io-client";

type Props = NativeStackScreenProps<StackParamList, "tripMember">;

const TripMember = ({ navigation, route }: Props) => {
  const prefix = Linking.createURL("/");
  const insets = useSafeAreaInsets();

  const { tripId, member } = route.params;

  const { userId, token } = useContext(AuthData);

  const [inviteUrl, setInviteUrl] = useState("");
  const [displayMember, setDisplayMember] = useState(member);
  const [displayUrlModal, setDisplayUrlModal] = useState(false);

  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        const socket = io(`${API_URL}`, {
          transports: ["websocket"],
        });
        handleSocket(socket);

        return () => {
          socket.disconnect();
          console.log("didnt focus");
        };
      }
    }, [tripId, isFocused]),
  );

  const handleSocket = (socket: Socket) => {
    socket.on("connect", () => {
      console.log("connect");
    });

    socket.emit("joinTrip", tripId);

    socket.on("removeMember", (data: { userId: string }) => {
      setDisplayMember((displayMember) =>
        displayMember.filter((user) => user.userId !== data.userId),
      );
    });

    socket.on("addMember", (data: { data: MemberData }) => {
      console.log(data.data);
      setDisplayMember((displayMember) => [
        ...displayMember,
        {
          userId: data.data.userId,
          username: data.data.username,
          userprofile: data.data.profileUrl,
        },
      ]);
    });

    socket.on("connect_error", (error) => {
      console.log("Socket Error", error.message);
    });
  };

  const onPressBack = () => {
    navigation.navigate("tripSummary", { tripId: tripId });
  };

  const getInvitationLink = async () => {
    try {
      const response: AxiosResponse<{ inviteLink: string }> = await axios.get(
        `${API_URL}/trip/invitation`,
        {
          params: { tripId: tripId },
          headers: {
            authorization: token,
          },
        },
      );

      const url = prefix + "inviteVerify/" + response.data.inviteLink;
      setInviteUrl(url);
      // copy to Clipboard
      await Clipboard.setStringAsync(url);
      setDisplayUrlModal(true);
    } catch (err) {
      console.log({ error: err });
    }
  };

  return (
    <>
      <View
        className="bg-[#FFF] h-[100%]"
        style={{
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        <Header onPressBack={onPressBack} title="สมาชิก" />
        <ScrollView className=" bg-[#EEEEEE]   ">
          <View className="flex items-center">
            {displayMember.map((user) => (
              <MemberCard
                key={user.userId}
                profileUrl={user.userprofile}
                username={user.username}
              />
            ))}
            <InviteButton
              getInvitationLink={getInvitationLink}
              length={displayMember.length}
            />
          </View>
        </ScrollView>
      </View>
      {displayUrlModal && (
        <BackgroundModal>
          <UrlModal
            onPressConfirm={() => {
              setDisplayUrlModal(false);
            }}
            inviteUrl={inviteUrl}
            length={displayMember.length}
          />
        </BackgroundModal>
      )}
    </>
  );
};

export default TripMember;
