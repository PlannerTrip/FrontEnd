import Clear from "../assets/forecast/Clear.svg";
import PartlyCloudy from "../assets/forecast/Partly cloudy.svg";
import Cloudy from "../assets/forecast/Cloundy.svg";
import Overcast from "../assets/forecast/Overcast.svg";
import LightRain from "../assets/forecast/Light rain.svg";
import ModerateRain from "../assets/forecast/Moderate rain.svg";
import HeavyRain from "../assets/forecast/Heavy rain.svg";
import Thunderstorm from "../assets/forecast/Thunderstorm.svg";
import Cold from "../assets/forecast/cold.svg";
import Hot from "../assets/forecast/hot.svg";

import { View, Text } from "react-native";

const ForecastCustom = ({
  date,
  predict,
}: {
  date: string;
  predict: number;
}) => {
  const dict: { [key: number]: JSX.Element } = {
    1: <Clear />,
    2: <PartlyCloudy />,
    3: <Cloudy />,
    4: <Overcast />,
    5: <LightRain />,
    6: <ModerateRain />,
    7: <HeavyRain />,
    8: <Thunderstorm />,
    9: <Cold />,
    10: <Hot />,
    11: <Cold />,
    12: <Hot />,
  };

  const dateList = date.split(/-|T/);
  const formatDate = dateList[2] + "/" + dateList[1];
  return (
    <View className="flex-rol items-center">
      {dict[predict] ? dict[predict] : null}
      <Text>{formatDate}</Text>
    </View>
  );
};

export default ForecastCustom;
