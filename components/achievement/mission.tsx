import { View, Text } from "react-native";

import { ScrollView } from "react-native-gesture-handler";

import MissionProvince from "./missionProvince";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

// https://www.thairath.co.th/lifestyle/travel/2701496
// คณะกรรมการภูมิศาสตร์แห่งชาติ พ.ศ.2520
const regionMission = [
  {
    title: "พิชิตภาคเหนือ",
    provinces: [
      "เชียงราย",
      "น่าน",
      "พะเยา",
      "เชียงใหม่",
      "แม่ฮ่องสอน",
      "แพร่",
      "ลำปาง",
      "ลำพูน",
      "อุตรดิตถ์",
    ],
  },
  {
    title: "พิชิตภาคกลาง",
    provinces: [
      "พิษณุโลก",
      "สุโขทัย",
      "เพชรบูรณ์",
      "พิจิตร",
      "กำแพงเพชร",
      "นครสวรรค์",
      "ลพบุรี",
      "ชัยนาท",
      "อุทัยธานี",
      "สิงห์บุรี",
      "อ่างทอง",
      "สระบุรี",
      "พระนครศรีอยุธยา",
      "สุพรรณบุรี",
      "นครนายก",
      "ปทุมธานี",
      "นนทบุรี",
      "นครปฐม",
      "สมุทรปราการ",
      "สมุทรสาคร",
      "สมุทรสงคราม",
    ],
  },
  {
    title: "พิชิตภาคตะวันออกเฉียงเหนือ",
    provinces: [
      "หนองคาย",
      "นครพนม",
      "สกลนคร",
      "อุดรธานี",
      "หนองบัวลำภู",
      "เลย",
      "มุกดาหาร",
      "กาฬสินธุ์",
      "ขอนแก่น",
      "อำนาจเจริญ",
      "ยโสธร",
      "ร้อยเอ็ด",
      "มหาสารคาม",
      "ชัยภูมิ",
      "นครราชสีมา",
      "บุรีรัมย์",
      "สุรินทร์",
      "ศรีสะเกษ",
      "อุบลราชธานี",
    ],
  },
  {
    title: "พิชิตภาคตะวันออก",
    provinces: [
      "สระแก้ว",
      "ปราจีนบุรี",
      "ฉะเชิงเทรา",
      "ชลบุรี",
      "ระยอง",
      "จันทบุรี",
      "ตราด",
    ],
  },
  {
    title: "พิชิตภาคตะวันตก",
    provinces: ["ตาก", "กาญจนบุรี", "ราชบุรี", "เพชรบุรี", "ประจวบคีรีขันธ์"],
  },
  {
    title: "พิชิตภาคใต้",
    provinces: [
      "ชุมพร",
      "ระนอง",
      "สุราษฎร์ธานี",
      "นครศรีธรรมราช",
      "กระบี่",
      "พังงา",
      "ภูเก็ต",
      "พัทลุง",
      "ตรัง",
      "ปัตตานี",
      "สงขลา",
      "สตูล",
      "นราธิวาส",
      "ยะลา",
    ],
  },
];

const Mission = ({ checkInProvinces }: { checkInProvinces: string[] }) => {
  const [region, setRegion] = useState<
    {
      title: string;
      provinces: string[];
      checkIn: string[];
    }[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      const regionMissionWithCheckIn = regionMission.map((region) => ({
        ...region,
        checkIn: region.provinces.filter((province) =>
          checkInProvinces.includes(province),
        ),
      }));

      setRegion(regionMissionWithCheckIn);
    }, []),
  );

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      className="p-[16px]"
    >
      <View className="bg-[#F7F7F7] p-[16px] rounded-[10px]">
        <Text className="text-[24px] leading-[36px] font-bold border-b">
          พิชิตภูมิภาค
        </Text>
        <Text className="text-[12px] leading-[18px] font-bold border-b">
          อ้างอิงตาม คณะกรรมการภูมิศาสตร์แห่งชาติ พ.ศ.2520
        </Text>
        <View className="border-t border-black mt-[8px]"></View>

        {region.map((region, index) => {
          return (
            <MissionProvince
              title={region.title}
              provinces={region.provinces}
              checkIn={region.checkIn}
              key={index}
            />
          );
        })}
      </View>

      <View className="bg-[#F7F7F7] p-[16px] rounded-[10px] mt-[16px]">
        <Text className="text-[24px] leading-[36px] font-bold border-b">
          นักล่าสถานที่
        </Text>
        <View className="border-t border-black mt-[8px]"></View>

        <Text className="text-[24px] leading-[36px] font-bold border-b text-center py-[32px] text-[#C0C0C0]">
          พบกันเร็วๆนี้
        </Text>
      </View>
    </ScrollView>
  );
};

export default Mission;
