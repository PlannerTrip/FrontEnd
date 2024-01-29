import { View, Text, Image, Pressable } from "react-native";
import { MemberData } from "../../interface/invitation";

import Avatar from "../../assets/avatar.svg";
import PlusButton from "../../assets/invitation/PlusButton.svg";
import Close from "../../assets/invitation/Close.svg";

import { Socket } from "socket.io-client";

import { REMOVEFRIEND } from "../../utils/const";

const UserCard = ({
  data,
  ownerOfCard,
  ownerOfTrip,
  currentSocket,
  setConfirmModal,
}: {
  data: MemberData;
  ownerOfCard: boolean;
  ownerOfTrip: boolean;
  currentSocket: Socket | undefined;
  setConfirmModal: React.Dispatch<
    React.SetStateAction<{
      display: boolean;
      type: string;
      userId: string;
      name: string;
    }>
  >;
}) => {
  const handleAddDatePicker = () => {
    console.log("hi");
    // call bacnkend
  };

  const handleRemoveFriend = () => {
    setConfirmModal({
      display: true,
      type: REMOVEFRIEND,
      userId: data.userId,
      name: data.username,
    });
  };
  return (
    <View className="w-[328px] bg-[#fff] p-[16px] flex-col rounded-[5px] mt-[16px] relative">
      {/* header */}
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
      {/* close buuton */}
      {ownerOfTrip && !ownerOfCard && (
        <Pressable
          className="absolute right-[7px] top-[7px]"
          onPress={handleRemoveFriend}
        >
          <View>
            <Close />
          </View>
        </Pressable>
      )}
      {/* date picker */}
      {data.date.map((date, index) => (
        <View key={index} className="mt-[8px]">
          <Text>dsa</Text>
        </View>
      ))}
      {/* add date picker button */}
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
