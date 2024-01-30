import { Pressable, Text, View } from "react-native";

import CheckCircle from "../assets/modal/checkCircle.svg";
import CloseCircle from "../assets/modal/closeCircle.svg";

const Modal = ({
  title = "",
  supTitle = "",
  icon = "closeCircle",
  showIcon = true,
  onPress = () => {},
  buttonTitle = "ปิด",
}: {
  title?: string;
  supTitle?: string;
  icon?: "closeCircle" | "checkCircle";
  showIcon?: boolean;
  onPress?: () => void;
  buttonTitle?: string;
}) => {
  return (
    <View className="w-[278px] p-[16px] bg-[#fff] rounded-lg flex-col items-center">
      {showIcon && (
        <View className="mb-[8px]">
          {icon === "closeCircle" ? <CloseCircle /> : <CheckCircle />}
        </View>
      )}
      <View className="mb-[8px] flex-col items-center">
        {title !== "" && (
          <Text className="text-[16px] leading-6 font-bold">{title}</Text>
        )}
        {supTitle !== "" && <Text>{supTitle}</Text>}
      </View>
      <Pressable className="w-[100%]" onPress={onPress}>
        <View className="border border-[#FFC502] rounded h-[32px] flex justify-center items-center">
          <Text className="text-[#FFC502] text-[16px]">{buttonTitle}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default Modal;
