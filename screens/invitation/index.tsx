import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import axios, { AxiosResponse } from "axios";

import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";

import { Socket, io } from "socket.io-client";

// ====================== type ======================

import { StackParamList } from "../../interface/navigate";
import { GetMember, MemberData } from "../../interface/invitation";

// ====================== context ======================

import { AuthData } from "../../contexts/authContext";

// ====================== svg ======================

import ArrowLeft from "../../assets/invitation/Arrow_left.svg";
import FirstInvite from "../../assets/invitation/firstInvite.svg";
import SecondInvite from "../../assets/invitation/inviteMoreThanOne.svg";
import HalfArrowRight from "../../assets/invitation/HalfArrowRight.svg";

// ====================== component ======================

import ConfirmModal from "../../components/confirmModal";
import UserCard from "../../components/invitation/userCard";
import ButtonCustom from "../../components/button";

import { CalendarRange, RangeDatepicker } from "@ui-kitten/components";

// ====================== const ======================

import { API_URL } from "@env";
import { DISBANDGROUP, LEAVEGROUP, REMOVEFRIEND } from "../../utils/const";

type Props = NativeStackScreenProps<StackParamList, "invitation">;

const Invitation = ({ route, navigation }: Props) => {
  const { userId, token } = useContext(AuthData);

  const insets = useSafeAreaInsets();

  const { tripId } = route.params;

  const prefix = Linking.createURL("/");

  // ====================== useState ======================

  const [displayMember, setDisplayMember] = useState<MemberData[]>([]);
  const [ownerOfTrip, setOwnerOfTrip] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");

  const [displayUrlModal, setDisplayUrlModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    display: false,
    type: "",
    userId: "",
    name: "",
  });

  const [dateRange, setDateRange] = useState<CalendarRange<Date>>({});

  const [filterDate, setFilterDate] = useState<
    { start: string; end: string }[]
  >([]);

  // ====================== useEffect ======================

  useFocusEffect(
    useCallback(() => {
      const socket = io(`${API_URL}`, {
        transports: ["websocket"],
      });
      handleSocket(socket);

      // get data of user
      getMember();

      return () => {
        socket.disconnect();
        console.log("didnt focus");
      };
    }, [tripId])
  );

  useEffect(() => {
    if (displayMember.length !== 0) {
      calculateFreeDateMatches();
    }
  }, [displayMember]);

  // ====================== function ======================

  const handleSocket = (socket: Socket) => {
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

    socket.on("updateStage", (data: { stage: string }) => {
      if (data.stage === "placeSelect") {
        navigation.navigate("placeSelect", {
          tripId: tripId,
        });
      }
    });

    socket.on("updateTripDate", (data: { start: string; end: string }) => {
      if (data.start !== "" && data.end !== "") {
        setDateRange({
          startDate: new Date(data.start),
          endDate: new Date(data.end),
        });
      } else {
        setDateRange({});
      }
    });

    socket.on("removeGroup", () => {
      navigation.navigate("tab");
    });
  };

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

      if (response.data.date.start !== "" && response.data.date.end !== "") {
        setDateRange({
          startDate: new Date(response.data.date.start),
          endDate: new Date(response.data.date.end),
        });
      } else {
        setDateRange({});
      }

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

  const calculateFreeDateMatches = async () => {
    try {
      const allDate: { start: string; end: string }[][] = [];
      displayMember.forEach((item) => {
        allDate.push(item.date);
      });

      let arrayDate = allDate[0] || [];

      for (let i = 0; i < allDate.length - 1; i++) {
        const copyArrayDate = [...arrayDate];
        arrayDate = [];
        for (let j = 0; j < copyArrayDate.length; j++) {
          const firstDateStart = new Date(copyArrayDate[j].start);
          const firstDateEnd = new Date(copyArrayDate[j].end);
          for (let z = 0; z < allDate[i + 1].length; z++) {
            const secondDateStart = new Date(allDate[i + 1][z].start);
            const secondDateEnd = new Date(allDate[i + 1][z].end);
            // check did date intersect
            if (
              firstDateStart <= secondDateEnd &&
              firstDateEnd >= secondDateStart
            ) {
              // Find the minimum date end
              const minDate =
                secondDateEnd <= firstDateEnd ? secondDateEnd : firstDateEnd;

              // Find the maximum date start
              const maxDate =
                secondDateStart >= firstDateStart
                  ? secondDateStart
                  : firstDateStart;

              arrayDate.push({
                start: maxDate.toDateString(),
                end: minDate.toDateString(),
              });
            }
          }
        }
      }

      // reset value if date change and current date didnt in filter
      let reset = true;

      arrayDate.forEach((range) => {
        if (dateRange.startDate && dateRange.endDate) {
          if (
            new Date(range.start) <= dateRange.startDate &&
            new Date(range.end) >= dateRange.endDate
          ) {
            reset = false;
          }
        }
      });

      if (reset || arrayDate.length === 0) {
        await axios.post(
          `${API_URL}/trip/date`,
          {
            tripId,
            start: "",
            end: "",
          },
          {
            headers: {
              authorization: token,
            },
          }
        );
      }

      setFilterDate(arrayDate);
    } catch (err) {
      console.log("calculateFreeDateMatches", err);
    }
  };

  const handleDatePickerFilter = (date: Date) => {
    let result = false;
    filterDate.forEach((range) => {
      if (new Date(range.start) <= date && new Date(range.end) >= date) {
        result = true;
      }
    });
    return result;
  };

  const onSelectDatePicker = async (range: CalendarRange<Date>) => {
    try {
      setDateRange({ startDate: range.startDate, endDate: range.endDate });

      if (range.startDate && range.endDate) {
        await axios.post(
          `${API_URL}/trip/date`,
          {
            tripId,
            start: range.startDate.toDateString(),
            end: range.endDate.toDateString(),
          },
          {
            headers: {
              authorization: token,
            },
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const showDatePicker = () => {
    let validate = new Array(displayMember.length).fill(0);

    for (let i = 0; i < displayMember.length; i++) {
      displayMember[i].date.forEach((range) => {
        if (validate[i] !== 1 && range.start !== "" && range.end !== "") {
          validate[i] = 1;
        }
      });
    }
    return validate.every((item) => item === 1);
  };

  const onPressNextButton = async () => {
    try {
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
          {/* date picker for trip */}
          {showDatePicker() && (
            <View
              className={`${
                ownerOfTrip ? "h-[87px]" : "h-[120px]"
              } bg-white px-[16px] pt-[16px] flex-col`}
            >
              <Text className="text-[16px] mb-[10px]">
                ช่วงเวลาที่ว่างตรงกัน
              </Text>
              <View className=" self-center ">
                <RangeDatepicker
                  range={dateRange}
                  onSelect={onSelectDatePicker}
                  style={{ width: 256 }}
                  filter={handleDatePickerFilter}
                  disabled={!ownerOfTrip}
                  placeholder={() => (
                    <View className="flex-row items-center">
                      <Text className="text-[#00000040] w-[91px]">
                        วันเริ่มต้น
                      </Text>
                      <HalfArrowRight />
                      <Text className="text-[#00000040]">วันสุดท้าย</Text>
                    </View>
                  )}
                />
              </View>
            </View>
          )}
          {/* button go to next stage */}
          {ownerOfTrip && (
            <View className="h-[100px] bg-[#FFF] p-[16px] flex-row justify-center">
              <ButtonCustom
                width="w-[351px]"
                title="ต่อไป"
                disable={Object.keys(dateRange).length === 0}
                onPress={onPressNextButton}
              />
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
