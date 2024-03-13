import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useContext, useState } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios, { AxiosResponse } from "axios";
import { Socket, io } from "socket.io-client";

import { View, Text, Pressable, ScrollView } from "react-native";
import { StackParamList } from "../../interface/navigate";

import { AuthData } from "../../contexts/authContext";
import { TextInput } from "react-native-gesture-handler";

// ====================== svg ======================

import Edit from "../../assets/tripSummary/edit.svg";
import EditPlace from "../../assets/tripSummary/editPlace.svg";
import Compass from "../../assets/tripSummary/compass.svg";

// ====================== interface ======================

import { Place } from "../../interface/placeSelect";
import {
  Member,
  Plan,
  TripSummaryInformation,
} from "../../interface/tripSummary";

// ====================== component ======================

import ButtonCustom from "../../components/button";
import ConfirmModal from "../../components/confirmModal";
import Loading from "../Loading";
import Header from "../../components/tripCreate/Header";
import TextTitle from "../../components/tripCreate/TextTitle";
import MiniProfileCustom from "../../components/miniProfile";

import { API_URL } from "@env";
import { LOADING, SUCCESS } from "../../utils/const";

import { RangeDatepicker } from "@ui-kitten/components";
import PlanCard from "../../components/tripSummary/planCard";

type Props = NativeStackScreenProps<StackParamList, "tripSummary">;

const TripSummary = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const { userId, token } = useContext(AuthData);

  const { tripId } = route.params;

  const isFocused = useIsFocused();

  // ====================== useState======================

  const [owner, setOwner] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    display: false,
    title: <></>,
    confirmTitle: "",
  });

  const [status, setStatus] = useState(LOADING);
  const [plan, setPlan] = useState<Plan[]>([]);

  const [tripName, setTripName] = useState("");
  const [tripNote, setTripNote] = useState("");
  const [member, setMember] = useState<Member[]>([]);
  const [date, setDate] = useState({ start: "", end: "" });

  // ====================== useFocusEffect ======================

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        setStatus(LOADING);
        setMember([]);
        // setOwner(false)
        setOwner(true);
        const socket = io(`${API_URL}`, {
          transports: ["websocket"],
        });
        handleSocket(socket);
        getInformation();

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

    socket.on("updateName", (data: { name: string }) => {
      setTripName(data.name);
    });

    socket.on("updateNote", (data: { note: string }) => {
      setTripNote(data.note);
    });

    socket.on(
      "updatePlanTime",
      (data: { id: string; time: string; type: string }) => {
        setPlan((plan) =>
          plan.map((dailyPlan) => {
            dailyPlan.places = dailyPlan.places.map((place) => {
              if (place.placeId === data.id) {
                if (data.type === "startTime") {
                  place.startTime = data.time;
                } else {
                  place.endTime = data.time;
                }
                console.log(place);
              }
              return place;
            });

            dailyPlan.activity = dailyPlan.activity.map((activity) => {
              if (activity.activityId === data.id) {
                if (data.type === "startTime") {
                  activity.startTime = data.time;
                } else {
                  activity.endTime = data.time;
                }
              }
              return activity;
            });

            return dailyPlan;
          })
        );
      }
    );

    socket.on("removeMember", (data: { userId: string }) => {
      if (userId === data.userId) {
        navigation.navigate("tab");
      } else {
      }
    });

    socket.on("updateStage", (data: { stage: string }) => {
      if (data.stage === "planSelect") {
        navigation.navigate("planSelect", { tripId: tripId });
      }
    });
  };

  const getInformation = async () => {
    try {
      const response: AxiosResponse<TripSummaryInformation> = await axios.get(
        `${API_URL}/trip/information`,
        {
          params: { tripId: tripId, type: "all" },
          headers: {
            authorization: token,
          },
        }
      );
      setTripName(response.data.information.name);
      setTripNote(response.data.information.note);
      setMember(response.data.information.member);
      setDate(response.data.information.date);
      setPlan(response.data.plan);
      setStatus(SUCCESS);
    } catch (err) {
      console.log(err);
    }
  };

  const onPressBack = async () => {
    try {
      if (owner) {
        await axios.post(
          `${API_URL}/trip/stage`,
          {
            tripId,
            stage: "planSelect",
          },
          {
            headers: {
              authorization: token,
            },
          }
        );
      } else {
        setConfirmModal({
          display: false,
          title: <Text className="font-bold">คุณกำลังจะออกจากกลุ่ม</Text>,
          confirmTitle: "ออก",
        });
      }
    } catch (err) {}
  };

  const onPressNextButton = async () => {
    try {
    } catch (err) {
      console.log(err);
    }
  };

  const onPressConfirmLeave = async () => {
    try {
      await axios.delete(`${API_URL}/trip/member`, {
        data: { friendId: userId, tripId },
        headers: {
          authorization: token,
        },
      });
      setConfirmModal({ display: false, title: <></>, confirmTitle: "" });
    } catch (err) {
      console.log(err);
    }
  };

  const onBlurTripName = async () => {
    try {
      await axios.put(
        `${API_URL}/trip/name`,
        { tripId: tripId, name: tripName },
        {
          headers: {
            authorization: token,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const onBlurTripNote = async () => {
    try {
      await axios.put(
        `${API_URL}/trip/note`,
        {
          tripId,
          note: tripNote,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const changeFormatToPlan = (dailyPlan: Plan) => {
    return [
      ...dailyPlan.places.map((item) => ({
        id: item.placeId,
        startTime: item.startTime,
        endTime: item.endTime,
        type: "place",
        name: item.placeName,
        coverImg: item.covetImg,
        location: item.location,
        latitude: item.latitude,
        longitude: item.longitude,
      })),
      ...dailyPlan.activity.map((item) => ({
        id: item.activityId,
        startTime: item.startTime,
        endTime: item.endTime,
        type: "activity",
        name: item.name,
        coverImg: [],
        location: { address: "", district: "", province: "" },
        latitude: 0,
        longitude: 0,
      })),
    ];
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
        <Header onPressBack={onPressBack} title="" />

        {/* content */}
        {status === LOADING ? (
          <View
            className={`bg-[#F5F5F5] grow flex justify-center items-center`}
          >
            <Loading />
          </View>
        ) : (
          <ScrollView className=" bg-[#EEEEEE]   ">
            <View className="flex-col p-[16px] items-center">
              <View className="w-[358px] p-[16px] bg-white flex-col">
                <TextTitle title="รูปปกทริป" />
                {/* trip img */}
                <View className="h-[200px] w-[326px] bg-[#ECECEC] mb-[16px] mt-[8px]"></View>
                {/* trip name */}
                <TextTitle title="ชื่อทริป" />

                <TextInput
                  onBlur={onBlurTripName}
                  onChangeText={setTripName}
                  value={tripName}
                  className="h-[32px]  border pl-[12px] w-[326px] rounded-md border-[#D9D9D9] mt-[8px] mb-[16px]"
                  placeholder="ตั้งชื่อทริป"
                />
                {/* trip date */}
                <TextTitle title="วันเดินทาง" />
                <RangeDatepicker
                  range={{
                    startDate: new Date(date.start),
                    endDate: new Date(date.end),
                  }}
                  disabled={true}
                  size="small"
                  style={{ width: 326, marginTop: 8, marginBottom: 16 }}
                />
                <TextTitle title="บันทึกเพิ่มเติม" />
                <TextInput
                  onBlur={onBlurTripNote}
                  onChangeText={setTripNote}
                  value={tripNote}
                  className="border h-[78px] pl-[12px] w-[326px] rounded-md border-[#D9D9D9] mt-[8px] mb-[16px]"
                  multiline
                  numberOfLines={20}
                  placeholder="เขียนที่นี..."
                />

                <View className="flex-row items-center">
                  <TextTitle title="สมาชิก" />
                  <Edit />
                </View>
                {/* mini profile  */}
                <View className="flex-row flex-wrap ]">
                  {member.map((item) => (
                    <View className="w-[163px] mt-[8px]" key={item.username}>
                      <MiniProfileCustom
                        profileUrl={item.userprofile}
                        username={item.username}
                      />
                    </View>
                  ))}
                </View>

                <View className="mt-[16px] flex-row">
                  <Pressable>
                    <View className="w-[110px] h-[32px] border-[2px] border-[#FFC502] rounded-full px-[12px] flex-row items-center justify-between">
                      <EditPlace />
                      <Text className="text-[12px] text-[#FFC502] font-bold">
                        แก้ไขสถานที่
                      </Text>
                    </View>
                  </Pressable>
                  <Pressable>
                    <View className="ml-[36px] w-[180px] h-[32px]  bg-[#FFC502] rounded-full px-[12px] flex-row items-center justify-between">
                      <Compass />
                      <Text className="text-[12px] text-white font-bold">
                        หาจุดแวะเที่ยวระหว่างทาง
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
              {/* plan */}
              {plan.map((dailyPlan) => (
                <PlanCard
                  dailyPlan={changeFormatToPlan(dailyPlan)}
                  tripId={tripId}
                  token={token}
                  date={dailyPlan.date}
                  day={dailyPlan.day}
                />
              ))}
            </View>
          </ScrollView>
        )}
        {/* footer */}
        {owner && (
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
                title="สร้างทริป"
                onPress={onPressNextButton}
              />
            </View>
          </View>
        )}
      </View>

      {confirmModal.display && (
        <View className="absolute bg-[#0000008C] w-[100%] h-[100%] flex-col justify-center items-center ">
          {/* delete trip */}
          <ConfirmModal
            title={confirmModal.title}
            confirmTitle={confirmModal.confirmTitle}
            onPressCancel={() => {
              setConfirmModal({
                display: false,
                title: <></>,
                confirmTitle: "",
              });
            }}
            onPressConfirm={onPressConfirmLeave}
          />
        </View>
      )}
    </>
  );
};

export default TripSummary;
