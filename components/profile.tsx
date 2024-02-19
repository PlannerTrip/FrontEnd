import React from "react"
import { View, Image, Text } from "react-native"
import Avatar from "../assets/avatar.svg"

const Profile = ({
    name,
    profilePicture,
}: {
    name: string
    profilePicture?: string
}) => {
    return (
        <View className="flex flex-row items-center">
            {profilePicture ? (
                <Image
                    source={{
                        uri: profilePicture,
                    }}
                    className="w-[44px] h-[44px] rounded-full"
                />
            ) : (
                <Avatar className="w-[44px] h-[44px] rounded-full" />
            )}
            <Text className="text-[16px] font-bold ml-[8px]">{name}</Text>
        </View>
    )
}

export default Profile
