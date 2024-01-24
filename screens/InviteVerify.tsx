import React, { useCallback, useEffect, useState, useContext } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View } from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// ==================== svg ====================

import LoadingSvg from "../assets/loading.svg";

// ==================== type ====================
import { StackParamList } from "../interface/navigate";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import * as SecureStore from "expo-secure-store";

import axios from "axios";

// ==================== const ====================
import { API_URL } from "@env";
import { FAIL, SUCCESS } from "../utils/const";
import { AuthData } from "../App";

type Props = NativeStackScreenProps<StackParamList, "inviteVerify">;

const InviteVerify = ({ route, navigation }: Props) => {
  const { authStatus } = useContext(AuthData);
  const insets = useSafeAreaInsets();

  const { inviteLink } = route.params;

  const [currentStage, setCurrentStage] = useState("");
  const [tripId, setTripId] = useState("");

  //   ==================== useEffect ====================

  useEffect(() => {
    spin.value = withRepeat(withTiming(360, { duration: 2000 }), 0);
  }, []);

  // verifyInviteLink
  useFocusEffect(
    useCallback(() => {
      verifyInviteLink();
    }, [inviteLink])
  );

  // if auth check and verify done
  useEffect(() => {
    if (authStatus === SUCCESS && tripId !== "") {
      if (currentStage === "invitation") {
        console.log(tripId);
        navigation.navigate("invitation", {
          tripId: tripId,
        });
      }
    }
  }, [authStatus, currentStage, tripId]);

  //   ==================== function ====================

  const verifyInviteLink = async () => {
    try {
      const token = await SecureStore.getItemAsync("key");
      const response = await axios.get(`${API_URL}/trip/verifyInvitation`, {
        params: { inviteLink: inviteLink },
        headers: {
          authorization: token,
        },
      });
      setCurrentStage(response.data.currentStage);
      setTripId(response.data.tripId);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data);
      }
    }
  };

  //   ==================== animate ====================

  const spin = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${spin.value}deg`,
        },
      ],
    };
  });

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="bg-[#0000008C] h-[100%] flex-1 justify-center items-center"
    >
      <Animated.View style={style}>
        <LoadingSvg />
      </Animated.View>
    </View>
  );
};

export default InviteVerify;
