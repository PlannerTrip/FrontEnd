import {
    Keyboard,
    View,
    Text,
    StyleProp,
    ViewStyle,
    Pressable,
} from "react-native";
import React from "react";
import { TextInput } from "react-native-paper";
import { Icon } from "@ui-kitten/components";

const InputCustom = ({
    password = false,
    label,
    value,
    setValue,
    error,
    allowClear,
    setAllowClear,
    hidePassword = false,
    setHidePassword,
    style = {},
    resetError,
}: {
    password?: boolean;
    label: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    error: {
        text: string;
        error: boolean;
    };
    allowClear?: boolean;
    setAllowClear?: React.Dispatch<React.SetStateAction<boolean>>;
    hidePassword?: boolean;
    setHidePassword?: React.Dispatch<React.SetStateAction<boolean>>;
    style?: StyleProp<ViewStyle>;
    resetError: () => void;
}) => {
    return (
        <View style={style}>
            <TextInput
                mode="outlined"
                label={label}
                value={value}
                activeOutlineColor={error.error ? "#FF3141" : "#111111"}
                outlineColor={error.error ? "#FF3141" : "#111111"}
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
                    borderColor: error.error ? "#FF3141" : "#111111",
                    borderWidth: 1,
                }}
                style={{
                    fontWeight: "bold",
                }}
                onChangeText={(text) => {
                    setValue(text);
                    if (setAllowClear) {
                        if (text) {
                            setAllowClear(true);
                        } else {
                            setAllowClear(false);
                        }
                    }
                }}
                onFocus={resetError}
            />

            {(password || allowClear) && (
                <Pressable
                    className="absolute right-[0px] top-[6px] w-[60px] h-[50px] flex justify-center items-center"
                    onPress={() => {
                        if (password) {
                            setHidePassword && setHidePassword(!hidePassword);
                            Keyboard.dismiss();
                        } else {
                            setValue("");
                            setAllowClear && setAllowClear(false);
                        }
                    }}
                >
                    {password ? (
                        <Icon
                            style={{ width: 20, height: 20 }}
                            name={
                                hidePassword
                                    ? "eye-off-2-outline"
                                    : "eye-outline"
                            }
                        />
                    ) : (
                        <>
                            {allowClear && (
                                <Icon
                                    style={{ width: 20, height: 20 }}
                                    name={"close-outline"}
                                />
                            )}
                        </>
                    )}
                </Pressable>
            )}

            <Text className="leading-[18px] mb-[6px] text-[12px] h-[18px] font-bold text-[#FF3141]">
                {error.text}
            </Text>
        </View>
    );
};

export default InputCustom;
