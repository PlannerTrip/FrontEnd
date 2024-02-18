import React, { useContext, useState } from "react";
import { Pressable, TextInput } from "react-native";
import { View, Text } from "react-native";
import { API_URL } from "@env";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../interface/navigate";
import * as SecureStore from "expo-secure-store";
import { AuthData } from "../contexts/authContext";

type Props = NativeStackScreenProps<StackParamList, "signIn">;

const SignIn = ({ route }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setIsSignedIn } = useContext(AuthData);

  const insets = useSafeAreaInsets();

  const login = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: username,
        password: password,
      });
      await SecureStore.setItemAsync("key", response.data.token);
      if (setIsSignedIn) setIsSignedIn(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <Text>SignIn</Text>
      <TextInput
        className="h-[40px] m-[20px] border"
        onChangeText={setUsername}
        value={username}
        placeholder="username"
      />
      <TextInput
        className="h-[40px] m-[20px] border"
        onChangeText={setPassword}
        value={password}
        placeholder="password"
      />
      <Pressable onPress={login}>
        <View className="bg-yellow-50 h-[40px] p-[12px] m-[20px]">
          <Text>Login</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default SignIn;
