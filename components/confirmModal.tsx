import { Pressable, Text, View } from "react-native";

const ConfirmModal = ({
    title = <></>,
    cancelTitle = "ยกเลิก",
    confirmTitle = "ตกลง",
    onPressCancel = () => {},
    onPressConfirm = () => {},
    cancel = true,
    confirm = true,
}: {
    title?: React.JSX.Element;
    cancelTitle?: string;
    confirmTitle?: string;
    onPressCancel?: () => void;
    onPressConfirm?: () => void;
    cancel?: boolean;
    confirm?: boolean;
}) => {
    return (
        <>
            <View className="p-[16px] w-[279px] flex-col items-center bg-white rounded-lg">
                <View className="mb-[8px] flex-col items-center ">{title}</View>
                <View className="flex-row ">
                    {cancel && (
                        <Pressable onPress={onPressCancel} style={{ flex: 1 }}>
                            <View className="h-[32px] border border-[#FFC502] rounded flex justify-center items-center">
                                <Text className="text-[16px] text-[#FFC502]">
                                    {cancelTitle}
                                </Text>
                            </View>
                        </Pressable>
                    )}
                    {confirm && (
                        <Pressable
                            onPress={onPressConfirm}
                            style={{ flex: 1 }}
                            className={cancel ? "ml-[16px]" : ""}
                        >
                            <View className="h-[32px]  bg-[#FFC502] rounded flex justify-center items-center">
                                <Text className="text-[16px] text-[#fff]">
                                    {confirmTitle}
                                </Text>
                            </View>
                        </Pressable>
                    )}
                </View>
            </View>
        </>
    );
};

export default ConfirmModal;
