import { View, Image } from "react-native";
import TextTitle from "../tripCreate/TextTitle";

import Avatar from "../../assets/tripSummary/avatar.svg";

const MemberCard = ({
  profileUrl,
  username,
}: {
  profileUrl: string;
  username: string;
}) => {
  return (
    <View className="w-[358px] h-[76px] p-[16px] items-center flex-row justify-between bg-white mt-[16px] rounded-[5px]">
      <View className="flex-row items-center">
        <View className="rounded-full w-[44px] h-[44px] flex justify-center items-center overflow-hidden mr-[8px]">
          {profileUrl !== "" ? (
            <Image source={{ uri: profileUrl }} className="h-[44px] w-[100%]" />
          ) : (
            <Avatar />
          )}
        </View>
        <TextTitle title={username} />
      </View>
      <TextTitle title="(หัวหน้า)" color="#9898AA" />
    </View>
  );
};

export default MemberCard;
