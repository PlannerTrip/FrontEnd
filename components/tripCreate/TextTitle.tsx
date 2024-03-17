import React from "react";
import { Text } from "react-native";

const TextTitle = ({
  title,
  color = "",
  additionalClass = "",
  numberOfLines = 1,
}: {
  title: string;
  color?: string;
  additionalClass?: string;
  numberOfLines?: number;
}) => {
  return (
    <Text
      style={{ color: color }}
      numberOfLines={numberOfLines}
      className={`text-[16px] leading-[24px] font-bold ${additionalClass}`}
    >
      {title}
    </Text>
  );
};

export default TextTitle;
