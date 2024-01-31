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
import { CLOSE, FAIL, LOADING, RELOAD, SUCCESS } from "../utils/const";
import Modal from "../components/modal";
import { AuthData } from "../contexts/authContext";

type Props = NativeStackScreenProps<StackParamList, "inviteVerify">;

const InviteVerify = ({ route, navigation }: Props) => {
  const { authStatus } = useContext(AuthData);
  const insets = useSafeAreaInsets();

  const { inviteLink } = route.params;

  //   ==================== useState ====================

  const [currentStage, setCurrentStage] = useState("");
  const [tripId, setTripId] = useState("");

  const [errorMessage, setErrorMessage] = useState({
    title: "",
    subTitle: "",
    action: CLOSE,
  });

  //   ==================== useEffect ====================

  useEffect(() => {
    spin.value = withRepeat(withTiming(360, { duration: 2000 }), 0);
  }, []);

  // verifyInviteLink
  useFocusEffect(
    useCallback(() => {
      if (authStatus !== LOADING) {
        // reset value
        setCurrentStage("");
        setTripId("");
        setErrorMessage({ title: "", subTitle: "", action: CLOSE });
        // checkLink
        verifyInviteLink();
      }
    }, [inviteLink, authStatus])
  );

  useEffect(() => {
    if (authStatus === SUCCESS && tripId !== "") {
      if (currentStage === "invitation") {
        navigation.navigate("invitation", {
          tripId: tripId,
        });
      } else if (currentStage === "placeSelect") {
        navigation.navigate("placeSelect", {
          tripId: tripId,
        });
      }
    }
    if (authStatus === FAIL && tripId !== "") {
      navigation.navigate("signIn");
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
        if (error.response.data.error === "maximumCapacity") {
          setErrorMessage({
            title: "จำนวนสมาชิกในทริปเต็มแล้ว",
            subTitle: "",
            action: CLOSE,
          });
        } else if (error.response.data.error === "invalidInviteLink") {
          setErrorMessage({
            title: "มีบางอย่างผิดปกติ",
            subTitle: "โปรดลองให่อีกครั้ง",
            action: CLOSE,
          });
        }
      } else {
        // when internet error
        setErrorMessage({
          title: "มีบางอย่างผิดปกติ",
          subTitle: "โปรดลองให่อีกครั้ง",
          action: RELOAD,
        });
      }
    }
  };

  const handleOnPressModal = () => {
    if (errorMessage.action === CLOSE) {
      if (authStatus === SUCCESS) {
        navigation.navigate("tab");
      } else if (authStatus === FAIL) {
        navigation.navigate("signIn");
      }
    } else if (errorMessage.action === RELOAD) {
      // reset value
      setErrorMessage({ title: "", subTitle: "", action: CLOSE });
      // checkLink
      verifyInviteLink();
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
      {errorMessage.title === "" ? (
        <Animated.View style={style}>
          <LoadingSvg />
        </Animated.View>
      ) : (
        <Modal
          title={errorMessage.title}
          supTitle={errorMessage.subTitle}
          buttonTitle={errorMessage.action === CLOSE ? "ปิด" : "รีโหลด"}
          onPress={handleOnPressModal}
        />
      )}
    </View>
  );
};

export default InviteVerify;
