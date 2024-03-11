import React, { useContext, useState, useEffect } from "react";
import { Keyboard, Pressable, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import axios from "axios";

import * as SecureStore from "expo-secure-store";

import { API_URL } from "@env";

import { StackParamList } from "../interface/navigate";

import { AuthData } from "../contexts/authContext";

// =============== components ===============
import ButtonCustom from "../components/button";
import InputCustom from "../components/input";

// =============== utils ===============
import { SUCCESS } from "../utils/const";
import { isValidEmail } from "../utils/function";

type Props = NativeStackScreenProps<StackParamList, "signIn">;

const SignIn = ({ route, navigation }: Props) => {
    const { setIsSignedIn, setAuthInformation } = useContext(AuthData);

    const insets = useSafeAreaInsets();

    // =============== useState ===============
    // email, password
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

    // input
    const [hidePassword, setHidePassword] = useState(true);
    const [allowClearEmail, setAllowClearEmail] = useState(false);

    // display
    const [loadingButton, setLoadingButton] = useState(false);

    // =============== handler ===============
    const login = async () => {
        Keyboard.dismiss();

        let invalid = false;

        // email
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

        // password
        if (password === "") {
            setErrorPassword({
                text: "กรุณากรอกรหัสผ่าน",
                error: true,
            });
            invalid = true;
        }

        if (!invalid) {
            setLoadingButton(true);
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
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setLoadingButton(false);
                setPassword("");
                setErrorEmail({
                    text: "",
                    error: true,
                });
                setErrorPassword({
                    text: "อีเมลหรือรหัสผ่านผิด ลองใหม่อีกครั้ง",
                    error: true,
                });
            }
        } else {
        }
    };

    // =============== function ===============
    const resetError = () => {
        setErrorEmail({
            text: "",
            error: false,
        });
        setErrorPassword({
            text: "",
            error: false,
        });
    };

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
                    {/* Email */}
                    <InputCustom
                        label="อีเมล"
                        value={email}
                        setValue={setEmail}
                        error={errorEmail}
                        allowClear={allowClearEmail}
                        setAllowClear={setAllowClearEmail}
                        resetError={resetError}
                    />

                    {/* Password */}
                    <InputCustom
                        label="รหัสผ่าน"
                        password={true}
                        value={password}
                        setValue={setPassword}
                        error={errorPassword}
                        hidePassword={hidePassword}
                        setHidePassword={setHidePassword}
                        resetError={resetError}
                        style={{ marginBottom: 10 }}
                    />

                    <ButtonCustom
                        title="เข้าสู่ระบบ"
                        styleText={
                            loadingButton ? "text-white " : "text-[#111111]"
                        }
                        onPress={login}
                        loading={loadingButton}
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
                    onPress={() => navigation.navigate("forgot", {})}
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
