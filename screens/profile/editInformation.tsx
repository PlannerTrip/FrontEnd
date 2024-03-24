import React, { useState, useCallback, useContext, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "react-native";
import { API_URL } from "@env";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { AuthData } from "../../contexts/authContext";

// =============== type ===============
import { StackParamList } from "../../interface/navigate";
type Props = NativeStackScreenProps<StackParamList, "editInformation">;

const EditInformation = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  // const { tripId } = route.params;
  const { token } = useContext(AuthData);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <Text>EditInformation</Text>
    </View>
  );
};

export default EditInformation;
