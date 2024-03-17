import { Pressable, View } from "react-native";

import TextTitle from "../tripCreate/TextTitle";
import ButtonCustom from "../button";

import { changeDateFormat } from "../../utils/function";

import Close from "../../assets/tripSummary/Close.svg";

const DaySelectModal = ({
  dayList,
  onClickClose,
  onPressModalDateSelect,
}: {
  dayList: { day: number; date: string; disable: boolean }[];
  onClickClose: () => void;
  onPressModalDateSelect: (day: number) => void;
}) => {
  return (
    <View className="p-[16px] w-[279px] bg-white flex items-center relative rounded-lg">
      <TextTitle title="โปรดเลือก" additionalClass="mb-[8px]" />
      <Pressable
        onPress={onClickClose}
        className="absolute top-[12px] right-[12px]"
      >
        <Close />
      </Pressable>
      {dayList.map((day) => (
        <ButtonCustom
          size="middle"
          title={`${changeDateFormat(day.date)} (วันที่${day.day})`}
          width="w-[247px]"
          disable={day.disable}
          onPress={() => {
            onPressModalDateSelect(day.day);
          }}
        />
      ))}
    </View>
  );
};

export default DaySelectModal;
