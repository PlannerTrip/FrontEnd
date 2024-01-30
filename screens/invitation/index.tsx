import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { View, Text, Button, Pressable } from "react-native";
import * as Clipboard from "expo-clipboard";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
// ====================== type ======================

import { StackParamList } from "../../interface/navigate";

import axios, { AxiosResponse } from "axios";
import * as Linking from "expo-linking";

import { Socket, io } from "socket.io-client";
import { API_URL } from "@env";
import { AuthData } from "../../contexts/authContext";

import ArrowLeft from "../../assets/invitation/Arrow_left.svg";
import FirstInvite from "../../assets/invitation/firstInvite.svg";
import SecondInvite from "../../assets/invitation/inviteMoreThanOne.svg";

import UserCard from "../../components/invitation/userCard";
import ButtonCustom from "../../components/button";

import { GetMember, MemberData } from "../../interface/invitation";
import ConfirmModal from "../../components/confirmModal";
import { DISBANDGROUP, LEAVEGROUP, REMOVEFRIEND } from "../../utils/const";
import { ScrollView } from "react-native";

type Props = NativeStackScreenProps<StackParamList, "invitation">;

const Invitation = ({ route, navigation }: Props) => {
  const { userId, token } = useContext(AuthData);

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

      socket.emit("joinTrip", tripId);

      socket.on("connect_error", (error) => {
        console.log("Socket Error", error.message);
      });

      socket.on("addMember", (data: { data: MemberData }) => {
        setDisplayMember((displayMember) => [...displayMember, data.data]);
      });

      socket.on(
        "updateDate",
        (data: { userId: string; date: { start: string; end: string }[] }) => {
          setDisplayMember((displayMember) =>
            displayMember.map((member) => {
              if (member.userId === data.userId) {
                return { ...member, date: data.date };
              } else {
                return member;
              }
            })
          );
        }
      );

      socket.on("removeMember", (data: { userId: string }) => {
        if (data.userId === userId) {
          navigation.navigate("tab");
        } else {
          setDisplayMember((displayMember) =>
            displayMember.filter((member) => member.userId !== data.userId)
          );
          if (confirmModal.userId === data.userId) {
            setConfirmModal({ display: false, name: "", type: "", userId: "" });
          }
        }
      });

      socket.on("removeGroup", () => {
        navigation.navigate("tab");
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

  const [displayMember, setDisplayMember] = useState<MemberData[]>([]);
  const [currentSocket, setCurrentSocket] = useState<Socket>();
  const [ownerOfTrip, setOwnerOfTrip] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");

  const [displayUrlModal, setDisplayUrlModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    display: false,
    type: "",
    userId: "",
    name: "",
  });

  // ====================== function ======================

  const getMember = async () => {
    try {
      const response: AxiosResponse<GetMember> = await axios.get(
        `${API_URL}/trip/information`,
        {
          params: { tripId: tripId, type: "member" },
          headers: {
            authorization: token,
          },
        }
      );
      setOwnerOfTrip(response.data.owner);
      setDisplayMember(response.data.data);
    } catch (err) {
      console.log({ error: err });
    }
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
        }
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

  const comFirmModalTitle = () => {
    if (confirmModal.type === REMOVEFRIEND) {
      return (
        <Text className="text-[16px] font-bold leading-[24px]">
          ลบ "${confirmModal.name}" ออกจากกลุ่ม
        </Text>
      );
    } else if (confirmModal.type === LEAVEGROUP) {
      return (
        <Text className="text-[16px] font-bold leading-[24px]">
          คุณกำลังจะออกจากกลุ่ม
        </Text>
      );
    } else if (confirmModal.type === DISBANDGROUP) {
      return (
        <>
          <Text className="text-[16px] font-bold leading-[24px]">
            คุณกำลังจะออกจากการสร้างทริป
          </Text>

          <Text className="text-[16px] font-bold leading-[24px]">
            ทริปของคุณกำลังจะถูกลบ
          </Text>
        </>
      );
    } else {
      return <></>;
    }
  };

  const onPressConfirmModal = async () => {
    try {
      if (confirmModal.type === REMOVEFRIEND) {
        await axios.delete(`${API_URL}/trip/member`, {
          data: { friendId: confirmModal.userId, tripId },
          headers: {
            authorization: token,
          },
        });
        setConfirmModal({
          display: false,
          userId: "",
          name: "",
          type: "",
        });
      } else if (confirmModal.type === LEAVEGROUP) {
        await axios.delete(`${API_URL}/trip/member`, {
          data: { friendId: userId, tripId },
          headers: {
            authorization: token,
          },
        });
        setConfirmModal({
          display: false,
          userId: "",
          name: "",
          type: "",
        });
      } else if (confirmModal.type === DISBANDGROUP) {
        await axios.delete(`${API_URL}/trip/`, {
          data: { tripId },
          headers: {
            authorization: token,
          },
        });
        setConfirmModal({
          display: false,
          userId: "",
          name: "",
          type: "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onPressBack = async () => {
    try {
      if (ownerOfTrip) {
        // show modal disband group
        setConfirmModal({
          display: true,
          name: "",
          type: DISBANDGROUP,
          userId: userId,
        });
      } else {
        // show modal confirm leave
        setConfirmModal({
          display: true,
          name: "",
          type: LEAVEGROUP,
          userId: userId,
        });
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
        className="flex-1 bg-[#FFF]"
      >
        {/* header */}
        <View className="h-[80px] p-[16px] bg-[#FFF]  flex-row items-end ">
          <Pressable onPress={onPressBack}>
            <ArrowLeft />
          </Pressable>
          <Text className="text-[24px] font-bold h-[40px] ml-[8px]">
            เลือกวันที่จะเดินทางท่องเที่ยว
          </Text>
        </View>

        {/* content */}
        <ScrollView className=" bg-[#EEEEEE] ">
          <View
            className="pb-[16px] px-[16px]  flex-col items-center"
            style={{ paddingBottom: insets.bottom }}
          >
            {displayMember.map((data) => (
              <UserCard
                key={data.userId}
                data={data}
                ownerOfCard={data.userId === userId}
                ownerOfTrip={ownerOfTrip}
                setConfirmModal={setConfirmModal}
                tripId={tripId}
              />
            ))}
            {/* invite button */}
            <Pressable onPress={getInvitationLink}>
              {displayMember.length === 1 ? (
                <View className="mt-[16px] h-[40px] rounded-[100px] flex-row justify-center items-center px-[16px] py-[6px] bg-[#FFC502]">
                  <FirstInvite />
                  <Text className="ml-[8px] text-white font-bold text-[16px]">
                    ชวนเพื่อน
                  </Text>
                </View>
              ) : (
                <View className="mt-[16px] h-[40px] rounded-[100px] flex-row justify-center items-center px-[16px] py-[6px] border bg-white border-[#FFC502]">
                  <SecondInvite />
                  <Text className="ml-[8px] text-[#FFC502] font-bold text-[16px]">
                    เข้าร่วม {displayMember.length}/4 คน
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
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
          {ownerOfTrip && (
            <View className="h-[100px] bg-[#FFF] p-[16px] flex-row justify-center">
              <ButtonCustom width="w-[351px]" title="ต่อไป" disable={true} />
            </View>
          )}
        </View>
      </View>

      {/*  modal */}
      {(displayUrlModal || confirmModal.display) && (
        <View className="absolute bg-[#0000008C] w-[100%] h-[100%] flex-col justify-center items-center ">
          {confirmModal.display && (
            <ConfirmModal
              title={comFirmModalTitle()}
              confirmTitle={confirmModal.type === LEAVEGROUP ? "ออก" : "ลบ"}
              onPressCancel={() => {
                setConfirmModal({
                  display: false,
                  userId: "",
                  name: "",
                  type: "",
                });
              }}
              onPressConfirm={onPressConfirmModal}
            />
          )}
          {displayUrlModal && (
            <View className="pt-[16px] bg-[#fff] rounded-lg w-[279px] px-[12px] flex-col items-center pb-[12px]">
              {displayMember.length === 1 && (
                <Text className="mb-[10px] text-[16px] font-bold">
                  ชวนเพื่อนสำเร็จแล้ว
                </Text>
              )}
              <Text className="text-[16px] mb-[28px]">{inviteUrl}</Text>
              <ButtonCustom
                title="OK"
                width="w-[255px]"
                onPress={() => {
                  setDisplayUrlModal(false);
                }}
              />
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default Invitation;
