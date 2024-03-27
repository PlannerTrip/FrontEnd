import { API_URL } from "@env";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useContext, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { AuthData } from "../../contexts/authContext";
import { TripCard } from "../../interface/tripPlaner";
import TripCardCustom from "../../components/tripPlaner/tripCard";
import { LOADING, SUCCESS } from "../../utils/const";
import Loading from "../Loading";
import { StackParamList } from "../../interface/navigate";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<StackParamList, "tripPlanner">;

const TripPlaner = ({ navigation }: Props) => {
  const { token } = useContext(AuthData);

  const insets = useSafeAreaInsets();

  const isFocused = useIsFocused();

  // ====================== useState ======================

  const [myTrip, setMyTrip] = useState<TripCard[]>([]);
  const [status, setStatus] = useState(LOADING);

  // ====================== useFocusEffect ======================

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        setStatus(LOADING);
        getMyTrip();
      }
    }, [isFocused]),
  );

  // ====================== function ======================

  const getMyTrip = async () => {
    try {
      const response = await axios.get(`${API_URL}/trip/myTrip`, {
        headers: { Authorization: token },
      });

      setMyTrip(response.data);
      setStatus(SUCCESS);
    } catch (err) {
      console.log(err);
    }
  };

  const onPress = (tripId: string) => {
    navigation.navigate("tripDetail", {
      tripId: tripId,
    });
  };

  if (status === LOADING) return <Loading />;
  return (
    <View
      style={{
        paddingTop: insets.top,
      }}
      className=" bg-white h-[100%]"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex items-center">
          {myTrip.map((information) => (
            <View className="mt-[16px]">
              <TripCardCustom
                information={information}
                onPress={() => {
                  onPress(information.tripId);
                }}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default TripPlaner;
