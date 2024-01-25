import { View, Text, Image, Pressable } from "react-native";
import { MemberData } from "../../interface/invitation";

import Avatar from "../../assets/avatar.svg";
import PlusButton from "../../assets/invitation/PlusButton.svg";
import { Socket } from "socket.io-client";

const UserCard = ({
  data,
  ownerOfCard,
  ownerOfTrip,
  currentSocket,
}: {
  data: MemberData;
  ownerOfCard: boolean;
  ownerOfTrip: boolean;
  currentSocket: Socket | undefined;
}) => {
  const handleAddDatePicker = () => {
    console.log("hi");
  };

  return (
    <View className="w-[328px] bg-[#fff] p-[16px] flex-col rounded-[5px]">
      <View className="flex-row items-center mb-[8px]">
        {data.profileUrl === "" ? (
          <Avatar />
        ) : (
          <Image
            className="w-[44px] h-[44px] rounded-full"
            source={{
              uri: data.profileUrl,
            }}
          />
        )}
        <Text className="ml-[8px] font-bold text-[16px]">{data.username}</Text>
      </View>
      {data.date.map((date, index) => (
        <View key={index} className="mt-[8px]">
          <Text>dsa</Text>
        </View>
      ))}
      {ownerOfCard && (
        <View className="self-center mt-[8px]">
          <Pressable onPress={handleAddDatePicker}>
            <PlusButton />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default UserCard;
