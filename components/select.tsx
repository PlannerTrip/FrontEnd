import {
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Icon } from "@ui-kitten/components";

import Add from "../assets/autoComplete/add.svg";
import Check from "../assets/autoComplete/check.svg";
import Empty from "../assets/autoComplete/empty.svg";

const SelectCustom = ({
  placeholder = "",
  options,
  selected,
  setSelected,
  handlePress = () => {},
}: {
  placeholder: string;
  options: any;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  handlePress?: (tripName: string) => void;
}) => {
  const screenWidth = Dimensions.get("window").width;

  const [displayOptions, setDisplayOptions] = useState(false);

  const renderOptions = () => {
    if (options.length) {
      return (
        <View className=" border-b border-x rounded-[2px] border-[#D9D9D9] py-[4px] flex justify-center flex-row">
          <ScrollView horizontal={true} keyboardShouldPersistTaps="handled">
            <FlatList
              bounces={false}
              horizontal={false}
              style={{
                width: screenWidth - 16 * 2 - 2,
                maxHeight: 3 * (24 + 18 + 24 + 8),
              }}
              keyboardShouldPersistTaps="handled"
              data={options}
              renderItem={(item) => {
                const option = item.item;

                const tripName = option.tripName;

                const isSelected = tripName === selected;

                return (
                  <Pressable
                    className="px-[4px] py-[4px] "
                    onPress={() => {
                      if (tripName === selected) {
                        setSelected("");
                        handlePress("");
                      } else {
                        setSelected(tripName);
                        handlePress(tripName);
                      }
                      setDisplayOptions(false);
                    }}
                  >
                    <View
                      className={`${
                        isSelected ? "bg-[#FCF8EF]" : " bg-[#FAFAFA]"
                      } px-[8px] py-[12px] flex flex-row items-center rounded-[4px]`}
                    >
                      {isSelected ? <Check /> : <Add />}

                      <View className="ml-[16px]">
                        <Text
                          numberOfLines={1}
                          className="font-bold text-[16px] leading-[24px] truncate"
                          style={{
                            width: screenWidth - 16 * 2 - 2 - 70,
                          }}
                        >
                          {tripName}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              }}
            />
          </ScrollView>
        </View>
      );
    }

    return (
      <View className=" border-b border-x rounded-[2px] border-[#D9D9D9] py-[4px] flex justify-center flex-row">
        <View
          className="flex justify-center"
          style={{
            height: 3 * (24 + 18 + 24 + 8),
          }}
        >
          <Empty />
        </View>
      </View>
    );
  };
  return (
    <View>
      <Pressable
        className="h-[40px] p-[8px] border border-[#D9D9D9] rounded-[2px] flex items-center flex-row"
        onPress={() => {
          setDisplayOptions(!displayOptions);
        }}
      >
        <Text className={`${selected ? "" : "text-[#BFBFBF]"}`}>
          {selected ? selected : placeholder}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          setDisplayOptions(!displayOptions);
        }}
        className="absolute right-[0px] top-[0px] w-[60px] h-[40px] flex justify-center items-center"
      >
        <Icon
          fill={"#BFBFBF"}
          style={{ width: 20, height: 20 }}
          name={
            displayOptions
              ? "arrow-ios-upward-outline"
              : "arrow-ios-downward-outline"
          }
        />
      </Pressable>

      {displayOptions && renderOptions()}
    </View>
  );
};

export default SelectCustom;
