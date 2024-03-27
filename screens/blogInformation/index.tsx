import React, { useCallback, useContext, useState } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackParamList } from "../../interface/navigate";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "react-native";
import { AuthData } from "../../contexts/authContext";
import { API_URL } from "@env";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

// =============== type ===============
type Props = NativeStackScreenProps<StackParamList, "blogInformation">;
import { BlogInformation_Props } from "../../interface/blog";

// =============== svg ===============
import ArrowLeft from "../../assets/ArrowLeft.svg";
import Avatar from "../../assets/blog/avatar.svg";
import HeartNone from "../../assets/placeInformation/HeartNone.svg";
import HeartFill from "../../assets/placeInformation/HeartFill.svg";
import CoverImage from "../../assets/blog/defaultCoverImage.svg";

// =============== utils ===============
import { changeDateFormat2 } from "../../utils/function";
import { LOADING, SUCCESS } from "../../utils/const";

// =============== components ===============
import FlatListImage from "../../components/flatListImage";
import ButtonCustom from "../../components/button";
import Loading from "../Loading";

const BlogInformation = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const { blogId } = route.params;

  const { token } = useContext(AuthData);

  const { width, height } = Dimensions.get("screen");

  // =============== useState ===============
  const [status, setStatus] = useState(LOADING);

  const [data, setData] = useState<BlogInformation_Props>();
  const [liked, setLiked] = useState(false);
  const [likedCount, setLikeCount] = useState(0);

  const [loadingButton, setLoadingButton] = useState(false);

  // =============== useFocusEffect ===============
  useFocusEffect(
    useCallback(() => {
      getBlogInformation();
    }, []),
  );

  // =============== axios ===============
  const getBlogInformation = async () => {
    try {
      const response = await axios.get(`${API_URL}/blog/information`, {
        headers: {
          authorization: token,
        },
        params: {
          blogId: blogId,
        },
      });

      setData(response.data);
      setLiked(response.data.alreadyLike);
      setLikeCount(response.data.totalLike);
      setStatus(SUCCESS);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data);
      }
    }
  };

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

  const postCopyTrip = async () => {
    try {
      setLoadingButton(true);
      const response = await axios.post(
        `${API_URL}/blog/copyTrip`,
        { blogId: blogId },
        {
          headers: {
            authorization: token,
          },
        },
      );

      navigation.navigate("invitation", { tripId: response.data.tripId });
      setLoadingButton(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data);
      }
      setLoadingButton(false);
    }
  };

  // =============== navigation ===============
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePlaceInformation = (placeId: string, placeType: string) => {
    navigation.navigate("placeInformation", {
      placeId: placeId,
      type: placeType,
      from: "blog",
    });
  };

  // =============== handler ===============
  const handleCopyTrip = () => {
    postCopyTrip();
  };

  if (status === LOADING) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="bg-[#FFFFFF] h-[100%] w-[100%] overflow-scroll"
    >
      {/* header */}
      <View
        className="bg-white h-[52px] p-[16px]"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
      >
        <Pressable className="w-[30px]" onPress={handleGoBack}>
          <ArrowLeft />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        className="p-[16px]"
      >
        {/* trip name */}
        <Text className="text-[24px] leading-[36px] font-bold">
          {data?.name}
        </Text>

        {/* profile & date */}
        <View className="flex flex-row justify-between mt-[16px]">
          {/* profile */}
          <View className="flex flex-row items-center">
            <View className={`h-[44px] w-[44px] rounded-full `}>
              {data?.userprofile ? (
                <Image
                  source={{
                    uri: data?.userprofile,
                  }}
                  className="w-[100%] h-[100%] rounded-full"
                />
              ) : (
                <Avatar />
              )}
            </View>
            <Text className="ml-[8px] text-[16px] leading-[24px] font-bold">
              {data?.username}
            </Text>
          </View>

          {/* date */}
          <View className="pl-[8px] border-l border-[#000000] flex flex-col justify-between text-[12px] leading-[18px]">
            {/* create date */}
            <View className="flex flex-row">
              <Text className="font-bold w-[80px] mr-[4px]">เขียนเมื่อ</Text>
              <Text>{changeDateFormat2(data?.createDate || "")}</Text>
            </View>
            {/* trip date */}
            <View className="flex flex-row">
              <Text className="font-bold w-[80px] mr-[4px]">เดินทางเมื่อ</Text>
              <Text>{`${changeDateFormat2(data?.date.start || "")} - ${changeDateFormat2(data?.date.end || "")}`}</Text>
            </View>
          </View>
        </View>

        {/* province & like */}
        <View className="flex flex-row justify-between mt-[16px] items-start">
          {/* province */}
          <View
            className="flex flex-row flex-wrap"
            style={{ width: width - 2 * 16 - 38 - 8 }}
          >
            {data?.province.map((province, index) => {
              return (
                <Text
                  key={index}
                  className="text-[12px] leading-[16px] text-white p-[4px] rounded-[2px] bg-[#FFC502] mr-[8px] mb-[4px]"
                >
                  {province}
                </Text>
              );
            })}
          </View>
          {/* like */}
          <View className="flex flex-row h-[20px] items-center justify-center">
            <Pressable onPress={postLikeBlog}>
              {liked ? <HeartFill /> : <HeartNone />}
            </Pressable>
            <Text className="text-[12px] leading-[18px] ml-[4px]">
              {likedCount}
            </Text>
          </View>
        </View>

        {/* content */}
        <View className="border-y mt-[12px] py-[16px]">
          <Text className="text-[16px] leading-[24px]">{data?.note}</Text>

          {data?.img && (
            <View className="mt-[8px]">
              <FlatListImage
                item={data?.img}
                height={200}
                width={width - 16 * 2}
                indicator={4}
                gradient={false}
              />
            </View>
          )}
        </View>

        {/* places */}
        <View className="mt-[16px]">
          <Text className="text-[16px] font-bold ">ทริปนี้แวะที่ไหนบ้าง</Text>

          {data?.places.map((place, index) => {
            const district = place.location?.district;
            const province = place.location?.province;
            const placeId = place.placeId;
            const placeType = place.type;
            const placeName = place.placeName;
            const coverImg = place.coverImg;

            return (
              <Pressable
                key={index}
                className={`border border-[#54400E] p-[8px] flex flex-row rounded-[5px] mt-[16px]`}
                onPress={() => {
                  handlePlaceInformation(placeId, placeType);
                }}
              >
                {coverImg ? (
                  <View className="border border-[#54400E] rounded-[5px]">
                    <Image
                      source={{
                        uri: coverImg,
                      }}
                      className="w-[80px] h-[80px]  "
                    />
                  </View>
                ) : (
                  <CoverImage />
                )}

                <View className="ml-[16px] flex flex-col justify-between flex-1 ">
                  <Text
                    style={{
                      width: width - (16 * 2 + 8 * 2 + 16 + 24) - 100,
                    }}
                    className={`text-[14px] truncate font-bold`}
                    numberOfLines={1}
                  >
                    {placeName}
                  </Text>

                  <Text className="text-[12px] font-bold text-[#FFC502]">
                    {district}, {province}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* copy button */}
        <View className="mt-[16px]" style={{ marginBottom: insets.bottom }}>
          <ButtonCustom
            title="คัดลอกทริปนี้"
            styleText={loadingButton ? "text-white " : "text-[#111111]"}
            onPress={handleCopyTrip}
            loading={loadingButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default BlogInformation;
