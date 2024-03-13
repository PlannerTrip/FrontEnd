import { View } from "react-native";
import TextTitle from "../tripCreate/TextTitle";

const PlanActivityCard = ({ name }: { name: string }) => {
  return (
    <View className="flex-row mt-[16px] w-[282px]  border rounded-[5px] px-[8px] py-[22px]">
      <TextTitle numberOfLines={2} title={name} additionalClass="w-[266px]" />
    </View>
  );
};

export default PlanActivityCard;
