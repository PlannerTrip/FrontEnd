import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useContext, useRef, useState } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import { StackParamList } from "../../interface/navigate";
import { AuthData } from "../../contexts/authContext";
import * as Location from "expo-location";

// ====================== component ======================

import ButtonCustom from "../../components/button";
import PlaceCard from "../../components/planSelect/placeCard";
import PlanCard from "../../components/planSelect/planCard";
import Header from "../../components/tripCreate/Header";
import ConfirmModal from "../../components/confirmModal";
import Loading from "../Loading";

import axios, { AxiosResponse } from "axios";

import { API_URL } from "@env";
import { Socket, io } from "socket.io-client";
import { LOADING, SUCCESS } from "../../utils/const";

import {
  GestureDetector,
  Gesture,
  FlatList,
  PanGestureHandlerEventPayload,
  GestureStateChangeEvent,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";

import { Activity, Place, Plan, PlanPlace } from "../../interface/planSelect";

import { changeDateFormat, distanceTwoPoint } from "../../utils/function";

type Props = NativeStackScreenProps<StackParamList, "planSelect">;

const PlanSelect = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const { userId, token } = useContext(AuthData);

  const { tripId } = route.params;

  const scrollRef = useRef<ScrollView>(null);
  const flatList = useRef<FlatList>(null);
  // ====================== useState ======================

  const [owner, setOwner] = useState(false);
  const [plan, setPlan] = useState<Plan[]>([]);
  const [confirmModal, setConfirmModal] = useState({
    display: false,
    day: 0,
    date: "",
  });
  const [status, setStatus] = useState(LOADING);

  const [places, setPlaces] = useState<Place[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [height, setHeight] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  const [errorMsg, setErrorMsg] = useState("");

  const [scrollHeight, setScrollHeight] = useState(0);

  const [activityInput, setActivityInput] = useState("");

  const [displayConfirmLeaveModal, setDisplayConfirmLeaveModal] =
    useState(false);

  const isFocused = useIsFocused();
  // ====================== useFocusEffect ======================

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        positionX.value = 0;
        positionY.value = 0;

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

  // ====================== function ======================

  const init = () => {
    setPlan([]);
    setOwner(false);
    setPlaces([]);
    setStatus(LOADING);
    setCurrentPage(0);
    setScrollPosition(0);
    setScrollHeight(0);
    setActivityInput("");
    setConfirmModal({
      display: false,
      day: 0,
      date: "",
    });
  };

  const handleSocket = (socket: Socket) => {
    socket.on("connect", () => {
      console.log("connect");
    });

    socket.emit("joinTrip", tripId);

    socket.on("connect_error", (error) => {
      console.log("Socket Error", error.message);
    });

    socket.on("removeMember", (data: { userId: string }) => {
      if (userId === data.userId) {
        navigation.navigate("tab");
      } else {
        // remove place
        setPlaces((places) =>
          places.reduce((result: Place[], current) => {
            current.selectBy = current.selectBy.filter(
              (id) => id !== data.userId,
            );

            if (current.selectBy.length !== 0) {
              result.push(current);
            }

            return result;
          }, []),
        );
        // scroll flatList to index 0
        if (flatList.current) {
          flatList.current.scrollToIndex({ index: 0 });
        }
        setPlan((plan) =>
          plan.map((dailyPlan) => {
            dailyPlan.place = dailyPlan.place.reduce(
              (resultPLace: PlanPlace[], currentPlace) => {
                currentPlace.selectBy = currentPlace.selectBy.filter(
                  (information) => information.userId !== data.userId,
                );
                if (currentPlace.selectBy.length !== 0) {
                  resultPLace.push(currentPlace);
                }
                return resultPLace;
              },
              [],
            );

            dailyPlan.activity = dailyPlan.activity.reduce(
              (resultActivity: Activity[], currentActivity) => {
                currentActivity.selectBy = currentActivity.selectBy.filter(
                  (information) => information.userId !== data.userId,
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
      if (data.stage === "placeSelect") {
        navigation.navigate("placeSelect", {
          tripId: tripId,
        });
      } else if (data.stage === "tripSummary") {
        navigation.navigate("tripSummary", {
          tripId: tripId,
        });
      }
    });

    socket.on("addActivity", (data: { day: number; activity: Activity }) => {
      setPlan((plan) =>
        plan.map((item) =>
          item.day === data.day
            ? { ...item, activity: [...item.activity, data.activity] }
            : item,
        ),
      );
    });

    socket.on("removeItemPlan", (data: { day: number; id: string }) => {
      setPlan((plan) =>
        plan.map((item) =>
          item.day === data.day
            ? {
                ...item,
                place: item.place.filter(
                  (place) => place.placePlanId !== data.id,
                ),
                activity: item.activity.filter(
                  (activity) => activity.activityId !== data.id,
                ),
              }
            : item,
        ),
      );
    });

    socket.on(
      "addPlacePlan",
      (data: {
        place: PlanPlace;
        day: number;
        latitude: number;
        longitude: number;
      }) => {
        // console.log(data);

        setLocation((location) => {
          const distant = distanceTwoPoint(
            location.latitude,
            location.longitude,
            data.latitude,
            data.longitude,
          );
          setPlan((plan) =>
            plan.map((item) => {
              if (item.day === data.day) {
                return {
                  ...item,
                  place: [...item.place, { ...data.place, distant: distant }],
                };
              }
              return item;
            }),
          );
          return location;
        });
      },
    );
  };

  const onPressBack = async () => {
    try {
      if (status !== LOADING) {
        if (owner) {
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
        } else {
          setDisplayConfirmLeaveModal(true);
        }
      }
    } catch (err) {}
  };

  const getInformation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const response: AxiosResponse<{
        places: Place[];
        plan: Plan[];
        owner: boolean;
      }> = await axios.get(`${API_URL}/trip/information`, {
        params: {
          tripId: tripId,
          type: "allPlaceForEachDate",
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        headers: {
          authorization: token,
        },
      });
      setPlan(response.data.plan);
      setPlaces(response.data.places);
      setOwner(response.data.owner);
      setStatus(SUCCESS);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePanEnd = async (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => {
    try {
      // cal position when end
      const header = 80;
      const footer = owner ? 233 : 185;
      const positionYAtEnd =
        height - header - insets.top - footer + e.translationY + scrollPosition;

      let currentPosition = 0;
      const rangeStartEnd: { start: number; end: number }[] = [];
      // calculate size of each box
      plan.forEach((item) => {
        currentPosition += 16;
        let start = 0;
        let end = 0;

        start = currentPosition;
        if (item.place.length === 0 && item.activity.length === 0) {
          currentPosition += 96;
        } else {
          const gap = (item.place.length + item.activity.length - 1) * 8;
          const totalPlaceHeight = item.place.length * 124;
          const totalActivityHeight = item.activity.length * 64;
          const defaultSize = 72;
          currentPosition =
            currentPosition +
            defaultSize +
            totalPlaceHeight +
            totalActivityHeight +
            gap;
        }

        end = currentPosition;
        rangeStartEnd.push({ start, end });
      });
      rangeStartEnd.forEach(({ start, end }, index) => {
        if (positionYAtEnd > start && positionYAtEnd < end) {
          updatePlaceInPlan(places[currentPage].placeId, index + 1);
        }
      });

      positionX.value = 0;
      positionY.value = 0;
    } catch (err) {
      console.log("endPan", err);
    }
  };

  const updatePlaceInPlan = async (placeId: string, day: number) => {
    try {
      const response = await axios.post(
        `${API_URL}/trip/plan`,
        { placeId: placeId, tripId: tripId, day: day },
        {
          headers: {
            authorization: token,
          },
        },
      );
    } catch (err) {
      console.log("error", err);
    }
  };

  const onPressAddActivity = async () => {
    try {
      await axios.post(
        `${API_URL}/trip/planActivity`,
        {
          tripId,
          name: activityInput,
          day: confirmModal.day,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      setConfirmModal({ date: "", day: 0, display: false });
      setActivityInput("");
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
      setDisplayConfirmLeaveModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const onPressNext = async () => {
    try {
      await axios.post(
        `${API_URL}/trip/stage`,
        { stage: "tripSummary", tripId: tripId },
        {
          headers: {
            authorization: token,
          },
        },
      );
    } catch (err) {}
  };

  // ====================== animate ======================

  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart((e) => {})
    .onUpdate((e) => {
      positionX.value = e.translationX;
      positionY.value = e.translationY;
    })
    .onEnd((e) => {
      runOnJS(handlePanEnd)(e);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: positionY.value },
      { translateX: positionX.value },
    ],
  }));

  return (
    <>
      <View
        style={{
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
        className="bg-[#FFF] h-[100%]"
        onLayout={(event) => {
          setHeight(event.nativeEvent.layout.height);
        }}
      >
        <Header onPressBack={onPressBack} title="เลือกวันท่องเที่ยว" />
        {/* content */}
        {status === LOADING ? (
          <View
            className={`bg-[#F5F5F5] grow flex justify-center items-center`}
          >
            <Loading />
          </View>
        ) : (
          <>
            <ScrollView
              ref={scrollRef}
              className=" bg-[#EEEEEE]"
              onContentSizeChange={(w, h) => {
                setScrollHeight(h);
                if (scrollRef.current && scrollHeight !== 0) {
                  scrollRef.current.scrollTo({
                    y: Math.max(scrollPosition - (scrollHeight - h), 0),
                  });
                }
              }}
              onScrollEndDrag={(event) => {
                setScrollPosition(
                  Math.max(event.nativeEvent.contentOffset.y, 0),
                );
              }}
              onMomentumScrollEnd={(event) => {
                setScrollPosition(
                  Math.max(event.nativeEvent.contentOffset.y, 0),
                );
              }}
            >
              <View className="flex-col pb-[16px]  items-center">
                {plan.map((item) => (
                  <PlanCard
                    plan={item}
                    key={item.date}
                    tripId={tripId}
                    onPressAddActivity={() => {
                      setConfirmModal({
                        date: item.date,
                        day: item.day,
                        display: true,
                      });
                    }}
                  />
                ))}
              </View>
            </ScrollView>

            {/* place FlatList */}
            <View
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
              className="flex-col items-center h-[149px] bg-white pt-[16px]"
            >
              <Animated.View style={animatedStyle} className=" w-[358px] ">
                <GestureDetector gesture={pan}>
                  <FlatList
                    ref={flatList}
                    data={places}
                    renderItem={({ item }) => (
                      <PlaceCard
                        coverImg={item.coverImg}
                        forecast={item.forecasts}
                        location={item.location}
                        name={item.placeName}
                        tripId={tripId}
                        selectBy={item.selectBy}
                        key={item.placeId}
                      />
                    )}
                    horizontal
                    pagingEnabled
                    snapToAlignment="center"
                    showsHorizontalScrollIndicator={false}
                    onScroll={(e) => {
                      const offsetX = e.nativeEvent.contentOffset.x;
                      const page = Math.floor(offsetX / 358);
                      setCurrentPage(page < 0 ? 0 : page);
                    }}
                  />
                </GestureDetector>
              </Animated.View>
              {places.length > 1 && (
                <View className="flex-row mt-[8px] ">
                  {places.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          width: currentPage === index ? 15 : 5,
                          height: 5,
                          borderRadius: 3,
                          backgroundColor:
                            currentPage === index ? "#FFC502" : "gray",
                          marginLeft: 4,
                        }}
                      ></View>
                    );
                  })}
                </View>
              )}
            </View>
            {/* footer */}
            {owner ? (
              <View className="flex-col items-center">
                {/* button go to next stage */}

                <View className="h-[100px] bg-[#FFF] p-[16px] flex-row justify-center">
                  <ButtonCustom
                    width="w-[351px]"
                    title="ต่อไป"
                    disable={false}
                    onPress={onPressNext}
                  />
                </View>
              </View>
            ) : (
              <View className="h-[16px] bg-white"></View>
            )}
          </>
        )}
      </View>
      {/* modal */}
      {confirmModal.display && (
        <View className="absolute bg-[#0000008C] w-[100%] h-[100%] flex-col justify-center items-center ">
          <View className="w-[279px] h-[160px] p-[16px] rounded-lg bg-white flex-col items-center">
            <Text className="text-[16px] leading-6 font-bold">
              วันที่ {confirmModal.day}
            </Text>
            <Text className="text-[16px] leading-6 font-normal">
              {changeDateFormat(confirmModal.date)}
            </Text>
            <TextInput
              onChangeText={setActivityInput}
              value={activityInput}
              className="h-[32px] border pl-[16px] w-[247px] rounded-md border-[#D9D9D9] mt-[8px]"
              placeholder="โปรดระบุกิจกรรม"
            />
            <View className="mt-[8px] flex-row">
              <Pressable
                onPress={() => {
                  setConfirmModal({ date: "", day: 0, display: false });
                }}
              >
                <View className="w-[115.5px] h-[32px] border flex justify-center items-center border-[#FFC502] rounded-sm mr-[16px]">
                  <Text className="text-[#FFC502] text-[16px] leading-6 ">
                    ยกเลิก
                  </Text>
                </View>
              </Pressable>
              <Pressable onPress={onPressAddActivity}>
                <View className="w-[115.5px] h-[32px]  flex justify-center items-center bg-[#FFC502] rounded-sm">
                  <Text className="text-white text-[16px] leading-6 ">
                    เพิ่ม
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      )}
      {displayConfirmLeaveModal && (
        <View className="absolute bg-[#0000008C] w-[100%] h-[100%] flex-col justify-center items-center ">
          {/* delete trip */}
          <ConfirmModal
            title={<Text className="font-bold">คุณกำลังจะออกจากกลุ่ม</Text>}
            confirmTitle="ออก"
            onPressCancel={() => {
              setDisplayConfirmLeaveModal(false);
            }}
            onPressConfirm={onPressConfirmLeave}
          />
        </View>
      )}
    </>
  );
};

export default PlanSelect;
