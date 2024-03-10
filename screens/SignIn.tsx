import React, { useContext, useEffect, useRef, useState } from "react";
import { Keyboard, Pressable } from "react-native";
import { View, Text } from "react-native";
import { API_URL } from "@env";

import { TextInput } from "react-native-paper";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../interface/navigate";
import * as SecureStore from "expo-secure-store";
import { AuthData } from "../contexts/authContext";
import { SUCCESS } from "../utils/const";
import ButtonCustom from "../components/button";
import { isValidEmail } from "../utils/function";

type Props = NativeStackScreenProps<StackParamList, "signIn">;

const SignIn = ({ route, navigation }: Props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorEmail, setErrorEmail] = useState({
        text: "",
        error: false,
    });
    const [errorPassword, setErrorPassword] = useState({
        text: "",
        error: false,
    });

    const { setIsSignedIn, setAuthInformation } = useContext(AuthData);

    const insets = useSafeAreaInsets();

    const login = async () => {
        Keyboard.dismiss();

        let invalid = false;

        if (email === "") {
            setErrorEmail({
                text: "กรุณากรอกอีเมล",
                error: true,
            });
            invalid = true;
        } else {
            if (!isValidEmail(email)) {
                setErrorEmail({
                    text: "รูปแบบอีเมลผิด ลองใหม่อีกครั้ง",
                    error: true,
                });
                invalid = true;
            }
        }
        if (password === "") {
            setErrorPassword({
                text: "กรุณากรอกรหัสผ่าน",
                error: true,
            });
            invalid = true;
        }

        if (!invalid) {
            try {
                const response = await axios.post(`${API_URL}/login`, {
                    email: email,
                    password: password,
                });

                await SecureStore.setItemAsync("key", response.data.token);
                if (setIsSignedIn) setIsSignedIn(true);
                if (setAuthInformation)
                    setAuthInformation({
                        token: response.data.token,
                        authStatus: SUCCESS,
                        userId: response.data.userId,
                    });
            } catch (error) {
                console.log(error);
                setErrorEmail({
                    text: "",
                    error: true,
                });
                setErrorPassword({
                    text: "อีเมลหรือรหัสผ่านผิด ลองใหม่อีกครั้ง",
                    error: true,
                });
                invalid = true;
            }
        } else {
        }
    };
    const [hidePassword, setHidePassword] = useState(true);
    const [allowClearEmail, setAllowClearEmail] = useState(false);
    const [allowClearPassword, setAllowClearPassword] = useState(false);

    return (
        <Pressable
            onPress={() => Keyboard.dismiss()}
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }}
            className="bg-[#FFFFFF] h-[100%] w-[100%] flex flex-col justify-end"
        >
            <View className="w-[100%] flex flex-grow items-center justify-center">
                <Text className="text-[#261E00] text-[40px] leading-[60px] font-bold">
                    เข้าสู่ระบบ
                </Text>

                <View className="w-[100%] p-[16px] mt-[16px]">
                    <TextInput
                        mode="outlined"
                        label="อีเมล"
                        value={email}
                        activeOutlineColor={
                            errorEmail.error ? "#FF3141" : "#111111"
                        }
                        outlineColor={errorEmail.error ? "#FF3141" : "#111111"}
                        autoCapitalize="none"
                        returnKeyType="next"
                        contentStyle={{
                            height: 48,
                            padding: 12,
                            fontWeight: "normal",
                        }}
                        outlineStyle={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 6,
                            borderColor: errorEmail.error
                                ? "#FF3141"
                                : "#111111",
                            borderWidth: 1,
                        }}
                        style={{
                            fontWeight: "bold",
                        }}
                        onSubmitEditing={(value) =>
                            setEmail(value.nativeEvent.text.trim())
                        }
                        right={
                            allowClearEmail && (
                                <TextInput.Icon
                                    onPress={() => {
                                        setEmail("");
                                        setAllowClearEmail(false);
                                    }}
                                    icon={"close"}
                                />
                            )
                        }
                        onChangeText={(text) => {
                            setEmail(text);
                            if (text) {
                                setAllowClearEmail(true);
                            } else {
                                setAllowClearEmail(false);
                            }
                        }}
                        onFocus={() => {
                            setErrorEmail({
                                text: "",
                                error: false,
                            });
                            setErrorPassword({
                                text: "",
                                error: false,
                            });
                        }}
                    />

                    <Text className="leading-[18px] mb-[6px] text-[12px] h-[18px] font-bold text-[#FF3141]">
                        {errorEmail.text}
                    </Text>

                    <TextInput
                        mode="outlined"
                        label="รหัสผ่าน"
                        value={password}
                        activeOutlineColor={
                            errorPassword.error ? "#FF3141" : "#111111"
                        }
                        outlineColor={
                            errorPassword.error ? "#FF3141" : "#111111"
                        }
                        autoCapitalize="none"
                        returnKeyType="next"
                        secureTextEntry={hidePassword}
                        contentStyle={{
                            height: 48,
                            padding: 12,
                            fontWeight: "normal",
                        }}
                        outlineStyle={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 6,
                            borderColor: errorPassword.error
                                ? "#FF3141"
                                : "#111111",
                            borderWidth: 1,
                        }}
                        style={{
                            fontWeight: "bold",
                        }}
                        right={
                            <TextInput.Icon
                                onPress={() => {
                                    setHidePassword(!hidePassword);
                                    Keyboard.dismiss();
                                }}
                                icon={hidePassword ? "eye-off" : "eye"}
                            />
                        }
                        textContentType="password"
                        onFocus={() => {
                            setPassword("");
                            setErrorEmail({
                                text: "",
                                error: false,
                            });
                            setErrorPassword({
                                text: "",
                                error: false,
                            });
                        }}
                        onChangeText={(text) => {
                            setPassword(text);
                        }}
                    />

                    <Text className="leading-[18px] mb-[16px] text-[12px] h-[18px] font-bold text-[#FF3141]">
                        {errorPassword.text}
                    </Text>

                    <ButtonCustom
                        title="เข้าสู่ระบบ"
                        styleText="text-[#111111]"
                        onPress={login}
                    />
                </View>
            </View>

            <View className="flex flex-col items-center mb-[32px]">
                <Pressable onPress={() => navigation.navigate("signUp")}>
                    <Text className="text-[#261E00] text-[16px] leading-[24px] font-bold">
                        ยังไม่มีบัญชีต้องการ{" "}
                        <Text className="text-[#FFC502]">ลงทะเบียน</Text>
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => navigation.navigate("changePassword")}
                    className="mt-[8px]"
                >
                    <Text className="text-[#FFC502] text-[12px] leading-[18px] font-bold">
                        ลืมรหัสผ่าน?
                    </Text>
                </Pressable>
            </View>
        </Pressable>
    );
};

export default SignIn;
