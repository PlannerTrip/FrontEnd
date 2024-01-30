import React, { useEffect } from "react";
import { View } from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useSafeAreaInsets } from "react-native-safe-area-context";

// ==================== svg ====================

import LoadingSvg from "../assets/loading.svg";

const Loading = () => {
  //   ==================== useEffect ====================

  useEffect(() => {
    spin.value = withRepeat(withTiming(360, { duration: 2000 }), 0);
  }, []);

  //   ==================== animate ====================

  const spin = useSharedValue(0);

  const insets = useSafeAreaInsets();

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

export default Loading;
