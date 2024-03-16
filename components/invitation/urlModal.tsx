import { View, Text } from "react-native";
import ButtonCustom from "../button";

const UrlModal = ({
  onPressConfirm,
  length,
  inviteUrl,
}: {
  onPressConfirm: () => void;
  length: number;
  inviteUrl: string;
}) => {
  return (
    <View className="pt-[16px] bg-[#fff] rounded-lg w-[279px] px-[12px] flex-col items-center pb-[12px]">
      {length === 1 && (
        <Text className="mb-[10px] text-[16px] font-bold">
          ชวนเพื่อนสำเร็จแล้ว
        </Text>
      )}
      <Text className="text-[16px] mb-[28px]">{inviteUrl}</Text>
      <ButtonCustom title="OK" width="w-[255px]" onPress={onPressConfirm} />
    </View>
  );
};

export default UrlModal;
