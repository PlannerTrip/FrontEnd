import React from "react";

import { View, Text } from "react-native";

import { PlaceCardInput } from "../../interface/placeSelect";

const PlaceCard = ({
  name,
  introduction,
  tag,
  forecast,
  location,
  selectBy,
  tripId,
}: PlaceCardInput) => {
  return (
    <View className="mb-[20px]">
      <Text>{name}</Text>
      <Text>{introduction}</Text>
      <Text>{location.district}</Text>
      <Text>{location.province}</Text>
      {tag.map((item) => (
        <Text>{item}</Text>
      ))}
      {selectBy.map((item) => (
        <Text>{item}</Text>
      ))}
    </View>
  );
};

export default PlaceCard;
