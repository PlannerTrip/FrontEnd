import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useContext, useState } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios, { AxiosResponse } from "axios";
import { Socket, io } from "socket.io-client";

import { View, Text, Pressable, ScrollView } from "react-native";
import { StackParamList } from "../../interface/navigate";

import { AuthData } from "../../contexts/authContext";

// ====================== svg ======================

import ArrowLeft from "../../assets/invitation/Arrow_left.svg";
import Plus from "../../assets/placeSelect/plus.svg";

import { Place } from "../../interface/placeSelect";

import ButtonCustom from "../../components/button";
import PlaceCard from "../../components/placeSelect/placeCard";
import ConfirmModal from "../../components/confirmModal";
import Loading from "../Loading";

import { API_URL } from "@env";
import { LOADING, SUCCESS } from "../../utils/const";

type Props = NativeStackScreenProps<StackParamList, "placeSelect">;

const PlaceSelect = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const { userId, token } = useContext(AuthData);

  const { tripId } = route.params;

  const isFocused = useIsFocused();

  // ====================== useState======================

  const [owner, setOwner] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [confirmModal, setConfirmModal] = useState({
    display: false,
    placeId: "",
    placeName: "",
  });

  const [status, setStatus] = useState(LOADING);

  const [displayConfirmLeaveModal, setDisplayConfirmLeaveModal] =
    useState(false);

  // ====================== useFocusEffect ======================

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        setStatus(LOADING);
        setPlaces([]);
        const socket = io(`${API_URL}`, {
          transports: ["websocket"],
        });
        handleSocket(socket);

        // get place
        getPlace();
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

    socket.on("removeMember", (data: { userId: string }) => {
      if (userId === data.userId) {
        navigation.navigate("tab");
      } else {
        setPlaces((places) =>
          places.reduce((result: Place[], current) => {
            current.selectBy = current.selectBy.filter(
              (id) => id.userId !== data.userId
            );

            if (current.selectBy.length !== 0) {
              result.push(current);
            }

            return result;
          }, [])
        );
      }
    });

    socket.on("addPlace", (data: Place) => {
      setPlaces((places) => [...places, data]);
    });

    socket.on("removePlace", (data: { placeId: string }) => {
      setPlaces((places) =>
        places.filter((place) => place.placeId !== data.placeId)
      );
    });

    socket.on(
      "updatePlace",
      (data: {
        placeId: string;
        selectBy: { username: string; userprofile: string; userId: string }[];
      }) => {
        console.log(data);
        setPlaces((places) =>
          places.map((place) => {
            if (place.placeId === data.placeId) {
              return { ...place, selectBy: data.selectBy };
            }
            return place;
          })
        );
      }
    );

    socket.on("updateStage", (data: { stage: string }) => {
      if (data.stage === "invitation") {
        navigation.navigate("invitation", {
          tripId: tripId,
        });
      } else if (data.stage === "planSelect") {
        navigation.navigate("planSelect", {
          tripId: tripId,
        });
      }
    });
  };

  const getPlace = async () => {
    try {
      const response: AxiosResponse<{ places: Place[]; owner: boolean }> =
        await axios.get(`${API_URL}/trip/information`, {
          params: { tripId: tripId, type: "allPlace" },
          headers: {
            authorization: token,
          },
        });
      setPlaces(response.data.places);
      setOwner(response.data.owner);
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
            stage: "invitation",
          },
          {
            headers: {
              authorization: token,
            },
          }
        );
      } else {
        setDisplayConfirmLeaveModal(true);
      }
    } catch (err) {}
  };

  const onPressNextButton = async () => {
    try {
      await axios.post(
        `${API_URL}/trip/stage`,
        { stage: "planSelect", tripId: tripId },
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

  const onPressAddPlace = () => {
    navigation.navigate("placeDiscovery", { tripId });
  };

  const onPressRemove = async (placeId: string, placeName: string) => {
    try {
      if (owner) {
        setConfirmModal({ display: true, placeId: placeId, placeName });
      } else {
        await axios.post(
          `${API_URL}/trip/place`,
          { placeId: placeId, tripId: tripId },
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

  const onPressConfirmRemove = async () => {
    try {
      await axios.delete(`${API_URL}/trip/place`, {
        data: { placeId: confirmModal.placeId, tripId: tripId },
        headers: {
          authorization: token,
        },
      });
      setConfirmModal({ display: false, placeId: "", placeName: "" });
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
        {/* header */}
        <View className="h-[80px] p-[16px] bg-[#FFF]  flex-row items-end ">
          <Pressable onPress={onPressBack}>
            <ArrowLeft />
          </Pressable>
          <Text className="text-[24px] font-bold h-[40px] ml-[8px]">
            เลือกสถานที่ท่องเที่ยว
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
          <ScrollView className=" bg-[#EEEEEE]  ">
            <View className="mt-[16px] flex-col items-center">
              {places.map((place) => (
                <View className="mb-[16px]" key={place.placeId}>
                  <PlaceCard
                    forecast={place.forecasts}
                    coverImg={place.coverImg}
                    introduction={place.introduction}
                    location={{
                      province: place.location.province,
                      district: place.location.district,
                    }}
                    name={place.placeName}
                    tag={place.tag}
                    selectBy={place.selectBy}
                    tripId={tripId}
                    onPressIcon={() => {
                      onPressRemove(place.placeId, place.placeName);
                    }}
                    showIcon={
                      place.selectBy.some((id) => userId === id.userId) || owner
                    }
                  />
                </View>
              ))}
            </View>
            {/* add button */}
            <Pressable
              onPress={onPressAddPlace}
              className="flex-col items-center"
            >
              <View className="border border-[#FFC502] rounded flex-row  w-[358px] justify-center items-center h-[48px] bg-[#FFF] mb-[16px]">
                <Plus />
                <Text className="ml-[4px] text-[#FFC502] font-bold">
                  เพิ่มสถานที่ท่องเที่ยว
                </Text>
              </View>
            </Pressable>
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
                title="ต่อไป"
                disable={places.length === 0}
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
            title={
              <Text className="font-bold">
                ลบ "{confirmModal.placeName}" ออกจากทริป
              </Text>
            }
            confirmTitle="ลบ"
            onPressCancel={() => {
              setConfirmModal({ display: false, placeId: "", placeName: "" });
            }}
            onPressConfirm={onPressConfirmRemove}
          />
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

export default PlaceSelect;
