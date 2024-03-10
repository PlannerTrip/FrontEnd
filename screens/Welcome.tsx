import React from "react";
import { View, Text, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ButtonCustom from "../components/button";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../interface/navigate";

type Props = NativeStackScreenProps<StackParamList, "welcome">;

const Welcome = ({ navigation }: Props) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }}
            className="bg-[#FFFFFF] h-[100%] w-[100%] flex flex-col items-center justify-end"
        >
            <View className=" w-[100%] h-[100px] flex flex-grow items-center justify-center">
                <Image
                    source={require("../assets/welcome/welcomeImg.png")}
                    style={{ width: 469, height: 474 }}
                />
            </View>
            <Text className="text-[#261E00] text-[16px] leading-[24px] font-bold">
                จัดทริปเที่ยวไทยพร้อมกับเพื่อนร่วมเดินทางของคุณกับ
            </Text>
            <Text className="text-[#261E00] text-[40px] leading-[60px] font-bold">
                เที่ยวTrip
            </Text>
            <View className="w-[100%] p-[16px] mb-[16px]">
                <ButtonCustom
                    title="เข้าสู่ระบบ"
                    styleText="text-[#261E00]"
                    styleButton="mt-[0px]"
                    onPress={() => {
                        navigation.navigate("signIn");
                    }}
                />
                <ButtonCustom
                    title="ลงทะเบียน"
                    fill="outline"
                    styleButton="mt-[16px]"
                    onPress={() => {
                        navigation.navigate("signUp");
                    }}
                />
            </View>
        </View>
    );
};

export default Welcome;
