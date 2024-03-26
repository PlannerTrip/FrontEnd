import { View, Pressable, TextInput } from "react-native";

import ArrowLeft from "../assets/ArrowLeft.svg";
import { Icon } from "@ui-kitten/components";

const SearchCustom = ({
  handleGoBack,
  placeholder,
  search,
  setSearch,
  showArrow = true,
}: {
  handleGoBack?: () => void;
  placeholder: string;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showArrow?: boolean;
}) => {
  return (
    <View className=" flex flex-row items-center  flex-grow">
      {/* back */}
      {showArrow && (
        <Pressable className="w-[30px]" onPress={handleGoBack}>
          <ArrowLeft />
        </Pressable>
      )}

      {/* input */}
      <TextInput
        className="h-[40px] pl-[40px] border border-[#D9D9D9] rounded-[2px] grow"
        placeholder={placeholder}
        value={search}
        onChangeText={(text) => {
          setSearch(text);
        }}
      />

      <View className={`absolute ${showArrow ? "left-[40px]" : "left-[10px]"}`}>
        <Icon
          fill={"#BFBFBF"}
          style={{ width: 20, height: 20 }}
          name={"search-outline"}
        />
      </View>
    </View>
  );
};

export default SearchCustom;
