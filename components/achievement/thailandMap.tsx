import { Dimensions, StyleSheet, View } from "react-native";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import mapData, { province_names } from "../../utils/mapData.js";
import { Svg, Path } from "react-native-svg";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

const ThailandMap = ({
  setProvince,
  province,
  checkInProvinces,
}: {
  setProvince: React.Dispatch<React.SetStateAction<string>>;
  province: string;
  checkInProvinces: string[];
}) => {
  const { width, height } = Dimensions.get("screen");

  //========================= useShare =========================
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);

  const prevPositionX = useSharedValue(0);
  const prevPositionY = useSharedValue(0);

  const finalPositionX = useSharedValue(0);
  const finalPositionY = useSharedValue(0);

  const flingPositionX = useSharedValue(0);
  const flingPositionY = useSharedValue(0);

  //========================= useState =========================

  const [activeColor, setActiveColor] = useState("");

  //========================= GestureHandle =========================
  const size = {
    x: 300 / 2,
    y: 600 / 2,
  };

  const flingGesture = Gesture.Pan()
    .onUpdate((e) => {
      const calX = finalPositionX.value + e.translationX / scale.value;
      const calY = finalPositionY.value + e.translationY / scale.value;

      // const test = scale.value;
      // const test = 1;
      // if (calX < 50 * test && calX > -50 * test) {
      flingPositionX.value = calX;
      // }

      // if (calY < 100 * test && calY > -100 * test) {
      flingPositionY.value = calY;
      // }
    })
    .onEnd((e) => {
      finalPositionX.value = flingPositionX.value;
      finalPositionY.value = flingPositionY.value;

      // console.log(flingPositionX.value, flingPositionY.value);
    });

  const pinchGesture = Gesture.Pinch()

    .onStart((e) => {
      positionX.value = withTiming(flingPositionX.value + e.focalX, {
        duration: (100 * (savedScale.value - 1)) / savedScale.value,
      });
      positionY.value = withTiming(flingPositionY.value + e.focalY, {
        duration: (100 * (savedScale.value - 1)) / savedScale.value,
      });
    })
    // && savedScale.value * e.scale <= 5
    .onUpdate((e) => {
      // console.log(e.scale, scale.value);
      if (savedScale.value * e.scale >= 1) {
        scale.value = savedScale.value * e.scale;
        // console.log("scale", scale.value, "e scale ", e.scale);
      }
    })
    .onEnd(() => {
      prevPositionX.value = positionX.value;
      prevPositionY.value = positionY.value;
      savedScale.value = scale.value;
    });

  //========================= AnimatedStyle =========================
  const mapAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: positionX.value },
      { translateY: positionY.value },
      { translateX: -size.x },
      { translateY: -size.y },
      { scale: scale.value },
      { translateX: -positionX.value },
      { translateY: -positionY.value },
      { translateX: size.x },
      { translateY: size.y },
      { translateX: flingPositionX.value },
      { translateY: flingPositionY.value },
    ],
  }));

  useEffect(() => {
    positionX.value = 0;
    positionY.value = 0;
    scale.value = 1;
  }, []);

  const [selectedProvinces, setSelectedProvinces] = useState([]);

  return (
    <GestureHandlerRootView style={{ flex: 1, width: 400, height: 600 }}>
      <View>
        <View
          style={{
            width: width,
            height: height - 250,
            // backgroundColor: "red",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.View style={mapAnimatedStyle}>
            <GestureDetector gesture={flingGesture}>
              <GestureDetector gesture={pinchGesture}>
                <View
                  style={{
                    width: width,
                    height: 600,
                    backgroundColor: "white",
                    borderRadius: 20,
                    marginBottom: 30,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Svg
                    width={300}
                    height={600}
                    viewBox="0 0 560 1025"
                    aria-label="Map of Thailand"
                  >
                    {mapData.locations.map((item) => {
                      const nameTH =
                        province_names.find(
                          (province) => province.nameEN === item.name,
                        )?.nameTH || "";

                      let fillColor = "grey";
                      if (checkInProvinces.includes(nameTH)) {
                        fillColor = "#FFC502";
                      }
                      if (province === nameTH) {
                        fillColor = "#FF9E02";
                      }

                      return (
                        <Path
                          key={item.id}
                          onPress={() => {
                            setActiveColor((activeColor) =>
                              activeColor === item.id ? "" : item.id,
                            );

                            if (item.name === province) {
                              setProvince("");
                            } else {
                              setProvince(
                                province_names.find(
                                  (province) => province.nameEN === item.name,
                                )?.nameTH || "",
                              );
                            }
                          }}
                          id={item.id}
                          name={item.name}
                          fill={fillColor}
                          d={item.path}
                        />
                      );
                    })}
                  </Svg>
                </View>
              </GestureDetector>
            </GestureDetector>
          </Animated.View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};
export default ThailandMap;
