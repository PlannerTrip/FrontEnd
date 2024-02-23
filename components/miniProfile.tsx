import { View, Text, Image } from "react-native";

import Avatar from "../assets/avatarMiniprofile.svg";

const MiniProfileCustom = ({
  username,
  profileUrl,
}: {
  username: string;
  profileUrl: string;
}) => {
  console.log(profileUrl);
  return (
    <View className="flex-row items-center ml-[8px]">
      <View className="rounded-full w-[20px] h-[20px] flex justify-center items-center overflow-hidden">
        {profileUrl !== "" ? (
          <Image source={{ uri: profileUrl }} className="h-[20px] w-[100%]" />
        ) : (
          <Avatar />
        )}
      </View>
      <Text className="text-[12px] ml-[4px]">{username}</Text>
    </View>
  );
};

export default MiniProfileCustom;
