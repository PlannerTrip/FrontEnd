import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useContext, useRef, useState } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View, Text, Pressable, ScrollView } from "react-native";
import { StackParamList } from "../../interface/navigate";
import { AuthData } from "../../contexts/authContext";
import * as Location from "expo-location";

// ====================== svg ======================

import ArrowLeft from "../../assets/invitation/Arrow_left.svg";

import ButtonCustom from "../../components/button";
import axios, { AxiosResponse } from "axios";
import { API_URL } from "@env";
import { Socket, io } from "socket.io-client";
import Loading from "../Loading";
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
import { Place, Plan, PlanPlace } from "../../interface/planSelect";
import PlaceCard from "../../components/planSelect/placeCard";
import PlanCard from "../../components/planSelect/planCard";
import { distanceTwoPoint } from "../../utils/function";

type Props = NativeStackScreenProps<StackParamList, "planSelect">;

const PlanSelect = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const { userId, token } = useContext(AuthData);

  const { tripId } = route.params;

  const [owner, setOwner] = useState(true);
  const [plan, setPlan] = useState<Plan[]>([]);
  const [confirmModal, setConfirmModal] = useState({
    display: false,
    id: "",
    name: "",
  });
  const [status, setStatus] = useState(LOADING);

  const [places, setPlaces] = useState<Place[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [height, setHeight] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  const [errorMsg, setErrorMsg] = useState("");

  const isFocused = useIsFocused();

  const [scrollHeight, setScrollHeight] = useState(0);

  // ====================== useFocusEffect ======================

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        positionX.value = 0;
        positionY.value = 0;
        // setStatus(LOADING);
        setPlan([]);
        setOwner(false);
        setPlaces([]);
        setStatus(LOADING);
        setScrollPosition(0);
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

    socket.on("updateStage", (data: { stage: string }) => {
      if (data.stage === "placeSelect") {
        navigation.navigate("placeSelect", {
          tripId: tripId,
        });
      }
    });

    socket.on("removeItemPlan", (data: { day: number; id: string }) => {
      setPlan((plan) =>
        plan.map((item) =>
          item.day === data.day
            ? {
                ...item,
                place: item.place.filter(
                  (place) => place.placePlanId !== data.id
                ),
                activity: item.activity.filter(
                  (activity) => activity.activityId !== data.id
                ),
              }
            : item
        )
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
        const distant = distanceTwoPoint(
          location.latitude,
          location.longitude,
          data.latitude,
          data.longitude
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
          })
        );
      }
    );
  };

  const onPressBack = async () => {
    try {
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
          }
        );
      } else {
        // user click show modal confirm leave trip
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
      setOwner(owner);
      setStatus(SUCCESS);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePanEnd = async (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => {
    try {
      // cal position when end
      const header = 80;
      const footer = owner ? 233 : 169;
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
        }
      );
    } catch (err) {
      console.log("error", err);
    }
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

  const scrollRef = useRef<ScrollView>(null);

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
        {/* header */}
        <View className="h-[80px] p-[16px] bg-[#FFF]  flex-row items-end ">
          <Pressable onPress={onPressBack}>
            <ArrowLeft />
          </Pressable>
          <Text className="text-[24px] font-bold h-[40px] ml-[8px]">
            เลือกวันท่องเที่ยว
          </Text>
        </View>
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
                if (scrollRef) {
                  scrollRef.current.scrollTo({
                    y: Math.max(scrollPosition - (scrollHeight - h), 0),
                  });
                }
              }}
              onScrollEndDrag={(event) => {
                setScrollPosition(
                  Math.max(event.nativeEvent.contentOffset.y, 0)
                );
              }}
              onMomentumScrollEnd={(event) => {
                setScrollPosition(
                  Math.max(event.nativeEvent.contentOffset.y, 0)
                );
              }}
            >
              <View className="flex-col pb-[16px]  items-center">
                {plan.map((item) => (
                  <PlanCard plan={item} key={item.date} tripId={tripId} />
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
            {owner && (
              <View className="flex-col items-center">
                {/* button go to next stage */}

                <View className="h-[100px] bg-[#FFF] p-[16px] flex-row justify-center">
                  <ButtonCustom
                    width="w-[351px]"
                    title="ต่อไป"
                    disable={false}
                    onPress={() => {}}
                  />
                </View>
              </View>
            )}
          </>
        )}
      </View>

      {confirmModal.display && (
        <View className="absolute bg-[#0000008C] w-[100%] h-[100%] flex-col justify-center items-center "></View>
      )}
    </>
  );
};

export default PlanSelect;
