import { Image, Text } from "react-native";
import { StackParamList } from "../../interface/navigate";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// =================== Screen ===================

import Discovery from "../discovery";
import Blog from "../blog";
import TripPlaner from "../tripPlanner";
import Profile from "../profile";
import Achievement from "../achievement";

// =================== Icon ===================

import UnActiveBlogIcon from "../../assets/tabBar/blog.svg";
import ActiveBlogIcon from "../../assets/tabBar/activeBlog.svg";
import UnActiveDiscovery from "../../assets/tabBar/discovery.svg";
import ActiveDiscovery from "../../assets/tabBar/activeDiscovery.svg";
import UnActiveProfile from "../../assets/tabBar/profile.svg";
import ActiveProfile from "../../assets/tabBar/activeProfile.svg";
import UnActiveTripPlanner from "../../assets/tabBar/tripPlanner.svg";
import ActiveTripPlaner from "../../assets/tabBar/activeTripPlanner.svg";

const Tab = () => {
  const BaseTab = createBottomTabNavigator<StackParamList>();
  return (
    <BaseTab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 100,
        },
        tabBarIconStyle: { marginTop: 14 },

        headerShown: false,
      }}
    >
      <BaseTab.Screen
        name="discovery"
        component={Discovery}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`text-[12px] ${
                focused
                  ? "text-[#FFC502] font-extrabold"
                  : "text-[#9898AA] font-normal"
              }`}
            >
              ไปเที่ยวกัน
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            focused ? <ActiveDiscovery /> : <UnActiveDiscovery />,
        }}
      />
      <BaseTab.Screen
        name="blog"
        component={Blog}
        options={({ route }) => ({
          tabBarLabel: ({ focused }) => (
            <Text
              className={`text-[12px] ${
                focused
                  ? "text-[#FFC502] font-extrabold"
                  : "text-[#9898AA] font-normal"
              }`}
            >
              บล็อก
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            focused ? <ActiveBlogIcon /> : <UnActiveBlogIcon />,
        })}
      />
      <BaseTab.Screen
        name="tripPlanner"
        component={TripPlaner}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`text-[12px] ${
                focused
                  ? "text-[#FFC502] font-extrabold"
                  : "text-[#9898AA] font-normal"
              }`}
            >
              ทริปของฉัน
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            focused ? <ActiveTripPlaner /> : <UnActiveTripPlanner />,
        }}
      />
      <BaseTab.Screen
        name="achievement"
        component={Achievement}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`text-[12px] ${
                focused
                  ? "text-[#FFC502] font-extrabold"
                  : "text-[#9898AA] font-normal"
              }`}
            >
              ภารกิจ
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image
                source={require("../../assets/tabBar/activeAchievement.png")}
              />
            ) : (
              <Image source={require("../../assets/tabBar/achievement.png")} />
            ),
        }}
      />
      <BaseTab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`text-[12px] ${
                focused
                  ? "text-[#FFC502] font-extrabold"
                  : "text-[#9898AA] font-normal"
              }`}
            >
              ข้อมูลผู้ใช้
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            focused ? <ActiveProfile /> : <UnActiveProfile />,
        }}
      />
    </BaseTab.Navigator>
  );
};


export default Tab