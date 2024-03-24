import { View, Text, Pressable, Image } from "react-native";

import { useContext, useState } from "react";

import axios from "axios";

import { API_URL } from "@env";

import { AuthData } from "../../contexts/authContext";

// =============== utils ===============
import { timeDifferenceDisplay } from "../../utils/function";

// =============== svg ===============
import Avatar from "../../assets/blog/avatar.svg";
import HeartNone from "../../assets/placeInformation/HeartNone.svg";
import HeartFill from "../../assets/placeInformation/HeartFill.svg";

const BlogCard = ({
  blogPicture,
  provinces,
  profilePicture,
  blogName,
  profileName,
  dateString,
  totalLike,
  alreadyLike,
  handleOnPress,
  blogId,
}: {
  blogPicture: string;
  provinces: string[];
  profilePicture?: string;
  blogName: string;
  profileName: string;
  dateString: string;
  totalLike: number;
  alreadyLike: boolean;
  handleOnPress: (blogId: string) => void;
  blogId: string;
}) => {
  const { token } = useContext(AuthData);

  // =============== useState ===============
  const [liked, setLiked] = useState(alreadyLike);
  const [likedCount, setLikeCount] = useState(totalLike);

  const time = timeDifferenceDisplay(dateString);

  // =============== axios ===============
  const postLikeBlog = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/blog/like`,
        { blogId: blogId },
        {
          headers: {
            authorization: token,
          },
        },
      );

      if (response.data === "like success") {
        setLiked(true);
        setLikeCount(likedCount + 1);
      } else if (response.data === "unlike success") {
        setLiked(false);
        setLikeCount(likedCount - 1);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data);
      }
    }
  };

  return (
    <View className="border-[2px] border-[#54400E] p-[8px] rounded-[5px] mb-[16px]">
      <Pressable
        onPress={() => {
          handleOnPress(blogId);
        }}
      >
        {/* picture */}
        <View
          className={`rounded-[2px]  h-[200px]  border-[1px] border-[#54400E] relative`}
        >
          {blogPicture ? (
            <Image
              source={{
                uri: blogPicture,
              }}
              className="w-[100%] h-[100%] "
            />
          ) : (
            <Image
              source={require("../../assets/blog/emptyBlog.png")}
              className="w-[100%] h-[100%]"
            />
          )}

          {/* province */}
          <View className="absolute bottom-[16px] right-[16px] flex flex-row">
            {provinces.map((province, index) => {
              return (
                <Text
                  key={index}
                  className="text-[12px] leading-[16px] text-white p-[4px] rounded-[2px] bg-[#FFC502] ml-[8px]"
                >
                  {province}
                </Text>
              );
            })}
          </View>
        </View>

        <View className="mt-[8px] flex flex-row w-[100%]">
          {/* profile */}
          <View className={`h-[44px] w-[44px] rounded-full `}>
            {profilePicture ? (
              <Image
                source={{
                  uri: profilePicture,
                }}
                className="w-[100%] h-[100%] rounded-full"
              />
            ) : (
              <Avatar />
            )}
          </View>

          {/* detail */}
          <View className="ml-[10px] flex-grow">
            <Text className="text-[16px] leading-[24px] font-bold">
              {blogName}
            </Text>

            <View className="flex flex-row justify-between ">
              <Text className="text-[12px] leading-[18px] font-bold">
                เขียนโดย {profileName}
              </Text>

              <Text className="text-[12px] leading-[18px] text-[#9898AA]">
                {time}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>

      {/* like */}
      <View className="flex flex-row mt-[8px]">
        <Pressable onPress={postLikeBlog}>
          {liked ? <HeartFill /> : <HeartNone />}
        </Pressable>
        <Text className="text-[12px] leading-[18px] ml-[4px]">
          {likedCount}
        </Text>
      </View>
    </View>
  );
};

export default BlogCard;
