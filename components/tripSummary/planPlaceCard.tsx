import { Text, Image, View } from "react-native";
import TextTitle from "../tripCreate/TextTitle";

const PlanPlaceCard = ({
  firstPlace,
  startTime,
  endTime,
  name,
  distance,
  location,
  coverImg,
}: {
  firstPlace: boolean;
  startTime: string;
  endTime: string;
  distance: number;
  location: { address: string; district: string; province: string };
  name: string;
  coverImg: string[];
}) => {
  return (
    <View className="flex-row mt-[16px] w-[282px] h-[96px] border rounded-[5px] p-[8px]">
      {/* cover img */}
      <View className="flex justify-center items-center border rounded-[5px] overflow-hidden w-[80px] h-[80px] mr-[16px]">
        <Image source={{ uri: coverImg[0] }} className="h-[80px] w-[100%]" />
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
  );
};

export default PlanPlaceCard;
