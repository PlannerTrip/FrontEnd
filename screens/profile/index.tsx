import React from "react"
import { View, Text } from "react-native"
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context"
import ButtonCustom from "../../components/button"

import * as SecureStore from "expo-secure-store"

const Profile = () => {
    const insets = useSafeAreaInsets()

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync("key")
    }

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
    )
}

export default Profile
