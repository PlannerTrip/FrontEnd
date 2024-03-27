import React, { useCallback, useEffect, useState, useContext } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthData } from "../contexts/authContext";
import { useFocusEffect } from "@react-navigation/native";

import { View } from "react-native";

// ==================== type ====================
import { StackParamList } from "../interface/navigate";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import * as SecureStore from "expo-secure-store";

import axios from "axios";

// ==================== const ====================
import { API_URL } from "@env";
import { CLOSE, FAIL, LOADING, RELOAD, SUCCESS } from "../utils/const";

import Modal from "../components/modal";
import LoadingCustom from "../components/loading";

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
    }, [inviteLink, authStatus]),
  );

  useEffect(() => {
    console.log("authStatus", authStatus, "tripId", tripId);
    if (authStatus === SUCCESS && tripId !== "") {
      if (currentStage === "invitation") {
        navigation.navigate("invitation", {
          tripId: tripId,
        });
      } else if (currentStage === "placeSelect") {
        navigation.navigate("placeSelect", {
          tripId: tripId,
        });
      } else if (currentStage === "planSelect") {
        navigation.navigate("planSelect", {
          tripId: tripId,
        });
      } else if (currentStage === "tripSummary") {
        navigation.navigate("tripSummary", {
          tripId: tripId,
        });
      } else if (currentStage === "finish" || currentStage === "delete") {
        navigation.navigate("tab");
      } else {
        navigation.navigate("stopSelect", {
          tripId: tripId,
          day: Number(currentStage.split("-")[1]),
        });
      }
    }
    if (authStatus === FAIL) {
      console.log("navigate signIn");
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
        <LoadingCustom />
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
