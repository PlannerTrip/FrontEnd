import {
    View,
    Text,
    Pressable,
    TextInput,
    FlatList,
    ScrollView,
    Dimensions,
    Keyboard,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";

import Add from "../assets/autoComplete/add.svg";
import Check from "../assets/autoComplete/check.svg";
import Empty from "../assets/autoComplete/empty.svg";

import { Icon } from "@ui-kitten/components";
import { useFocusEffect } from "@react-navigation/native";
import { PlaceOption } from "../interface/blog";
import LoadingCustom from "./loading";

const AutoCompleteCustom = ({
    placeholder,
    selected,
    setSelected,
    options,
    // setOptions,
    search,
    setSearch,
    selectedMultiple,
    setSelectedMultiple,
    multiple = false,
    loading,
}: {
    placeholder?: string;
    selected?: string;
    setSelected?: React.Dispatch<React.SetStateAction<string>>;
    options: PlaceOption[];
    // setOptions: React.Dispatch<React.SetStateAction<string[]>>;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    selectedMultiple?: PlaceOption[];
    setSelectedMultiple?: React.Dispatch<React.SetStateAction<PlaceOption[]>>;
    multiple?: boolean;
    loading: boolean;
}) => {
    const screenWidth = Dimensions.get("window").width;

    const [displayOptions, setDisplayOptions] = useState(false);

    const textInputRef = useRef(null);

    useFocusEffect(
        useCallback(() => {
            if (selected) {
                setSearch(selected);
            }
        }, [selected])
    );

    const renderOptions = () => {
        if (multiple && search === "") {
            return <></>;
        }
        if (options.length) {
            if (loading) {
                return (
                    <View className=" border-b border-x rounded-[2px] border-[#D9D9D9] py-[4px] flex justify-center flex-row">
                        <View
                            className="flex justify-center"
                            style={{
                                height: 3 * (24 + 18 + 24 + 8),
                            }}
                        >
                            <LoadingCustom />
                        </View>
                    </View>
                );
            }
            return (
                <View className=" border-b border-x rounded-[2px] border-[#D9D9D9] py-[4px] flex justify-center flex-row">
                    <ScrollView
                        horizontal={true}
                        keyboardShouldPersistTaps="handled"
                    >
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

                                const district = option.location.district;
                                const province = option.location.province;
                                const placeId = option.placeId;
                                const placeName = option.placeName;

                                let isSelected = false;

                                if (multiple) {
                                    isSelected = selectedMultiple
                                        ? selectedMultiple.includes(option)
                                        : false;
                                } else {
                                    isSelected = selected
                                        ? selected === ""
                                        : false;
                                }

                                return (
                                    <Pressable
                                        className="px-[4px] py-[4px] "
                                        onPress={() => {
                                            if (multiple) {
                                                setSelectedMultiple &&
                                                    setSelectedMultiple(
                                                        (prev) => {
                                                            const index =
                                                                prev.findIndex(
                                                                    (item) =>
                                                                        item.placeId ===
                                                                        placeId
                                                                );

                                                            if (index !== -1) {
                                                                const updatedArray =
                                                                    [...prev];
                                                                updatedArray.splice(
                                                                    index,
                                                                    1
                                                                );
                                                                return updatedArray;
                                                            }

                                                            return [
                                                                ...prev,
                                                                option,
                                                            ];
                                                        }
                                                    );
                                            } else {
                                                // setSelected &&
                                                //     setSelected(option);
                                                // Keyboard.dismiss();
                                            }
                                        }}
                                    >
                                        <View
                                            className={`${
                                                isSelected
                                                    ? "bg-[#FCF8EF]"
                                                    : " bg-[#FAFAFA]"
                                            } px-[8px] py-[12px] flex flex-row items-center rounded-[4px]`}
                                        >
                                            {isSelected ? <Check /> : <Add />}
                                            {multiple ? (
                                                <View className="ml-[16px]">
                                                    <Text
                                                        numberOfLines={1}
                                                        className="font-bold text-[16px] leading-[24px] truncate"
                                                        style={{
                                                            width:
                                                                screenWidth -
                                                                16 * 2 -
                                                                2 -
                                                                70,
                                                        }}
                                                    >
                                                        {placeName}
                                                    </Text>
                                                    <Text
                                                        numberOfLines={1}
                                                        className="text-[12px] leading-[18px] truncate"
                                                    >
                                                        {district}, {province}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <></>
                                            )}
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
        <View style={{}}>
            <TextInput
                className="h-[40px] p-[8px] border border-[#D9D9D9] rounded-[2px]"
                placeholder={placeholder}
                onFocus={() => {
                    setDisplayOptions(true);
                }}
                value={search}
                onBlur={() => {
                    setDisplayOptions(false);
                }}
                onChangeText={(text) => {
                    setSearch(text);
                }}
                ref={textInputRef}
            />

            <Pressable
                className="absolute right-[0px] top-[0px] w-[60px] h-[40px] flex justify-center items-center"
                onPress={() => {
                    textInputRef.current?.focus();
                }}
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

export default AutoCompleteCustom;
