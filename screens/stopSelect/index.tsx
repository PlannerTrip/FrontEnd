import React, { useCallback, useContext, useRef, useState } from "react";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ButtonCustom from "../../components/button";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../../interface/navigate";
import { AuthData } from "../../contexts/authContext";
import Header from "../../components/tripCreate/Header";

import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import { decode } from "@mapbox/polyline";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

import Pin from "../../assets/stopSelect/pin.svg";
import BigPin from "../../assets/stopSelect/bigPin.svg";

import { Socket, io } from "socket.io-client";
import { API_URL } from "@env";
import { LOADING, SUCCESS, TESTPOLYLINE } from "../../utils/const";
import axios from "axios";
import { Place, PlanPlace } from "../../interface/stopSelect";
import { FlatList } from "react-native-gesture-handler";
import PlaceCard from "../../components/planSelect/placeCard";
import Loading from "../Loading";

type Props = NativeStackScreenProps<StackParamList, "stopSelect">;

const StopSelect = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();

  const { token } = useContext(AuthData);

  const { tripId, day } = route.params;
  const isFocused = useIsFocused();

  const flatListRef = useRef<FlatList>(null);

  // ======================= useState =======================

  const [status, setStatus] = useState(LOADING);
  const [owner, setOwner] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    display: false,
    title: <></>,
    confirmTitle: "",
  });
  const [places, setPlaces] = useState<Place[]>([]);

  const [planPlace, setPlanPlace] = useState<PlanPlace[]>([]);

  const [polyLine, setPolyLine] = useState("");

  const [currentPage, setCurrentPage] = useState(0);

  const [totalPlaceSelect, setTotalPlaceSelect] = useState(0);

  const decodedPolyline = decode(polyLine);

  const coordinates = decodedPolyline.map((point: number[]) => ({
    latitude: point[0],
    longitude: point[1],
  }));

  // ======================= useFocus =======================

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
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
    }, [tripId, isFocused, day]),
  );

  // ======================= function =======================

  const handleSocket = (socket: Socket) => {
    socket.on("connect", () => {
      console.log("connect");
    });

    socket.emit("joinTrip", tripId);

    socket.on("connect_error", (error) => {
      console.log("Socket Error", error.message);
    });

    socket.on("updateStage", (data: { stage: string }) => {
      if (data.stage === "planSelect") {
        navigation.navigate("planSelect", { tripId: tripId });
      } else if (data.stage === "tripSummary") {
        navigation.navigate("tripSummary", { tripId: tripId });
      }
    });
  };

  const getInformation = async () => {
    try {
      const response = await axios.get(`${API_URL}/trip/stop`, {
        params: { tripId, day },
        headers: {
          authorization: token,
        },
      });
      setPlaces(response.data.places);
      setPlanPlace(response.data.planPlace);
      setPolyLine(response.data.polyLine);
      setOwner(response.data.owner);
      setStatus(SUCCESS);
    } catch (err) {
      console.log(err);
    }
  };

  const onPressBack = async () => {
    try {
      if (status === LOADING) {
        if (!owner) {
          await axios.post(
            `${API_URL}/trip/stage`,
            {
              tripId,
              stage: "tripSummary",
            },
            {
              headers: {
                authorization: token,
              },
            },
          );
        } else {
          setConfirmModal({
            display: true,
            title: <Text className="font-bold">คุณกำลังจะออกจากกลุ่ม</Text>,
            confirmTitle: "ออก",
          });
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const onPressAdd = async (add: boolean, placeId: string) => {
    try {
      console.log(add, placeId);
      await axios.post(
        `${API_URL}/trip/place`,
        { tripId, placeId },
        {
          headers: {
            authorization: token,
          },
        },
      );

      setTotalPlaceSelect((totalPlaceSelect) => {
        if (add) {
          return totalPlaceSelect + 1;
        }
        return totalPlaceSelect - 1;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onPressNext = async () => {
    try {
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
    } catch (err) {}
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="bg-[#FFF] h-[100%] flex "
    >
      <Header
        title="เพิ่มจุดแวะ"
        onPressBack={onPressBack}
        showTotal={true}
        totalPlaceSelect={totalPlaceSelect}
      />
      {status === LOADING ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          <MapView
            className=" grow"
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: planPlace[0].latitude,
              longitude: planPlace[0].longitude,
              latitudeDelta: 0.9,
              longitudeDelta: 0.9,
            }}
          >
            <Polyline
              coordinates={coordinates}
              strokeWidth={4}
              strokeColor="blue"
            />

            {/* {planPlace.map((place) => (
          <Marker
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.placeName}
          >
            <Pin />
          </Marker>
        ))} */}

            {places.map((place, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                title={place.placeName}
                onPress={() => {
                  if (flatListRef.current) {
                    flatListRef.current.scrollToIndex({
                      animated: true,
                      index,
                    });
                  }
                }}
              >
                {index !== currentPage ? <Pin /> : <BigPin />}
              </Marker>
            ))}
          </MapView>
          <View
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
            className="flex-col items-center h-[149px] bg-white pt-[16px]"
          >
            {/* place select */}
            <View className="w-[358px]">
              <FlatList
                ref={flatListRef}
                data={places}
                renderItem={({ item }) => (
                  <PlaceCard
                    coverImg={[item.coverImg]}
                    forecast={[]}
                    location={item.location}
                    name={item.placeName}
                    tripId={tripId}
                    selectBy={[]}
                    showAddButton={true}
                    alreadyAdd={item.alreadyAdd}
                    onClickAddButton={(add) => {
                      onPressAdd(add, item.placeId);
                    }}
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
            </View>

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
          {owner && (
            <View>
              {/* button go to next stage */}

              <View className="h-[100px] bg-[#FFF] p-[16px] flex-row justify-center">
                <ButtonCustom
                  width="w-[351px]"
                  title="ต่อไป"
                  onPress={onPressNext}
                />
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default StopSelect;
