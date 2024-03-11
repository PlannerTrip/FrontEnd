import React, { useState, useCallback } from "react";
import { Keyboard, Pressable, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import axios from "axios";

import { API_URL } from "@env";

import { StackParamList } from "../interface/navigate";

// =============== components ===============
import ButtonCustom from "../components/button";
import InputCustom from "../components/input";
import ConfirmModal from "../components/confirmModal";
import Loading from "./Loading";

// =============== svg ===============
import Check from "../assets/modal/checkCircle.svg";
import Close from "../assets/modal/closeCircle.svg";
import ExclamationCircle from "../assets/modal/exclamationCircle.svg";

// =============== utils ===============
import { LOADING, SUCCESS } from "../utils/const";
import { isValidEmail } from "../utils/function";

type Props = NativeStackScreenProps<StackParamList, "forgot">;

const Forgot = ({ route, navigation }: Props) => {
    const insets = useSafeAreaInsets();

    const { forgotCode } = route.params;

    // =============== useState ===============
    const [verified, setVerified] = useState(false);

    // email, password, confirmPassword
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errorEmail, setErrorEmail] = useState({
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

    // input
    const [allowClearEmail, setAllowClearEmail] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);
    const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

    // display
    const [loadingButton, setLoadingButton] = useState(false);
    const [pageStatus, setPageStatus] = useState(SUCCESS);
    const [displayModalSendEmail, setDisplayModalSendEmail] = useState(false);
    const [displayModalSuccess, setDisplayModalSuccess] = useState(false);
    const [displayModalInvalidCode, setDisplayModalInvalidCode] =
        useState(false);

    // =============== useFocusEffect ===============
    useFocusEffect(
        useCallback(() => {
            if (forgotCode) {
                setPageStatus(LOADING);
                getVerifyForgotCode();
            }
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            if (email === "") {
                setAllowClearEmail(false);
            }
        }, [email])
    );

    // =============== axios ===============
    const getVerifyForgotCode = async () => {
        try {
            const response = await axios.get(`${API_URL}/verifyForgotCode`, {
                params: {
                    verifyCode: forgotCode,
                },
            });
            setPageStatus(SUCCESS);
            setVerified(true);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data);
            }
            setPageStatus(SUCCESS);
            setDisplayModalInvalidCode(true);
        }
    };

    // =============== handler ===============
    const forgot = async () => {
        Keyboard.dismiss();

        let invalid = false;

        if (verified) {
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
                setLoadingButton(true);
                try {
                    const response = await axios.put(
                        `${API_URL}/changePasswordByEmail`,
                        {
                            password: password,
                            verifyCode: forgotCode,
                        }
                    );
                    setLoadingButton(false);
                    setDisplayModalSuccess(true);
                } catch (error) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    setLoadingButton(false);
                    console.log("error", error);
                }
            }
        } else {
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

            if (!invalid) {
                setLoadingButton(true);
                try {
                    const response = await axios.post(
                        `${API_URL}/forgotPassword`,
                        {
                            email: email,
                        }
                    );
                    setLoadingButton(false);
                    setDisplayModalSendEmail(true);
                    setEmail("");
                } catch (error) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    setLoadingButton(false);
                    console.log("error", error);
                    setErrorEmail({
                        text: "ไม่พบอีเมลนี้ในระบบ ลองใหม่อีกครั้ง",
                        error: true,
                    });
                }
            }
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
        setErrorConfirmPassword({
            text: "",
            error: false,
        });
    };

    if (pageStatus === LOADING) {
        return <Loading />;
    }

    return (
        <>
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
                        เปลี่ยนรหัสผ่าน
                    </Text>

                    <View className="w-[100%] p-[16px] mt-[16px]">
                        {verified ? (
                            <>
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
                            </>
                        ) : (
                            <>
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
                            </>
                        )}

                        <ButtonCustom
                            title="เปลี่ยนรหัสผ่าน"
                            styleText={
                                loadingButton ? "text-white " : "text-[#111111]"
                            }
                            onPress={forgot}
                            loading={loadingButton}
                        />
                    </View>
                </View>

                <View className="flex flex-col items-center mb-[32px]">
                    <Pressable onPress={() => navigation.navigate("signIn")}>
                        <Text className="text-[#261E00] text-[16px] leading-[24px] font-bold">
                            กลับไปยัง{" "}
                            <Text className="text-[#FFC502]">เข้าสู่ระบบ</Text>
                        </Text>
                    </Pressable>
                </View>
            </Pressable>

            {displayModalSendEmail && (
                <View className="absolute z-[100] top-0 bg-[#0000008C] w-[100%] h-[100vh] flex-col justify-center items-center ">
                    <ConfirmModal
                        title={
                            <View className="flex flex-col justify-center items-center">
                                <ExclamationCircle />
                                <Text className="mt-[8px] font-bold text-[16px] leading-[24px]">
                                    โปรดตรวจสอบที่อีเมลของท่าน
                                </Text>

                                <Text className=" text-[12px] leading-[18px]">
                                    ลิงค์สำหรับเปลี่ยนรหัสถูกส่งไปที่อีเมลของคุณเเล้ว
                                </Text>
                            </View>
                        }
                        cancelTitle={"ปิด"}
                        onPressCancel={() => {
                            setDisplayModalSendEmail(false);
                        }}
                        confirm={false}
                    />
                </View>
            )}

            {displayModalInvalidCode && (
                <View className="absolute z-[100] top-0 bg-[#0000008C] w-[100%] h-[100vh] flex-col justify-center items-center ">
                    <ConfirmModal
                        title={
                            <View className="flex flex-col justify-center items-center">
                                <Close />
                                <Text className="mt-[8px] font-bold text-[16px] leading-[24px]">
                                    โปรดลองใหม่อีกครั้ง
                                </Text>

                                <Text className=" text-[12px] leading-[18px]">
                                    ลิงค์ไม่ครบถ้วนหรือหมดอายุแล้ว
                                </Text>
                            </View>
                        }
                        cancelTitle={"ปิด"}
                        onPressCancel={() => {
                            setDisplayModalInvalidCode(false);
                        }}
                        confirm={false}
                    />
                </View>
            )}

            {displayModalSuccess && (
                <View className="absolute z-[100] top-0 bg-[#0000008C] w-[100%] h-[100vh] flex-col justify-center items-center ">
                    <ConfirmModal
                        title={
                            <View className="flex flex-col justify-center items-center">
                                <Check />
                                <Text className="mt-[8px] font-bold text-[16px] leading-[24px]">
                                    เปลี่ยนรหัสผ่านสำเร็จ
                                </Text>
                            </View>
                        }
                        confirmTitle={"กดเพื่อไปหน้าเข้าสู่ระบบ"}
                        onPressConfirm={() => {
                            navigation.navigate("signIn");
                        }}
                        cancel={false}
                    />
                </View>
            )}
        </>
    );
};

export default Forgot;
