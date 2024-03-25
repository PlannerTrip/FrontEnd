import React, { useState, useCallback, useContext, useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "react-native";
import { API_URL } from "@env";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { AuthData } from "../../contexts/authContext";
import ArrowLeft from "../../assets/ArrowLeft.svg";

// =============== type ===============
import { StackParamList } from "../../interface/navigate";
import { TripCard } from "../../interface/tripPlaner";
import { LOADING, SUCCESS } from "../../utils/const";
import Loading from "../Loading";
type Props = NativeStackScreenProps<StackParamList, "myTrip">;

const MyTrip = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { title } = route.params;
  const { token } = useContext(AuthData);

  const [trips, setTrips] = useState<TripCard[]>([]);
  const [status, setStatus] = useState(LOADING);

  const handleGoBack = () => {
    navigation.goBack();
  };

  // =============== useFocusEffect ===============
  useFocusEffect(
    useCallback(() => {
      getMyTrip();
    }, []),
  );

  // =============== axios ===============
  const getMyTrip = async () => {
    try {
      const response = await axios.get(`${API_URL}/trip/myTrip`, {
        headers: {
          authorization: token,
        },
      });
      setTrips(response.data);
      setStatus(SUCCESS);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data);
      }
    }
  };

  if (status === LOADING) {
    return <Loading />;
  }

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="bg-[#FFFFFF] h-[100%] w-[100%] overflow-scroll "
    >
      {/* header */}
      <View
        className="bg-white h-[52px] px-[16px] flex flex-row justify-between items-center"
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
        <Text className="text-[16px] leading-[24px] font-bold">{title}</Text>
        <View></View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="p-[16px]">{/* blog */}</View>
      </ScrollView>
    </View>
  );
};

export default MyTrip;
