import React, { useContext } from "react";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ButtonCustom from "../../components/button";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../../interface/navigate";
import { AuthData } from "../../contexts/authContext";
import Header from "../../components/tripCreate/Header";

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

type Props = NativeStackScreenProps<StackParamList, "stopSelect">;

const StopSelect = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const { token } = useContext(AuthData);

  const onPressBack = () => {};

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="bg-[#FFF] h-[100%] flex"
    >
      <Header title="เพิ่มจุดแวะ" onPressBack={onPressBack} />
      <MapView
        className="h-[100px] grow"
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 13.847,
          longitude: 100.635,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: 10,
            longitude: 10,
          }}
          title="กะทิบ้านไทย"
          description="ไปเลย"
        />
      </MapView>
    </View>
  );
};

export default StopSelect;
