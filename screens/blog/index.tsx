import React, { useState, useCallback, useContext } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "react-native";
import { API_URL } from "@env";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

import { AuthData } from "../../contexts/authContext";

// =============== svg ===============
import Edit from "../../assets/blog/edit.svg";

// =============== utils ===============
import {
  LOADING,
  RECENT,
  RECENT_LABEL,
  RECOMMEND,
  RECOMMEND_LABEL,
  SUCCESS,
} from "../../utils/const";

// =============== components ===============
import BlogCard from "../../components/blog/blogCard";
import Loading from "../Loading";

// =============== components ===============
import { BlogCard_Props } from "../../interface/blog";
import { StackParamList } from "../../interface/navigate";
type Props = NativeStackScreenProps<StackParamList, "blog">;

const Blog = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const [currentTab, setCurrentTab] = useState(RECENT);

  const [status, setStatus] = useState(LOADING);

  const [blogs, setBlogs] = useState<BlogCard_Props[]>([]);

  const { token } = useContext(AuthData);

  // =============== useFocusEffect ===============
  useFocusEffect(
    useCallback(() => {
      getBlogRecent();
    }, []),
  );

  // =============== axios ===============
  const getBlogRecent = async () => {
    try {
      const response = await axios.get(`${API_URL}/blog/recent`, {
        headers: {
          authorization: token,
        },
      });

      setBlogs(response.data);
      setStatus(SUCCESS);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data);
      }
    }
  };

  const getBlogRecommend = async () => {
    try {
      const response = await axios.get(`${API_URL}/blog/recommend`, {
        headers: {
          authorization: token,
        },
      });

      setBlogs(response.data);
      setStatus(SUCCESS);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data);
      }
    }
  };

  // =============== function ===============
  const handleGetData = (tab: string) => {
    setStatus(LOADING);
    if (tab === RECENT) {
      getBlogRecent();
    } else if (tab === RECOMMEND) {
      getBlogRecommend();
    }
  };

  const handleNavigate = (blogId: string) => {
    navigation.navigate("blogInformation", {
      blogId: blogId,
    });
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        // paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="bg-[#FFFFFF] h-[100%] w-[100%] overflow-scroll"
    >
      {/* header */}
      <View className="h-[80px] items-end px-[16px] pt-[16px] bg-[#FFF]  flex-row justify-between">
        <View className="w-[262px] h-[80px] items-end flex-row justify-between">
          <Pressable
            onPress={() => {
              setCurrentTab(RECENT);
              handleGetData(RECENT);
            }}
            className={`w-[147px] h-[48px] ${
              currentTab === RECENT ? "border-b-[2px] border-[#FFC502]" : ""
            } flex justify-center items-center`}
          >
            <Text
              className={`${
                currentTab === RECENT ? "text-[#FFC502] " : ""
              } font-bold`}
            >
              {RECENT_LABEL}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setCurrentTab(RECOMMEND);
              handleGetData(RECOMMEND);
            }}
            className={`w-[147px] h-[48px]    flex justify-center items-center  ${
              currentTab === RECOMMEND ? "border-b-[2px] border-[#FFC502]" : ""
            }`}
          >
            <Text
              className={` ${
                currentTab === RECOMMEND ? "text-[#FFC502] " : ""
              } font-bold`}
            >
              {RECOMMEND_LABEL}
            </Text>
          </Pressable>
        </View>
        <Pressable className="mb-[16px]">
          <Image source={require("../../assets/placeDiscovery/search.png")} />
        </Pressable>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          flex: status === LOADING ? 1 : 0,
          justifyContent: status === LOADING ? "center" : "flex-start",
          alignItems: status === LOADING ? "center" : "flex-start",
          padding: 16,
        }}
      >
        {status === LOADING ? (
          <View>
            <Loading />
          </View>
        ) : (
          <View className="w-[100%]">
            {blogs.map((blog, index) => {
              return (
                <View key={index}>
                  <BlogCard
                    blogPicture={blog.img}
                    provinces={blog.province.slice(0, 3)}
                    profilePicture={blog.userprofile}
                    blogName={blog.name}
                    profileName={blog.username}
                    dateString={blog.createDate}
                    totalLike={blog.totalLike}
                    alreadyLike={blog.alreadyLike}
                    handleOnPress={handleNavigate}
                    blogId={blog.blogId}
                  />
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
      {status !== LOADING && (
        <View className="absolute" style={{ right: insets.right, bottom: 0 }}>
          <Edit
            onPress={() => {
              navigation.navigate("writeBlog");
            }}
          />
        </View>
      )}
    </View>
  );
};

export default Blog;
