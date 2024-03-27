import axios from "axios";
import { Image } from "react-native";
import { Socket, io } from "socket.io-client";
import { AuthData } from "../../contexts/authContext";
import { StackParamList } from "../../interface/navigate";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useContext, useEffect, useState } from "react";

// ====================== svg ======================

import ArrowLeft from "../../assets/invitation/Arrow_left.svg";
import Empty from "../../assets/placeSelect/empty.svg";

import { Place } from "../../interface/placeDiscovery";

import PlaceCard from "../../components/placeSelect/placeCard";
import Loading from "../Loading";

import { API_URL } from "@env";
import { LOADING, SUCCESS } from "../../utils/const";
import SearchCustom from "../../components/search";

type Props = NativeStackScreenProps<StackParamList, "placeDiscovery">;

const PlaceDiscovery = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const { token } = useContext(AuthData);

  const isFocused = useIsFocused();

  const { tripId } = route.params;

  const suggest = "suggest";
  const bookmark = "bookmark";

  // ====================== useState ======================

  const [currentTab, setCurrentTab] = useState(suggest);
  const [places, setPlaces] = useState<Place[]>([]);
  const [status, setStatus] = useState(LOADING);
  const [search, setSearch] = useState("");
  const [displaySearch, setDisplaySearch] = useState(false);

  // ====================== useFocusEffect ======================

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        const socket = io(`${API_URL}`, {
          transports: ["websocket"],
        });
        handleSocket(socket);

        setCurrentTab(suggest);

        // get place
        handleGetData(suggest);

        return () => {
          socket.disconnect();
          console.log("didnt focus");
        };
      }
    }, [tripId, isFocused]),
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (displaySearch && search !== "") {
        setStatus(LOADING);
        getSearchData();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [search, displaySearch]);

  // ====================== function ======================

  const handleSocket = (socket: Socket) => {
    socket.on("connect", () => {
      console.log("connect");
    });

    socket.emit("joinTrip", tripId);

    socket.on("updateStage", (data: { stage: string }) => {
      if (data.stage === "planSelect") {
        navigation.navigate("planSelect", { tripId: tripId });
      } else if (data.stage === "invitation") {
        navigation.navigate("invitation", { tripId: tripId });
      }
    });

    socket.on("connect_error", (error) => {
      console.log("Socket Error", error.message);
    });
  };

  const onPressBack = () => {
    navigation.navigate("placeSelect", { tripId });
  };

  const handleGetData = (tab: string) => {
    setStatus(LOADING);
    if (tab === bookmark) {
      getBookMark();
    } else if (tab === suggest) {
      getRecommend();
    }
  };

  const getBookMark = async () => {
    try {
      const response = await axios.get(`${API_URL}/place/bookmark`, {
        params: { tripId: tripId },
        headers: {
          authorization: token,
        },
      });
      setPlaces(response.data);
      setStatus(SUCCESS);
    } catch (err) {
      console.log(err);
    }
  };

  const getRecommend = async () => {
    try {
      const response = await axios.get(`${API_URL}/place/recommend`, {
        params: { tripId: tripId },
        headers: {
          authorization: token,
        },
      });
      setPlaces(response.data);
      setStatus(SUCCESS);
    } catch (err) {
      console.log(err);
    }
  };

  const getSearchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/place/search`, {
        params: { tripId: tripId, input: search },
        headers: {
          authorization: token,
        },
      });
      setPlaces(response.data);
      setStatus(SUCCESS);
    } catch (err) {
      console.log(err);
    }
  };

  const onPressIcon = async (placeId: string) => {
    try {
      await axios.post(
        `${API_URL}/trip/place`,
        { placeId: placeId, tripId: tripId },
        {
          headers: {
            authorization: token,
          },
        },
      );
      setPlaces((places) =>
        places.map((place) => {
          if (place.placeId === placeId) {
            return { ...place, alreadyAdd: !place.alreadyAdd };
          }
          return place;
        }),
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
        className="bg-[#FFF] h-[100%] flex-col"
      >

        <View className="h-[80px] items-end px-[16px] pt-[16px] bg-[#FFF]  flex-row justify-between">
          {displaySearch ? (
            <View className="pb-[12px] w-[100%]">
              <SearchCustom
                handleGoBack={() => {
                  setDisplaySearch(false);
                  setSearch("");
                  handleGetData(currentTab);
                }}
                placeholder="พิมพ์คำที่ต้องการค้นหา"
                setSearch={setSearch}
                search={search}
              />
            </View>
          ) : (
            // header
            <>
              <Pressable onPress={onPressBack} className="mb-[16px]">
                <ArrowLeft />
              </Pressable>
              {/* tab */}
              <View className="w-[262px] h-[80px] items-end flex-row justify-between">
                <Pressable
                  onPress={() => {
                    setCurrentTab(suggest);
                    handleGetData(suggest);
                  }}
                  className={`w-[123px] h-[48px] ${
                    currentTab === suggest
                      ? "border-b-[2px] border-[#FFC502]"
                      : ""
                  } flex justify-center items-center`}
                >
                  <Text
                    className={`${
                      currentTab === suggest ? "text-[#FFC502] " : ""
                    } font-bold`}
                  >
                    แนะนำ
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setCurrentTab(bookmark);
                    handleGetData(bookmark);
                  }}
                  className={`w-[123px] h-[48px]    flex justify-center items-center  ${
                    currentTab === bookmark
                      ? "border-b-[2px] border-[#FFC502]"
                      : ""
                  }`}
                >
                  <Text
                    className={` ${
                      currentTab === bookmark ? "text-[#FFC502] " : ""
                    } font-bold`}
                  >
                    บุ๊กมาร์ก
                  </Text>
                </Pressable>
              </View>
              <Pressable
                className="mb-[16px]"
                onPress={() => {
                  setDisplaySearch(true);
                }}
              >
                <Image
                  source={require("../../assets/placeDiscovery/search.png")}
                />
              </Pressable>
            </>
          )}
        </View>
        {/* content */}
        {status === LOADING ? (
          <View
            className={`bg-[#F5F5F5] grow flex justify-center items-center`}
          >
            <Loading />
          </View>
        ) : places.length === 0 ? (
          <View
            className={`bg-[#F5F5F5] grow flex justify-center items-center`}
          >
            <Empty />
          </View>
        ) : (
          <ScrollView className={`bg-[#F5F5F5] `}>
            <View className="mt-[16px] flex-col items-center">
              {places.map((place) => (
                <View className="mb-[16px]" key={place.placeId}>
                  <PlaceCard
                    coverImg={place.coverImg}
                    forecast={place.forecasts}
                    introduction={place.introduction}
                    location={place.location}
                    name={place.placeName}
                    onPressIcon={() => {
                      onPressIcon(place.placeId);
                    }}
                    tag={place.tag}
                    tripId={tripId}
                    showSelectBy={false}
                    iconType={place.alreadyAdd ? "correct" : "plus"}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
};

export default PlaceDiscovery;
