import React, { useState } from "react";
import { View, Text, Dimensions, Pressable } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ThailandMap from "../../components/achievement/thailandMap";
import { MAP, MAP_LABEL, MISSION, MISSION_LABEL } from "../../utils/const";

const Achievement = () => {
  const insets = useSafeAreaInsets();

  const { height } = Dimensions.get("screen");

  const [currentTab, setCurrentTab] = useState(MAP);
  const [province, setProvince] = useState("");

  const [displayBottomSheet, setDisplayBottomSheet] = useState(false);

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
        <ThailandMap setProvince={setProvince} province={province} />
      </View>

      {displayBottomSheet ? (
        <>
          <View className="absolute z-[10] top-0 bg-[#0000008C] w-[100%] h-[100vh] flex-col  justify-end "></View>

          <Pressable
            className="h-[44px] px-[18px] w-[100%] absolute bottom-0 z-[20]  bg-white flex flex-row items-center rounded-t-[10px]"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -1 }, // Adjusted height to -10 to apply shadow at the top
              shadowOpacity: 0.1,
              shadowRadius: 2,
            }}
            onPress={() => {
              setDisplayBottomSheet(false);
            }}
          >
            <Text
              className={`text-[16px] leading-[24px] ${province === "" && "text-[#D9D9D9]"}`}
            >
              {province === "" ? "เลือกจังหวัด" : province}
            </Text>
          </Pressable>
        </>
      ) : (
        <Pressable
          className="h-[44px] px-[18px] w-[100%] absolute bottom-0  bg-white flex flex-row items-center rounded-t-[10px]"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -1 }, // Adjusted height to -10 to apply shadow at the top
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
          onPress={() => {
            setDisplayBottomSheet(true);
          }}
        >
          <Text
            className={`text-[16px] leading-[24px] ${province === "" && "text-[#D9D9D9]"}`}
          >
            {province === "" ? "เลือกจังหวัด" : province}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default Achievement;
