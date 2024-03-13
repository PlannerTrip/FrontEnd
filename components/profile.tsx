import React from "react"
import { View, Image, Text } from "react-native"
import Avatar from "../assets/avatar.svg"

const Profile = ({
    username,
    profileUrl,
}: {
    username: string
    profileUrl?: string
}) => {
    return (
        <View className="flex flex-row items-center">
            {profileUrl ? (
                <Image
                    source={{
                        uri: profileUrl,
                    }}
                    className="w-[44px] h-[44px] rounded-full"
                />
            ) : (
                <Avatar className="w-[44px] h-[44px] rounded-full" />
            )}
            <Text className="text-[16px] font-bold ml-[8px]">{username}</Text>
        </View>
    )
}

export default Profile
