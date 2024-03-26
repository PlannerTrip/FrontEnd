import { Text, Image, View } from "react-native";
import TextTitle from "../tripCreate/TextTitle";
import { Pressable } from "react-native";
import ButtonCustom from "../button";
import * as Linking from "expo-linking";

const PlanPlaceCard = ({
  firstPlace,
  startTime,
  endTime,
  name,
  distance,
  location,
  coverImg,
  currentPlace = false,
  onPressCheckIn,
  onPressSkip,
  latitude = 0,
  longitude = 0,
}: {
  firstPlace: boolean;
  startTime: string;
  endTime: string;
  distance: number;
  location: { address: string; district: string; province: string };
  name: string;
  coverImg: string[];
  currentPlace?: boolean;
  onPressCheckIn?: () => void;
  onPressSkip?: () => void;
  latitude?: number;
  longitude?: number;
}) => {
  const handleMap = () => {
    Linking.openURL(`https://www.google.com/maps?q=${latitude},${longitude}`);
  };

  return (
    <View className=" mt-[16px] w-[282px]  border rounded-[5px] p-[8px] bg-white">
      {/* cover img */}
      <View className="flex-row">
        <View className="flex justify-center items-center border rounded-[5px] overflow-hidden w-[80px] h-[80px] mr-[16px]">
          {coverImg && coverImg[0] && (
            <Image
              source={{ uri: coverImg[0] }}
              className="h-[80px] w-[100%]"
            />
          )}
        </View>

        <View>
          {/* name */}
          <TextTitle title={name} additionalClass="w-[148px] mb-[16px]" />
          {/* location */}
          <View className="flex-row  items-center ">
            <Text className="text-[#FFC502] text-[12px] font-bold leading-[18px]">
              {location.district},{location.province}
            </Text>
          </View>
          {/* distant */}
          <View className="flex-row mt-[4px] items-center ">
            <Text className="text-[#FFC502] text-[12px] font-bold leading-[18px]">
              {firstPlace
                ? `จุดเริ่มต้น`
                : `ห่างจากจุดที่แล้ว ${distance.toFixed(2)} กม.`}
            </Text>
          </View>
        </View>
      </View>
      {currentPlace && (
        <View className="flex-row ">
          <ButtonCustom
            title="เช็คอิน"
            styleButton=" w-[100%] "
            size="verySmall"
            styleText="text-[12px]"
            onPress={onPressCheckIn}
          />
          <Pressable className="w-[59px] ml-[4px] mt-[8px]" onPress={handleMap}>
            <View className="border border-[#FFC502] rounded h-[26px] flex justify-center items-center">
              <Text className="text-[#FFC502] text-[16px] font-bold">
                นำทาง
              </Text>
            </View>
          </Pressable>
          <Pressable
            className="w-[45px] ml-[4px] mt-[8px]"
            onPress={onPressSkip}
          >
            <View className="border border-[#FFC502] rounded h-[26px] flex justify-center items-center">
              <Text className="text-[#FFC502] text-[16px] font-bold">ข้าม</Text>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default PlanPlaceCard;
