import React, { useCallback, useContext, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ThailandMap from "../../components/achievement/thailandMap";
import { MAP, MAP_LABEL, MISSION, MISSION_LABEL } from "../../utils/const";
import RNPickerSelect from "react-native-picker-select";
import { province_names } from "../../utils/mapData";
import { AuthData } from "../../contexts/authContext";
import axios from "axios";
import { API_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";

import Down from "../../assets/Down-down.svg";
import Empty from "../../assets/achievement/empty.svg";
import CoverImage from "../../assets/achievement/defaultCoverImage.svg";

const Achievement = () => {
  const insets = useSafeAreaInsets();

  const { width, height } = Dimensions.get("screen");

  const [currentTab, setCurrentTab] = useState(MAP);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [checkInProvinces, setCheckInProvince] = useState([]);
  const [provinces, setProvince] = useState([]);
  const [options, setOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [places, setPlaces] = useState([
    // {
    //   district: "district",
    //   placeName: "placeName",
    //   coverImg: "coverImg",
    //   date: "date",
    // },
  ]);

  const [displayBlack, setDisplayBlack] = useState(false);
  const [displayBottomSheet, setDisplayBottomSheet] = useState(false);

  const { token } = useContext(AuthData);

  const placeholder = {
    label: "เลือกจังหวัด",
    value: "",
  };

  useFocusEffect(
    useCallback(() => {
      if (selectedProvince) {
        setDisplayBottomSheet(true);
      }
    }, [selectedProvince]),
  );

  useFocusEffect(
    useCallback(() => {
      getMap();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const createOptions = provinces.map((province) => ({
        label: province,
        value: province,
      }));

      setOptions(createOptions);
    }, [provinces]),
  );

  // =============== axios ===============
  const getMap = async () => {
    try {
      const response = await axios.get(`${API_URL}/achievement/map`, {
        headers: {
          authorization: token,
        },
      });

      setProvince(response.data.allProvince);
      setCheckInProvince(response.data.alreadyCheckIn);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data);
      }
    }
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="bg-[#FFFFFF] h-[100%] w-[100%] overflow-scroll relative"
    >
      {/* header */}
      <View
        className={` bg-[#FFFFFF]`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
      >
        <View className="w-[100%] h-[80px] items-end flex-row justify-center">
          <Pressable
            onPress={() => {
              setCurrentTab(MAP);
            }}
            className={`w-[171px] h-[48px] ${
              currentTab === MAP ? "border-b-[2px] border-[#FFC502]" : ""
            } flex justify-center items-center mr-[16px]`}
          >
            <Text
              className={`${
                currentTab === MAP ? "text-[#FFC502] " : ""
              } font-bold`}
            >
              {MAP_LABEL}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setCurrentTab(MISSION);
            }}
            className={`w-[171px] h-[48px]    flex justify-center items-center  ${
              currentTab === MISSION ? "border-b-[2px] border-[#FFC502]" : ""
            }`}
          >
            <Text
              className={` ${
                currentTab === MISSION ? "text-[#FFC502] " : ""
              } font-bold`}
            >
              {MISSION_LABEL}
            </Text>
          </Pressable>
        </View>
      </View>

      <View className=" grow ">
        <ThailandMap
          setProvince={setSelectedProvince}
          province={selectedProvince}
          checkInProvinces={checkInProvinces}
        />
      </View>

      {displayBlack && (
        <View className="absolute z-[10] top-0 bg-[#0000008C] w-[100%] h-[100vh] flex-col  justify-end "></View>
      )}

      <View
        className="z-[20] w-[100%] absolute bottom-0  bg-white flex flex-col  rounded-t-[10px]"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -1 }, // Adjusted height to -10 to apply shadow at the top
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
      >
        <RNPickerSelect
          placeholder={placeholder}
          items={options}
          onValueChange={(value) => {
            setSelectedProvince(value);
          }}
          value={selectedProvince}
          onOpen={() => {
            setDisplayBottomSheet(true);
            setDisplayBlack(true);
          }}
          style={{
            inputIOS: {
              fontSize: 16,
              paddingVertical: 12,
              paddingHorizontal: 10,
              marginLeft: 16,
              color: "black",
              paddingRight: 30,
              width:
                selectedProvince === "" ? width - 16 * 2 : width - 16 * 2 - 180,
              height: 44,
              position: "relative",
              fontWeight: "bold",
            },
            inputAndroid: {
              fontSize: 16,
              paddingHorizontal: 10,
              paddingVertical: 8,
              marginLeft: 16,
              color: "black",
              paddingRight: 30,
              width: width - 16 * 2,
              height: 44,
              position: "relative",
            },
            iconContainer: {
              display: "none",
            },
          }}
        />

        {displayBottomSheet && (
          <>
            <Pressable
              onPress={() => {
                setSelectedProvince("");
                setPlaces([]);
                setDisplayBlack(false);
                setDisplayBottomSheet(false);
              }}
              className="absolute right-[16px] flex flex-row items-center h-[44px]"
            >
              <Text className="text-[12px] leading-[18px] mr-[8px]">
                คุณเช็คอินไปแล้ว 4 สถานที่
              </Text>
              <Down />
            </Pressable>

            <ScrollView
              className="h-[288px] border-t border-[#D9D9D9]"
              bounces={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              {places.length ? (
                <>
                  {places.map((place, index) => {
                    const district = place.district;
                    const placeName = place.placeName;
                    const coverImg = place.coverImg;
                    const date = "เช็คอินเมื่อ 12/12/2023";
                    return (
                      <View
                        key={index}
                        className={`px-[16px] py-[8px] h-[96px] flex flex-row`}
                      >
                        {coverImg ? (
                          <View className="border border-[#54400E] rounded-[5px]">
                            <Image
                              source={{
                                uri: coverImg,
                              }}
                              className="w-[80px] h-[80px]  "
                            />
                          </View>
                        ) : (
                          <CoverImage />
                        )}

                        <View className="ml-[16px] flex flex-col">
                          <View className="flex flex-col justify-between flex-1 ">
                            <Text
                              style={{
                                width: width - (16 * 2 + 8 * 2 + 16 + 24) - 100,
                              }}
                              className={`text-[14px] truncate font-bold`}
                              numberOfLines={1}
                            >
                              {placeName}
                            </Text>

                            <Text className="text-[12px] font-bold text-[#FFC502]">
                              {district}
                            </Text>
                          </View>
                          <Text className="text-[12px] font-bold text-[#FFC502] mt-[4px]">
                            {date}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </>
              ) : (
                <View className="justify-center flex flex-row items-center h-[288px]">
                  {selectedProvince !== "" && <Empty />}
                </View>
              )}
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
};

export default Achievement;
