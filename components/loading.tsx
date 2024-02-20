import React, { useEffect } from "react";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// ==================== svg ====================

import LoadingSvg from "../assets/loading.svg";

const LoadingCustom = () => {
  //   ==================== useEffect ====================

  useEffect(() => {
    spin.value = withRepeat(withTiming(360, { duration: 2000 }), 0);
  }, []);

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
    <Animated.View style={style}>
      <LoadingSvg />
    </Animated.View>
  );
};

export default LoadingCustom;
