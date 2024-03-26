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

type Props = NativeStackScreenProps<StackParamList, "tripDetail">;

const TripDetail = ({ route, navigation }: Props) => {
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
  const [currentPlace, setCurrentPlace] = useState("");

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
    const newPlan = plan.map((dailyPlan) => ({
      day: dailyPlan.day,
      date: dailyPlan.date,
      dailyPlan: changeFormatToPlan(dailyPlan),
    }));
    setDisplayPlan(newPlan);

  }, [plan]);

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
        <Header onPressBack={onPressBack} title="" />

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
                  currentPlace={currentPlace}
                  index={index}
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
      </View>
    </>
  );
};

export default TripDetail;
