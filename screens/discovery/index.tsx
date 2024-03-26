import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import * as SecureStore from "expo-secure-store";
import axios, { AxiosResponse } from "axios";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { API_URL } from "@env";
import { StackParamList } from "../../interface/navigate";
import LocationCard from "../../components/Discovery/locationCard";
import SearchCustom from "../../components/search";
import { ScrollView } from "react-native";
import { LOADING, SUCCESS } from "../../utils/const";
import { AuthData } from "../../contexts/authContext";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import Loading from "../Loading";
import Empty from "../../assets/placeSelect/empty.svg";

type Props = NativeStackScreenProps<StackParamList, "discovery">;

const Discovery = ({ navigation }: Props) => {
  const { token } = useContext(AuthData);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(LOADING);
  const [placeIdList, setPlaceIdList] = useState([]);

  const insets = useSafeAreaInsets();

  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        setStatus(LOADING);
        getRecommend();

        return () => {
          console.log("didnt focus");
        };
      }
    }, [isFocused]),
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== "") {
        setStatus(LOADING);
        getSearchData();
      } else {
        setStatus(LOADING);
        getRecommend();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [search]);

  const getSearchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/place/search`, {
        params: { tripId: "", input: search, onlyId: "yes" },
        headers: {
          authorization: token,
        },
      });
      console.log(response.data);
      setPlaceIdList(
        response.data.map((item) => ({ type: "ATTRACTION", placeId: item })),
      );
      setStatus(SUCCESS);
    } catch (err) {
      console.log(err);
    }
  };

  const getRecommend = async () => {
    try {
      const response = await axios.get(`${API_URL}/place/recommend`, {
        params: { tripId: "", onlyId: "yes" },
        headers: {
          authorization: token,
        },
      });
      setPlaceIdList(
        response.data.map((item) => ({ type: "ATTRACTION", placeId: item })),
      );
      setStatus(SUCCESS);
    } catch (err) {
      console.log(err);
    }
  };

  const createTrip = async () => {
    try {
      console.log("createTrip");
      const token = await SecureStore.getItemAsync("key");
      const response: AxiosResponse<{ tripId: string }> = await axios.post(
        `${API_URL}/trip`,
        {},
        {
          headers: {
            Authorization: token,
          },
        },
      );
      navigation.navigate("invitation", {
        tripId: response.data.tripId,
      });
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data);
      }
    }
  };

  const handlePlaceInformation = (place) => {
    navigation.navigate("placeInformation", {
      placeId: place.placeId,
      type: place.type,
      forecastDate: place.forecastDate,
      forecastDuration: place.forecastDuration,
      from: "discovery",
    });
  };

  const mock = [
    { placeId: "P08000001", type: "ATTRACTION" },
    { placeId: "P03025435", type: "ATTRACTION" },
    { placeId: "P02000001", type: "ACCOMMODATION" },
    { placeId: "P08000011", type: "RESTAURANT" },
  ];

  return (
    <View className="h-[100%] bg-white flex flex-col">
      <View
        className="bg-[#FCF8EF] "
        style={{
          paddingTop: insets.top,

          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        <View className="h-[156px] bg-[#FCF8EF] p-[16px]   flex-col gap-[16px]">
          <Text className="leading-[60px] text-[40px] font-bold">
            ไปเที่ยวกันเถอะ{" "}
          </Text>
          <Pressable onPress={createTrip}>
            <View className="h-[48px] p-[12px] bg-[#FFC502] flex-row justify-center items-center rounded ">
              <Text className="text-white text-[16px] font-bold ">
                เริ่มจัดทริป
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View className="pt-[16px] px-[16px] bg-white ">
        <Text className="text-[24px] font-bold">สถานที่ท่องเที่ยวแนะนำ</Text>
        <View>
          <SearchCustom
            placeholder="ค้นหาสถานที่ท่องเที่ยว"
            showArrow={false}
            search={search}
            setSearch={setSearch}
          />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {status === LOADING ? (
          <View className="grow bg-white flex justify-center items-center relative top-[100px]">
            <Loading />
          </View>
        ) : placeIdList.length === 0 ? (
          <View
            className={` bg-white  grow flex justify-center items-center relative top-[100px]`}
          >
            <Empty />
          </View>
        ) : (
          <View className="grow bg-white">
            {placeIdList.map((place) => {
              return (
                <View className="mt-[16px]" key={place.placeId}>
                  <Pressable onPress={() => handlePlaceInformation(place)}>
                    <LocationCard key={place.placeId} place={place} />
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Discovery;
