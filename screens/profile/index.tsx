import React, { useCallback, useContext, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ButtonCustom from "../../components/button";

import * as SecureStore from "expo-secure-store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../../interface/navigate";
import { AuthData } from "../../contexts/authContext";

import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@env";
import { LOADING, SUCCESS } from "../../utils/const";
import { UserData } from "../../interface/profile";
import Loading from "../Loading";
type Props = NativeStackScreenProps<StackParamList, "profile">;

// =============== svg ===============
import Avatar60 from "../../assets/profile/avatar60.svg";
import MyTrip from "../../assets/profile/myTrip.svg";
import MyBookmark from "../../assets/profile/myBookmark.svg";
import MyBlog from "../../assets/profile/myBlog.svg";
import MyLikeBlog from "../../assets/profile/myLikeBlog.svg";
import EditInformation from "../../assets/profile/editInformation.svg";
import ChangePassword from "../../assets/profile/changePassword.svg";
import Suggest from "../../assets/profile/suggest.svg";
import LogOut from "../../assets/profile/logOut.svg";
import Right from "../../assets/profile/expand_right_light.svg";

const Profile = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const { token, setIsSignedIn } = useContext(AuthData);

  const [status, setStatus] = useState(LOADING);

  const [profile, setProfile] = useState<UserData>();

  // =============== useFocusEffect ===============
  useFocusEffect(
    useCallback(() => {
      getUserInformation();
    }, []),
  );

  // =============== axios ===============
  const getUserInformation = async () => {
    try {
      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          authorization: token,
        },
      });
      setProfile(response.data);
      setStatus(SUCCESS);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data);
      }
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("key");
    setIsSignedIn && setIsSignedIn(false);
  };

  const travelInformation = [
    {
      title: "ทริปที่คุณจัด",
      icon: <MyTrip />,
      function: () => navigation.navigate("myTrip", { title: "ทริปที่คุณจัด" }),
    },
    {
      title: "สถานที่บุ๊กมาร์ก",
      icon: <MyBookmark />,
      function: () =>
        navigation.navigate("myBookmark", { title: "สถานที่บุ๊กมาร์ก" }),
    },
    {
      title: "บล็อกที่เขียน",
      icon: <MyBlog />,
      function: () => navigation.navigate("myBlog", { title: "บล็อกที่เขียน" }),
    },
    {
      title: "บล็อกที่ถูกใจ",
      icon: <MyLikeBlog />,
      function: () =>
        navigation.navigate("myLikeBlog", { title: "บล็อกที่ถูกใจ" }),
    },
  ];

  const personalInformation = [
    {
      title: "แก้ไขข้อมูลส่วนตัว",
      icon: <EditInformation />,
      function: () =>
        navigation.navigate("editInformation", { title: "แก้ไขข้อมูลส่วนตัว" }),
    },
    {
      title: "เปลี่ยนรหัสผ่าน",
      icon: <ChangePassword />,
      function: () =>
        navigation.navigate("changePassword", { title: "เปลี่ยนรหัสผ่าน" }),
    },
    {
      title: "แนะนำ ติชม รายงานปัญหา",
      icon: <Suggest />,
      function: () =>
        navigation.navigate("suggest", { title: "แนะนำ ติชม รายงานปัญหา" }),
    },
    {
      title: "ออกจากระบบ",
      icon: <LogOut />,
      function: () => handleLogout(),
    },
  ];

  if (status === LOADING) {
    return <Loading />;
  }

  return (
    <View
      style={{
        // paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="bg-[#FFFFFF] h-[100%] w-[100%] overflow-scroll"
    >
      {/* header */}
      <View
        className="bg-[#FCF8EF] p-[16px] flex flex-row items-center"
        style={{
          paddingTop: insets.top + 16,
        }}
      >
        <View className={`h-[60px] w-[60px] rounded-full `}>
          {profile?.profileUrl ? (
            <Image
              source={{
                uri: profile?.profileUrl,
              }}
              className="w-[100%] h-[100%] rounded-full"
            />
          ) : (
            <Avatar60 />
          )}
        </View>
        <Text className="ml-[16px] leading-[36px] text-[24px] font-bold">
          {profile?.username}
        </Text>
      </View>

      <View className="p-[16px]">
        <View>
          <Text className="text-[16px] leading-[24px] font-bold">
            ข้อมูลท่องเที่ยว
          </Text>
          {travelInformation.map((travel, index) => {
            return (
              <Pressable
                onPress={() => {
                  travel.function();
                }}
                key={index}
                className="h-[60px] border-b border-[#D9D9D9] flex flex-row items-center  justify-between"
              >
                <View className="flex flex-row items-center">
                  {travel.icon}
                  <Text className="text-[16px] leading-[24px] font-bold ml-[8px]">
                    {travel.title}
                  </Text>
                </View>
                <Right />
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="p-[16px]">
        <View>
          <Text className="text-[16px] leading-[24px] font-bold">
            ข้อมูลส่วนตัว
          </Text>
          {personalInformation.map((personal, index) => {
            return (
              <Pressable
                onPress={() => {
                  personal.function();
                }}
                key={index}
                className="h-[60px] border-b border-[#D9D9D9] flex flex-row items-center  justify-between"
              >
                <View className="flex flex-row items-center">
                  {personal.icon}
                  <Text className="text-[16px] leading-[24px] font-bold ml-[8px]">
                    {personal.title}
                  </Text>
                </View>
                {personal.title !== "ออกจากระบบ" && <Right />}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default Profile;
