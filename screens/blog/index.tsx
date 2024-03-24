import React, { useState, useCallback, useContext, useEffect } from "react";
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
import Empty from "../../assets/autoComplete/empty.svg";
import Search from "../../assets/blog/search.svg";

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
import SearchCustom from "../../components/seach";
type Props = NativeStackScreenProps<StackParamList, "blog">;

const Blog = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const { token } = useContext(AuthData);

  const [currentTab, setCurrentTab] = useState(RECENT);

  const [status, setStatus] = useState(LOADING);

  const [blogs, setBlogs] = useState<BlogCard_Props[]>([]);

  const [displaySearch, setDisplaySearch] = useState(false);

  const [search, setSearch] = useState("");
  // =============== useFocusEffect ===============
  useFocusEffect(
    useCallback(() => {
      getBlogRecent();
    }, []),
  );

  // useFocusEffect(
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    if (search) {
      (async () => {
        setStatus(LOADING);
        try {
          const response = await axios.get(`${API_URL}/blog/search`, {
            headers: {
              authorization: token,
            },
            params: {
              input: search,
            },
            signal: signal,
          });

          console.log(response.data);

          setBlogs(response.data);

          setStatus(SUCCESS);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            console.log(error.response.data);
            setStatus(SUCCESS);
          }
        }
      })();
    }

    if (search === "" && !displaySearch) {
      handleGetData(currentTab);
    }

    return () => {
      abortController.abort();
    };
  }, [search]);
  // );

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

  const handleSearch = () => {
    setDisplaySearch(true);
  };

  // =============== content ===============
  const renderBlog = () => {
    if (displaySearch && search === "") {
      return (
        <View className="flex flex-row justify-center mt-[32px]">
          <Search />
        </View>
      );
    }
    if (blogs.length) {
      return (
        <>
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
        </>
      );
    } else {
      return (
        <View className="flex flex-row justify-center mt-[32px]">
          <Empty />
        </View>
      );
    }
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
      <View
        className={`${displaySearch ? "items-center" : "items-end"} h-[80px] px-[16px] pt-[16px] bg-[#FFF]  flex-row justify-between`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
      >
        {displaySearch ? (
          <SearchCustom
            handleGoBack={() => {
              setDisplaySearch(false);
              setSearch("");
            }}
            placeholder="พิมพ์คำที่ต้องการค้นหา"
            setSearch={setSearch}
            search={search}
          />
        ) : (
          <>
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
                  currentTab === RECOMMEND
                    ? "border-b-[2px] border-[#FFC502]"
                    : ""
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
            <Pressable className="mb-[16px] " onPress={handleSearch}>
              <Image
                source={require("../../assets/placeDiscovery/search.png")}
              />
            </Pressable>
          </>
        )}
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
          <View className="w-[100%]">{renderBlog()}</View>
        )}
      </ScrollView>
      {status !== LOADING && !displaySearch && (
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
