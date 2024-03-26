import { View, Text, Dimensions, Pressable } from "react-native";

import Gold from "../../assets/achievement/Gold.svg";
import Stamp from "../../assets/achievement/Stamp.svg";
import Down from "../../assets/Down-down.svg";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Icon } from "@ui-kitten/components";

const MissionProvince = ({
  title,
  provinces,
  checkIn,
}: {
  title: string;
  provinces: string[];
  checkIn: string[];
}) => {
  const [displayProvince, setDisplayProvince] = useState(false);

  const { width } = Dimensions.get("screen");

  return (
    <View className="flex flex-row w-[100%] mt-[8px] ">
      {/* title */}
      <View className="flex flex-row items-center p-[8px] bg-[#FFFFFF] rounded-l-[5px] grow">
        <Gold />

        <View className="ml-[8px] flex flex-col grow ">
          <View className="flex flex-row justify-between">
            <Text className="text-[16px] leading-[24px] font-bold  ">
              {title}
            </Text>

            <Pressable
              onPress={() => {
                setDisplayProvince(!displayProvince);
              }}
            >
              <Icon
                fill={"#222222"}
                style={{ width: 24, height: 24 }}
                name={
                  !displayProvince
                    ? "arrow-ios-downward-outline"
                    : "arrow-ios-upward-outline"
                }
              />
            </Pressable>
          </View>

          {displayProvince && (
            <View
              style={{
                flexWrap: "wrap",
                flexDirection: "row",
                width: width - 80 - 8 - 70 - 32,
              }}
            >
              {provinces.map((province, index) => {
                const isCheckIn = checkIn.includes(province);
                return (
                  <Text
                    className={`text-[12px] leading-[16px] font-bold  ${isCheckIn ? "text-[#FFC502]" : "text-[#9898AA]"}`}
                    style={{ width: (width - 80 - 8 - 70 - 32) / 2 }}
                    key={index}
                  >
                    {province}
                  </Text>
                );
              })}
            </View>
          )}
        </View>
      </View>

      <View className="p-[8px] bg-[#FFF9E6] rounded-r-[5px] flex flex-row items-center justify-center w-[70px]">
        {checkIn.length < provinces.length ? (
          <Text className="text-[12px] leading-[20px] font-bold ">
            {checkIn.length} / {provinces.length}
          </Text>
        ) : (
          <Stamp />
        )}
      </View>
    </View>
  );
};

export default MissionProvince;
