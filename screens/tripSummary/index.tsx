import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios, { AxiosResponse } from "axios";
import { Socket, io } from "socket.io-client";

import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { StackParamList } from "../../interface/navigate";

import { AuthData } from "../../contexts/authContext";
import { TextInput } from "react-native-gesture-handler";

// ====================== svg ======================

import Edit from "../../assets/tripSummary/edit.svg";
import EditPlace from "../../assets/tripSummary/editPlace.svg";
import Compass from "../../assets/tripSummary/compass.svg";
import DefaultCoverImg from "../../assets/tripSummary/defaultCoverImg.svg";

// ====================== interface ======================

import {
  Member,
  PlaceCard,
  Plan,
  PlanActivity,
  PlanPlace,
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

import * as ImagePicker from "expo-image-picker";

import { RangeDatepicker } from "@ui-kitten/components";
import PlanCard from "../../components/tripSummary/planCard";
import BackgroundModal from "../../components/backgroundModal";
import Modal from "../../components/modal";
import { MemberData } from "../../interface/invitation";
import DaySelectModal from "../../components/tripSummary/daySelectModal";
import { distanceTwoPoint } from "../../utils/function";

type Props = NativeStackScreenProps<StackParamList, "tripSummary">;

const TripSummary = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const { userId, token } = useContext(AuthData);

  const { tripId } = route.params;

  const isFocused = useIsFocused();

  // ====================== useState======================

  const [owner, setOwner] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    type: "leave",
    display: false,
    title: <></>,
    confirmTitle: "",
  });
  const [displaySuccessModal, setDisplaySuccessModal] = useState(false);
  const [displayDaySelectModal, setDisplayDaySelectModal] = useState(false);

  const [status, setStatus] = useState(LOADING);
  const [plan, setPlan] = useState<Plan[]>([]);
  const [displayPlan, setDisplayPlan] = useState<
    { day: number; date: string; dailyPlan: PlaceCard[] }[]
  >([]);

  const [tripName, setTripName] = useState("");
  const [tripNote, setTripNote] = useState("");
  const [member, setMember] = useState<Member[]>([]);
  const [date, setDate] = useState({ start: "", end: "" });
  const [coverImg, setCoverImg] = useState("");

  // ====================== useFocusEffect ======================

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        init();
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
    }, [tripId, isFocused]),
  );

  // update displayPlan when plan change
  useEffect(() => {
    setDisplayPlan(
      plan.map((dailyPlan) => ({
        day: dailyPlan.day,
        date: dailyPlan.date,
        dailyPlan: changeFormatToPlan(dailyPlan),
      })),
    );
  }, [plan]);

  // ====================== function ======================

  const init = () => {
    setDisplaySuccessModal(false);
    setStatus(LOADING);
    setPlan([]);
    setDisplayPlan([]);
    setMember([]);
    setTripName("");
    setTripNote("");
    setMember([]);
    setCoverImg("");
    setDate({ start: "", end: "" });
    setOwner(false);
  };

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
          }),
        );
      },
    );

    socket.on("updateCoverImg", (data: { coverImg: string }) => {
      setCoverImg(data.coverImg);
    });

    socket.on("addMember", (data: { data: MemberData }) => {
      console.log(data.data);
      setMember((member) => [
        ...member,
        {
          userId: data.data.userId,
          username: data.data.username,
          userprofile: data.data.profileUrl,
        },
      ]);
    });

    socket.on("removeMember", (data: { userId: string }) => {
      if (userId === data.userId) {
        navigation.navigate("tab");
      } else {
        setMember((member) =>
          member.filter((user) => user.userId !== data.userId),
        );

        setPlan((plan) =>
          plan.map((dailyPlan) => {
            dailyPlan.places = dailyPlan.places.reduce(
              (resultPLace: PlanPlace[], currentPlace) => {
                currentPlace.selectBy = currentPlace.selectBy.filter(
                  (id) => id !== data.userId,
                );
                if (currentPlace.selectBy.length !== 0) {
                  resultPLace.push(currentPlace);
                }
                return resultPLace;
              },
              [],
            );

            dailyPlan.activity = dailyPlan.activity.reduce(
              (resultActivity: PlanActivity[], currentActivity) => {
                currentActivity.selectBy = currentActivity.selectBy.filter(
                  (id) => id !== data.userId,
                );
                if (currentActivity.selectBy.length !== 0) {
                  resultActivity.push(currentActivity);
                }
                return resultActivity;
              },
              [],
            );

            return dailyPlan;
          }),
        );
      }
    });

    socket.on("updateStage", (data: { stage: string }) => {
      if (data.stage === "planSelect") {
        navigation.navigate("planSelect", { tripId: tripId });
      } else if (data.stage === "finish") {
        setOwner(owner=>{
          if (!owner) {
            navigation.navigate("tab");
          }
          return owner
        })
       
      } else if (data.stage === "placeSelect") {
        navigation.navigate("placeSelect", { tripId: tripId });
      } else if (data.stage === "invitation") {
        navigation.navigate("invitation", { tripId: tripId });
      } else {
        navigation.navigate("stopSelect", {
          tripId: tripId,
          day: Number(data.stage.split("-")[1]),
        });
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
        },
      );
      setCoverImg(response.data.information.coverImg);
      setOwner(response.data.owner);
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

  // ----------------------- onPress -----------------------

  const onPressBack = async () => {
    try {
      if (status !== LOADING) {
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
            },
          );
        } else {
          setConfirmModal({
            type: "leave",
            display: true,
            title: <Text className="font-bold">คุณกำลังจะออกจากกลุ่ม</Text>,
            confirmTitle: "ออก",
          });
        }
      }
    } catch (err) {}
  };

  const onPressConfirmLeave = async () => {
    try {
      await axios.delete(`${API_URL}/trip/member`, {
        data: { friendId: userId, tripId },
        headers: {
          authorization: token,
        },
      });
      setConfirmModal({
        type: "leave",
        display: false,
        title: <></>,
        confirmTitle: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onPressCreateTrip = async () => {
    try {
      await axios.put(
        `${API_URL}/trip/createTrip`,
        {
          tripId,
        },
        { headers: { Authorization: token } },
      );
      setDisplaySuccessModal(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onPressEditPlace = async () => {
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
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  const onPressEditFriend = () => {
    navigation.navigate("tripMember", { tripId: tripId, member });
  };

  const onPressFindWaypoint = () => {
    setDisplayDaySelectModal(true);
  };

  const onPressModalDateSelect = async (day: number) => {
    try {
      await axios.post(
        `${API_URL}/trip/stage`,
        {
          tripId,
          stage: `stopSelect-${day}`,
        },
        {
          headers: {
            authorization: token,
          },
        },
      );
      setDisplayDaySelectModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const onPressChangeDate = () => {
    if (owner) {
      setConfirmModal({
        type: "dateChage",
        display: true,
        title: (
          <>
            <Text className="font-bold">การเปลี่ยนวันที่ต้องเลือก</Text>
            <Text className="font-bold">
              สถานที่ท่องเที่ยวในแต่ละวันอีกครั้ง
            </Text>
          </>
        ),
        confirmTitle: "เปลี่ยน",
      });
    }
  };

  const onPressHandleChangDate = async () => {
    try {
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
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ----------------------- onBlur -----------------------

  const onBlurTripName = async () => {
    try {
      await axios.put(
        `${API_URL}/trip/name`,
        { tripId: tripId, name: tripName },
        {
          headers: {
            authorization: token,
          },
        },
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
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  const timeComparator = (a: string, b: string) => {
    if (a === "") {
      return 1; // Empty strings come after non-empty strings
    } else if (b === "") {
      return -1; // Non-empty strings come before empty strings
    }
    const [hourA, minuteA] = a.split(":").map(Number);
    const [hourB, minuteB] = b.split(":").map(Number);

    if (hourA !== hourB) {
      return hourA - hourB; // Sort by hour first
    } else {
      return minuteA - minuteB; // If hours are equal, sort by minute
    }
  };

  const changeFormatToPlan = (dailyPlan: Plan) => {
    const formatPlan = [
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

    const sortPlan = formatPlan.sort((dailyPlanA, dailyPlanB) => {
      return timeComparator(dailyPlanA.startTime, dailyPlanB.startTime);
    });

    let firstPlace = true;
    let currentPosition = { latitude: 0, longitude: 0 };

    const addFirstPlace = sortPlan.map((current) => {
      if (current.type === "place" && firstPlace) {
        firstPlace = false;
        currentPosition = {
          latitude: current.latitude,
          longitude: current.longitude,
        };
        return { ...current, firstPlace: true };
      }
      return { ...current, firstPlace: false };
    });

    // add distant from prevPlace
    const sortPlanAddDistant = addFirstPlace.map((dailyPlan, index) => {
      let distant = -1;
      if (dailyPlan.type === "activity") {
        return { ...dailyPlan, distant: 0 };
      }

      if (index !== 0) {
        distant = distanceTwoPoint(
          currentPosition.latitude,
          currentPosition.longitude,
          dailyPlan.latitude,
          dailyPlan.longitude,
        );
      }

      currentPosition = {
        latitude: dailyPlan.latitude,
        longitude: dailyPlan.longitude,
      };
      return { ...dailyPlan, distant: distant };
    });

    return sortPlanAddDistant;
  };

  const pickImage = async () => {
    try {
      if (owner) {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [2, 3],
          quality: 1,
        });

        const formData = new FormData();

        if (!result.canceled) {
          setCoverImg(result.assets[0].uri);
          formData.append("coverImg", {
            uri: result.assets[0].uri,
            name: `image.jpg`,
            type: "image/jpeg",
          });
          formData.append("tripId", tripId);
          const response = await axios.put(
            `${API_URL}/trip/coverImg`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                authorization: token,
              },
            },
          );
        }
      }
    } catch (err) {
      console.log(`upload error : ${err}`);
    }
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
                <Pressable onPress={pickImage}>
                  <View className="h-[200px] w-[326px] bg-[#ECECEC] mb-[16px] mt-[8px] flex justify-center items-center overflow-hidden">
                    {coverImg === "" ? (
                      <DefaultCoverImg />
                    ) : (
                      <Image
                        source={{ uri: coverImg }}
                        style={{ width: 326, height: 200 }}
                      />
                    )}
                  </View>
                </Pressable>
                {/* trip name */}
                <TextTitle title="ชื่อทริป" />

                <TextInput
                  editable={owner}
                  selectTextOnFocus={owner}
                  onBlur={onBlurTripName}
                  onChangeText={setTripName}
                  value={tripName}
                  className="h-[32px]  border pl-[12px] w-[326px] rounded-md border-[#D9D9D9] mt-[8px] mb-[16px]"
                  placeholder="ตั้งชื่อทริป"
                />
                {/* trip date */}
                <TextTitle title="วันเดินทาง" />
                <Pressable onPress={onPressChangeDate}>
                  <RangeDatepicker
                    range={{
                      startDate: new Date(date.start),
                      endDate: new Date(date.end),
                    }}
                    disabled={true}
                    size="small"
                    style={{ width: 326, marginTop: 8, marginBottom: 16 }}
                  />
                </Pressable>
                <TextTitle title="บันทึกเพิ่มเติม" />
                <TextInput
                  editable={owner}
                  selectTextOnFocus={owner}
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
                  {owner && (
                    <Pressable onPress={onPressEditFriend}>
                      <Edit />
                    </Pressable>
                  )}
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
                {owner && (
                  <View className="mt-[16px] flex-row">
                    <Pressable onPress={onPressEditPlace}>
                      <View className="w-[110px] h-[32px] border-[2px] border-[#FFC502] rounded-full px-[12px] flex-row items-center justify-between">
                        <EditPlace />
                        <Text className="text-[12px] text-[#FFC502] font-bold">
                          แก้ไขสถานที่
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={onPressFindWaypoint}>
                      <View className="ml-[36px] w-[180px] h-[32px]  bg-[#FFC502] rounded-full px-[12px] flex-row items-center justify-between">
                        <Compass />
                        <Text className="text-[12px] text-white font-bold">
                          หาจุดแวะเที่ยวระหว่างทาง
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                )}
              </View>
              {/* plan */}
              {displayPlan.map((dailyPlan) => (
                <PlanCard
                  owner={owner}
                  dailyPlan={dailyPlan.dailyPlan}
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
                onPress={onPressCreateTrip}
              />
            </View>
          </View>
        )}
      </View>

      {/*  modal */}
      {confirmModal.display && (
        <BackgroundModal>
          {/* delete trip */}
          <ConfirmModal
            title={confirmModal.title}
            confirmTitle={confirmModal.confirmTitle}
            onPressCancel={() => {
              setConfirmModal({
                type: "leave",
                display: false,
                title: <></>,
                confirmTitle: "",
              });
            }}
            onPressConfirm={
              confirmModal.type === "leave"
                ? onPressConfirmLeave
                : onPressHandleChangDate
            }
          />
        </BackgroundModal>
      )}
      {displaySuccessModal && (
        <BackgroundModal>
          <Modal
            icon="checkCircle"
            buttonTitle="ปิด"
            title="สร้างทริปสำเร็จ"
            onPress={() => {
              navigation.navigate("tab");
            }}
          />
        </BackgroundModal>
      )}
      {displayDaySelectModal && (
        <BackgroundModal>
          <DaySelectModal
            dayList={plan.map((dailyPlan) => ({
              day: dailyPlan.day,
              date: dailyPlan.date,
              disable: dailyPlan.places.length < 2,
            }))}
            onClickClose={() => {
              setDisplayDaySelectModal(false);
            }}
            onPressModalDateSelect={(day: number) => {
              onPressModalDateSelect(day);
            }}
          />
        </BackgroundModal>
      )}
    </>
  );
};

export default TripSummary;
