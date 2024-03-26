import { Image, View } from "react-native";

import { TripCard } from "../../interface/tripPlaner";

import DefaultImg from "../../assets/tripPlanner/Frame/Group 33653@2x.svg";
import { Text } from "react-native";
import TextTitle from "../tripCreate/TextTitle";
import { changeDateFormat2 } from "../../utils/function";
import MiniProfileCustom from "../miniProfile";
import ButtonCustom from "../button";

const TripCardCustom = ({
  information,
  onPress,
}: {
  information: TripCard;
  onPress: () => void;
}) => {
  return (
    <View className="w-[358px] h-[326px] rounded-[5px] border-[2px] border-[#54400E] p-[6px]">
      {/* img */}
      <View className="w-[342px] h-[200px] rounded-[5px] border border-[#54400E] bg-[#ECECEC] flex justify-center items-center  overflow-hidden relative">
        {information.coverImg ? (
          <Image
            source={{ uri: information.coverImg }}
            className="h-[200px] w-[100%]"
          />
        ) : (
          <DefaultImg />
        )}
        {/* province */}
        <View className="absolute bottom-[16px] right-[16px] flex flex-row">
          {information.province.map((province, index) => {
            return (
              <Text
                key={index}
                className="text-[12px] leading-[16px] text-white p-[4px] rounded-[2px] font-bold bg-[#FFC502] ml-[8px]"
              >
                {province}
              </Text>
            );
          })}
        </View>
      </View>
      {/* name and date */}
      <View className="mt-[8px] flex-row items-center justify-between">
        <View className="w-[180px] text-ellipsis">
          <TextTitle title={information.name} />
        </View>
        <Text className="text-[12px]">
          {changeDateFormat2(information.date.start)} -{" "}
          {changeDateFormat2(information.date.end)}
        </Text>
      </View>
      {/* mini profile */}
      <View className="h-[20px] flex-row">
        <Text className="text-[12px]">ผู้เดินทาง</Text>
        {information.member.map((user) => (
          <MiniProfileCustom
            profileUrl={user.userprofile}
            username={user.username}
            key={user.userId}
          />
        ))}
      </View>
      {/* button  */}
      <ButtonCustom title="แผนการเดินทาง" onPress={onPress} />
    </View>
  );
};

export default TripCardCustom;
