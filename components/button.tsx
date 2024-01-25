import { View, Text, Pressable } from "react-native";

const ButtonCustom = ({
  disable = false,
  title = "",
  width = "",
  onPress = () => {},
}: {
  disable?: boolean;
  title?: string;
  width?: string;
  onPress?: () => void;
}) => {
  return (
    <>
      <Pressable
        onPress={() => {
          if (!disable) onPress();
        }}
      >
        <View
          className={`${width} mt-[8px] h-[48px] p-[12px] ${
            disable ? "bg-[#FFE89A] " : "bg-[#FFC502]"
          } flex-row justify-center items-center rounded `}
        >
          <Text className="text-white text-[16px] font-bold ">{title}</Text>
        </View>
      </Pressable>
    </>
  );
};

export default ButtonCustom;
