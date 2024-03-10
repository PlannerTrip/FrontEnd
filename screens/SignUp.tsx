import React, { useState } from "react";
import { Keyboard, Pressable, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";

import { API_URL } from "@env";

import { StackParamList } from "../interface/navigate";

import { isValidEmail } from "../utils/function";

import ButtonCustom from "../components/button";
import InputCustom from "../components/input";

type Props = NativeStackScreenProps<StackParamList, "signIn">;

const SingUp = ({ route, navigation }: Props) => {
    const insets = useSafeAreaInsets();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errorEmail, setErrorEmail] = useState({
        text: "",
        error: false,
    });
    const [errorUsername, setErrorUsername] = useState({
        text: "",
        error: false,
    });
    const [errorPassword, setErrorPassword] = useState({
        text: "",
        error: false,
    });
    const [errorConfirmPassword, setErrorConfirmPassword] = useState({
        text: "",
        error: false,
    });

    const [hidePassword, setHidePassword] = useState(true);
    const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

    const [allowClearEmail, setAllowClearEmail] = useState(false);
    const [allowClearUsername, setAllowClearUsername] = useState(false);

    const register = async () => {
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

        // username
        if (username === "") {
            setErrorUsername({
                text: "กรุณากรอกชื่อผู้ใข้",
                error: true,
            });
            invalid = true;
        }

        // password
        if (password === "") {
            setErrorPassword({
                text: "กรุณากรอกรหัสผ่าน",
                error: true,
            });
            invalid = true;
        }

        // confirm password
        if (confirmPassword === "") {
            setErrorConfirmPassword({
                text: "กรุณากรอกยืนยันรหัสผ่าน",
                error: true,
            });
            invalid = true;
        }

        if (password && confirmPassword && password !== confirmPassword) {
            setErrorPassword({
                text: "",
                error: true,
            });
            setErrorConfirmPassword({
                text: "รหัสผ่านไม่ตรงกัน ลองใหม่อีกครั้ง",
                error: true,
            });
            invalid = true;
        }

        if (!invalid) {
            try {
                await axios.post(`${API_URL}/register`, {
                    username: username,
                    email: email,
                    password: password,
                });
                navigation.navigate("signIn");
            } catch (error) {
                console.log(error);
                setErrorEmail({
                    text: "อีเมลนี้ถูกใช้งานไปแล้ว ลองใหม่อีกครั้ง",
                    error: true,
                });
            }
        } else {
        }
    };

    const resetError = () => {
        setErrorEmail({
            text: "",
            error: false,
        });
        setErrorUsername({
            text: "",
            error: false,
        });
        setErrorPassword({
            text: "",
            error: false,
        });
        setErrorConfirmPassword({
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
                    ลงทะเบียน
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

                    {/* Username */}
                    <InputCustom
                        label="ชื่อผู้ใช้"
                        value={username}
                        setValue={setUsername}
                        error={errorUsername}
                        allowClear={allowClearUsername}
                        setAllowClear={setAllowClearUsername}
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

                    {/* Confirm Password */}
                    <InputCustom
                        label="ยืนยันรหัสผ่าน"
                        password={true}
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                        error={errorConfirmPassword}
                        hidePassword={hideConfirmPassword}
                        setHidePassword={setHideConfirmPassword}
                        resetError={resetError}
                        style={{ marginBottom: 10 }}
                    />

                    <ButtonCustom
                        title="เข้าสู่ระบบ"
                        styleText="text-[#111111]"
                        onPress={register}
                    />
                </View>
            </View>

            <View className="flex flex-col items-center mb-[32px]">
                <Pressable onPress={() => navigation.navigate("signIn")}>
                    <Text className="text-[#261E00] text-[16px] leading-[24px] font-bold">
                        มีบัญชีแล้วต้องการ{" "}
                        <Text className="text-[#FFC502]">ลงทะเบียน</Text>
                    </Text>
                </Pressable>
            </View>
        </Pressable>
    );
};

export default SingUp;
