import { View, Text, Pressable } from "react-native";

const ButtonCustom = ({
    disable = false,
    title = "",
    width = "",
    onPress = () => {},
    fill = "solid",
    size = "middle",
    styleText = "",
    styleButton = "",
}: {
    disable?: boolean;
    title?: string;
    width?: string;
    onPress?: () => void;
    fill?: string;
    size?: string;
    styleText?: string;
    styleButton?: string;
}) => {
    return (
        <>
            <Pressable
                onPress={() => {
                    if (!disable) onPress();
                }}
            >
                <View
                    className={`${width} mt-[8px] ${styleButton} ${
                        size === "middle"
                            ? "h-[48px] p-[12px]"
                            : "h-[32px] p-[4px]"
                    }  ${
                        fill === "solid"
                            ? disable
                                ? "bg-[#FFE89A] "
                                : "bg-[#FFC502]"
                            : disable
                            ? "border border-[#FFE89A] "
                            : "border border-[#FFC502]"
                    } flex-row justify-center items-center rounded `}
                >
                    <Text
                        className={`text-[16px] ${
                            fill === "solid"
                                ? "text-white font-bold"
                                : "text-[#FFC502]"
                        } ${styleText}  `}
                    >
                        {title}
                    </Text>
                </View>
            </Pressable>
        </>
    );
};

export default ButtonCustom;
