import React, { useContext } from "react";
import { View, Text } from "react-native";
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import ButtonCustom from "../../components/button";

import * as SecureStore from "expo-secure-store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../../interface/navigate";
import { AuthData } from "../../contexts/authContext";

type Props = NativeStackScreenProps<StackParamList, "profile">;

const Profile = ({ navigation }: Props) => {
    const insets = useSafeAreaInsets();

    const { setIsSignedIn } = useContext(AuthData);

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync("key");
        setIsSignedIn && setIsSignedIn(false);
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
            <Text>Profile</Text>
            <ButtonCustom title="Logout" onPress={handleLogout} />
        </View>
    );
};

export default Profile;
