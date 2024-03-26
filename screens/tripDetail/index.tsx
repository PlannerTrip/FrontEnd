import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios, { AxiosResponse } from "axios";
import { Socket, io } from "socket.io-client";

import { View, Text, Pressable, ScrollView } from "react-native";
import { StackParamList } from "../../interface/navigate";

import { AuthData } from "../../contexts/authContext";

// ====================== svg ======================

import Calendar from "../../assets/tripPlanner/Calendar.svg";

import Loading from "../Loading";

import { API_URL } from "@env";
import { LOADING, SUCCESS } from "../../utils/const";
import Header from "../../components/tripCreate/Header";
import {
  Member,
  PlaceCard,
  Plan,
  TripSummaryInformation,
} from "../../interface/tripSummary";
import TextTitle from "../../components/tripCreate/TextTitle";
import { changeDateFormat2, distanceTwoPoint } from "../../utils/function";
import MiniProfileCustom from "../../components/miniProfile";
import PlanCard from "../../components/tripDetail/planCard";
import BackgroundModal from "../../components/backgroundModal";
import ConfirmModal from "../../components/confirmModal";

import Close from "../../assets/modal/closeCircle.svg";
import Check from "../../assets/modal/checkCircle.svg";
import Bin from "../../assets/tripPlanner/bin.svg";
import ArrowLeft from "../../assets/invitation/Arrow_left.svg";

type Props = NativeStackScreenProps<StackParamList, "tripDetail">;

const TripDetail = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const { userId, token } = useContext(AuthData);

  const { tripId } = route.params;

  const isFocused = useIsFocused();

  // ====================== useState======================

  const [owner, setOwner] = useState(false);

  const [successModal, setSuccessModal] = useState({
    display: false,
    name: "",
  });
  const [modalConfirmUndo, setModalConfirmUndo] = useState({
    display: false,
    prevPlace: "",
  });

  const [displayModalDelete, setDisplayModalDelete] = useState(false);

  const [status, setStatus] = useState(LOADING);
  const [plan, setPlan] = useState<Plan[]>([]);
  const [displayPlan, setDisplayPlan] = useState<
    { day: number; date: string; dailyPlan: PlaceCard[] }[]
  >([]);

  const [tripName, setTripName] = useState("");
  const [tripNote, setTripNote] = useState("");
  const [member, setMember] = useState<Member[]>([]);
  const [date, setDate] = useState({ start: "", end: "" });
  const [currentPlace, setCurrentPlace] = useState("");
  const [prevPlaceStatus, setPrevPlaceStatus] = useState("");

  const [displayModalCheckInFail, setDisplayModalCheckInFail] = useState({
    display: false,
    name: "",
  });

  // ====================== useFocusEffect ======================

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        setStatus(LOADING);
        setOwner(false);
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

  useEffect(() => {
    let flatPlan: PlaceCard[] = [];
    let newPlan = plan.map((dailyPlan) => {
      flatPlan.push(...changeFormatToPlan(dailyPlan));

      return {
        day: dailyPlan.day,
        date: dailyPlan.date,
        dailyPlan: changeFormatToPlan(dailyPlan),
      };
    });
    newPlan = newPlan.map((information) => ({
      ...information,
      dailyPlan: information.dailyPlan.map((info) =>
        findPrevPlaceAndNextPlace(flatPlan, info.id, info),
      ),
    }));
    setDisplayPlan(newPlan);
  }, [plan]);

  // ====================== function ======================

  const onPressConfirm = async () => {
    try {
      await axios.put(
        `${API_URL}/trip/undo`,
        { tripId, prevPlace: modalConfirmUndo.prevPlace },
        { headers: { Authorization: token } },
      );
      setModalConfirmUndo({ display: false, prevPlace: "" });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSocket = (socket: Socket) => {
    socket.on("connect", () => {
      console.log("connect");
    });

    socket.emit("joinTrip", tripId);

    socket.on("connect_error", (error) => {
      console.log("Socket Error", error.message);
    });

    socket.on("tripDone", () => {
      console.log("done");
      setCurrentPlace("");
      setPrevPlaceStatus("");
    });

    socket.on("updateStage", (data: { stage: string }) => {
      navigation.navigate("tab");
    });

    socket.on(
      "updateCurrentPlace",
      ({ currentPlace, type }: { currentPlace: string; type: string }) => {
        setCurrentPlace(currentPlace);
        setPrevPlaceStatus(type);
      },
    );
  };

  const findPrevPlaceAndNextPlace = (
    flatPlan: PlaceCard[],
    id: string,
    info: PlaceCard,
  ) => {
    const findNext = (index: number) => {
      if (index >= flatPlan.length) {
        return "last";
      } else {
        if (flatPlan[index].type === "place") {
          return flatPlan[index].id;
        } else {
          return findNext(index + 1);
        }
      }
    };

    const findPrev = (index: number) => {
      if (index < 0) {
        return "first";
      } else {
        if (flatPlan[index].type === "place") {
          return flatPlan[index].id;
        } else {
          return findPrev(index - 1);
        }
      }
    };

    const index = flatPlan.findIndex((obj) => obj.id === id);

    return {
      ...info,
      nextPlace: findNext(index + 1),
      prevPlace: findPrev(index - 1),
    };
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
      setOwner(response.data.owner);
      setTripName(response.data.information.name);
      setTripNote(response.data.information.note);
      setMember(response.data.information.member);
      setDate(response.data.information.date);
      setPlan(response.data.plan);
      setPrevPlaceStatus(response.data.information.prevPlaceStatus);
      setStatus(SUCCESS);

      setCurrentPlace(response.data.information.currentPlace);
    } catch (err) {
      console.log(err);
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

  const onPressBack = async () => {
    try {
      navigation.goBack();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post(
        `${API_URL}/trip/stage`,
        {
          tripId,
          stage: "delete",
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
        {/* header*/}
        <View
          className="h-[80px] p-[16px] bg-[#FFF]  flex-row items-end "
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
        >
          <Pressable onPress={onPressBack}>
            <ArrowLeft />
          </Pressable>
          <Text className="text-[24px] font-bold h-[40px] ml-[8px]"></Text>
          {owner && (
            <View className="flex-row justify-end items-center grow">
              <Bin
                onPress={() => {
                  setDisplayModalDelete(true);
                }}
              />
            </View>
          )}
        </View>
        {/* content */}
        {status === LOADING ? (
          <View
            className={`bg-[#F5F5F5] grow flex justify-center items-center`}
          >
            <Loading />
          </View>
        ) : (
          <ScrollView
            className=" bg-[#EEEEEE]"
            showsVerticalScrollIndicator={false}
          >
            <View className="pt-[16px] flex items-center">
              <View className="w-[358px]  bg-white pt-[17px] px-[16px] pb-[16px] rounded-[5px]">
                <TextTitle title={tripName} />
                {/* date */}
                <View className="mt-[8px] flex-row items-center">
                  <Calendar />
                  <Text className="text-[12px] ml-[8px]">
                    {changeDateFormat2(date.start)} -{" "}
                    {changeDateFormat2(date.end)}
                  </Text>
                </View>
                {/* note */}
                <View className="mt-[8px] border-[#D9D9D9] border rounded-[6px] w-[326px] min-h-[72px] py-[5px] px-[12px]">
                  <Text className="text-[12px]">{tripNote}</Text>
                </View>
                {/* member */}
                <TextTitle title="สมาชิก" />
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
              </View>
            </View>
            <View className=" flex items-center">
              {displayPlan.map((dailyPlan, index) => (
                <PlanCard
                  prevPlaceStatus={prevPlaceStatus}
                  currentPlace={currentPlace}
                  index={index}
                  owner={owner}
                  dailyPlan={dailyPlan.dailyPlan}
                  tripId={tripId}
                  token={token}
                  date={dailyPlan.date}
                  day={dailyPlan.day}
                  setDisplayModalCheckInFail={setDisplayModalCheckInFail}
                  setSuccessModal={setSuccessModal}
                  setModalConfirmUndo={setModalConfirmUndo}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
      {displayModalCheckInFail.display && (
        <BackgroundModal>
          <ConfirmModal
            title={
              <View className="flex flex-col justify-center items-center">
                <Close />
                <Text className="mt-[8px] font-bold text-[16px] leading-[24px]">
                  ไม่สามารถเช็คอินได้
                </Text>

                <Text className="text-[12px] leading-[18px]">
                  คุณต้องอยู่ใกล้
                </Text>
                <Text className="text-[12px] leading-[18px]">
                  {displayModalCheckInFail.name}
                </Text>
                <Text className="text-[12px] leading-[18px]">
                  ในระยะไม่เกิน 3 กิโลเมตร
                </Text>
              </View>
            }
            cancelTitle={"ปิด"}
            onPressCancel={() => {
              setDisplayModalCheckInFail({ display: false, name: "" });
            }}
            confirm={false}
          />
        </BackgroundModal>
      )}
      {successModal.display && (
        <View className="absolute z-[100] top-0 bg-[#0000008C] w-[100%] h-[100vh] flex-col justify-center items-center ">
          <ConfirmModal
            title={
              <View className="flex flex-col justify-center items-center">
                <Check />
                <Text className="mt-[8px] font-bold text-[16px] leading-[24px]">
                  เช็คอินสำเร็จ
                </Text>
                <Text className=" text-[12px] leading-[18px]">
                  {successModal.name}
                </Text>
              </View>
            }
            cancelTitle={"ปิด"}
            onPressCancel={() => {
              setSuccessModal({ display: false, name: "" });
            }}
            confirm={false}
          />
        </View>
      )}
      {modalConfirmUndo.display && (
        <BackgroundModal>
          <ConfirmModal
            confirmTitle="ย้อนกลับ"
            title={
              <Text className="font-bold">
                ต้องการที่จะย้อนกลับไปสถานที่เดิม
              </Text>
            }
            onPressConfirm={onPressConfirm}
            onPressCancel={() => {
              setModalConfirmUndo({ display: false, prevPlace: "" });
            }}
          />
        </BackgroundModal>
      )}
      {displayModalDelete && (
        <BackgroundModal>
          <ConfirmModal
            confirmTitle="ลบ"
            title={<Text className="font-bold">ยืนยันที่จะลบทริป</Text>}
            onPressConfirm={handleDelete}
            onPressCancel={() => {
              setDisplayModalDelete(false);
            }}
          />
        </BackgroundModal>
      )}
    </>
  );
};

export default TripDetail;
