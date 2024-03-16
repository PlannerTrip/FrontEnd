import { Pressable, View, Text } from "react-native";

import FirstInvite from "../../assets/invitation/firstInvite.svg";
import SecondInvite from "../../assets/invitation/inviteMoreThanOne.svg";

const InviteButton = ({
  length,
  getInvitationLink,
}: {
  length: number;
  getInvitationLink: () => void;
}) => {
  return (
    <Pressable onPress={getInvitationLink}>
      {length === 1 ? (
        <View className="mt-[16px] w-[130px] h-[40px] rounded-[100px] flex-row justify-center items-center px-[16px] py-[6px] bg-[#FFC502]">
          <FirstInvite />
          <Text className="ml-[8px] text-white font-bold text-[16px]">
            ชวนเพื่อน
          </Text>
        </View>
      ) : (
        <View className="mt-[16px] w-[165px] h-[40px] rounded-[100px] flex-row justify-center items-center px-[16px] py-[6px] border bg-white border-[#FFC502]">
          <SecondInvite />
          <Text className="ml-[8px] text-[#FFC502] font-bold text-[16px]">
            เข้าร่วม {length}/4 คน
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default InviteButton;
