import { Pressable, Text, View } from "react-native";

const ConfirmModal = ({
  title = <></>,
  cancelTitle = "ยกเลิก",
  confirmTitle = "ตกลง",
  onPressCancel = () => {},
  onPressConfirm = () => {},
}: {
  title?: React.JSX.Element;
  cancelTitle?: string;
  confirmTitle?: string;
  onPressCancel?: () => void;
  onPressConfirm?: () => void;
}) => {
  return (
    <>
      <View className="p-[16px] w-[279px] flex-col items-center bg-white rounded-lg">
        <View className="mb-[8px] flex-col items-center ">{title}</View>
        <View className="flex-row ">
          <Pressable onPress={onPressCancel} className="mr-[16px]">
            <View className="h-[32px] w-[115.5px] border border-[#FFC502] rounded flex justify-center items-center">
              <Text className="text-[16px] text-[#FFC502]">{cancelTitle}</Text>
            </View>
          </Pressable>
          <Pressable onPress={onPressConfirm}>
            <View className="h-[32px] w-[115.5px] bg-[#FFC502] rounded flex justify-center items-center">
              <Text className="text-[16px] text-[#fff]">{confirmTitle}</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default ConfirmModal;
