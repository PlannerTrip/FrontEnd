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
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Place, Plan } from "../../interface/planSelect";
import PlaceCard from "../../components/planSelect/placeCard";
import PlanCard from "../../components/planSelect/planCard";

type Props = NativeStackScreenProps<StackParamList, "planSelect">;

const PlanSelect = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const { userId, token } = useContext(AuthData);

  const { tripId } = route.params;

  const [owner, setOwner] = useState(true);
  const [plan, setPlan] = useState<Plan[]>([]);
  const [confirmModal, setConfirmModal] = useState({
    display: false,
    placeId: "",
    placeName: "",
  });
  const [status, setStatus] = useState(SUCCESS);

  const [places, setPlaces] = useState<Place[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [height, setHeight] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [errorMsg, setErrorMsg] = useState("");

  const isFocused = useIsFocused();

  // ====================== useFocusEffect ======================

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        positionX.value = 0;
        positionY.value = 0;
        // setStatus(LOADING);
        setPlan([]);
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

      const response: AxiosResponse<{ places: Place[]; plan: Plan[] }> =
        await axios.get(`${API_URL}/trip/information`, {
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
    } catch (err) {
      console.log(err);
    }
  };

  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart((e) => {})
    .onUpdate((e) => {
      positionX.value = e.translationX;
      positionY.value = e.translationY;
    })
    .onEnd((e) => {
      const positionYAtEnd =
        height - 80 - insets.top - 233 + e.translationY + scrollPosition;
      console.log(positionYAtEnd);
      if (positionYAtEnd > 0 && positionYAtEnd < 200) {
        console.log("in");
      }
      positionX.value = 0;
      positionY.value = 0;
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
          console.log(event.nativeEvent.layout.height);
          setHeight(event.nativeEvent.layout.height);
        }}
      >
        {/* header */}
        <View className="h-[80px] p-[16px] bg-[#FFF]  flex-row items-end ">
          <Pressable onPress={onPressBack}>
            <ArrowLeft />
          </Pressable>
          <Text className="text-[24px] font-bold h-[40px] ml-[8px]">
            เลือวันท่องเที่ยว
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
          <ScrollView
            className=" bg-[#EEEEEE]"
            onScrollEndDrag={(event) => {
              setScrollPosition(Math.max(event.nativeEvent.contentOffset.y, 0));
            }}
          >
            <View className="flex-col  items-center">
              {plan.map((item) => (
                <PlanCard plan={item} />
              ))}
            </View>
          </ScrollView>
        )}

        <View className="flex-col items-center h-[149px] bg-white pt-[16px]">
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
      </View>

      {confirmModal.display && (
        <View className="absolute bg-[#0000008C] w-[100%] h-[100%] flex-col justify-center items-center "></View>
      )}
    </>
  );
};

export default PlanSelect;
