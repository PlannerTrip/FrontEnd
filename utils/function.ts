import * as Location from "expo-location";

export const changeDateFormat = (date: string) => {
  const monthNames: { [key: string]: string } = {
    Jan: "มกราคม",
    Feb: "กุมภาพันธ์",
    Mar: "มีนาคม",
    Apr: "เมษายน",
    May: "พฤษภาคม",
    Jun: "มิถุนายน",
    Jul: "กรกฎาคม",
    Aug: "สิงหาคม",
    Sep: "กันยายน",
    Oct: "ตุลาคม",
    Nov: "พฤศจิกายน",
    Dec: "ธันวาคม",
  };

  if (date) {
    const dateArray = date.split(" ");

    return dateArray[2] + " " + monthNames[dateArray[1]] + " " + dateArray[3];
  }
  return "";
};

export const distanceTwoPoint = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371; // Radius of the Earth in kilometers

  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const getCurrentLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("Permission to access location was denied");
    return;
  }
  let currentLocation = await Location.getCurrentPositionAsync({});
  return currentLocation;
};

export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// date ago
export const timeDifferenceDisplay = (dateString: string) => {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Current time
  const now = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = now.getTime() - date.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let timeString = "";
  if (days < 1) {
    if (hours < 1) {
      timeString = `${minutes} นาทีที่แล้ว`;
    } else {
      timeString = `${hours} ชั่วโมงที่แล้ว`;
    }
  } else if (days < 7) {
    timeString = `${days} วันที่แล้ว`;
  } else {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "2-digit",
    };
    const thaiLocale = "th-TH";
    timeString = date
      .toLocaleDateString(thaiLocale, options)
      .replace(`${date.getFullYear() + 543}`, `${date.getFullYear()}`);
  }

  return timeString;
};

// date format DD/MM/YY
// https://docs.oracle.com/cd/E41183_01/DR/Date_Format_Types.html
export const changeDateFormat2 = (dateString: string) => {
  const date = new Date(dateString);

  // Format the date
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Add leading zeros if needed
  const formattedDate = `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}`;

  return formattedDate; // Output: 28/02/2024
};

export const compareTime = (a: string, b: string) => {
  const [hourA, minuteA] = a.split(":").map(Number);
  const [hourB, minuteB] = b.split(":").map(Number);

  if (hourA !== hourB) {
    return hourA - hourB;
  } else {
    return minuteA - minuteB;
  }
};

const changeFormatToPlan = (dailyPlan: Plan) => {
  const formatPlan = [
    ...dailyPlan.places.map((item) => ({
      id: item.placeId,
      startTime: item.startTime,
      endTime: item.endTime,
      type: "place",
      name: item.placeName,
      coverImg: item.covetImg,
      location: item.location,
      latitude: item.latitude,
      longitude: item.longitude,
    })),
    ...dailyPlan.activity.map((item) => ({
      id: item.activityId,
      startTime: item.startTime,
      endTime: item.endTime,
      type: "activity",
      name: item.name,
      coverImg: [],
      location: { address: "", district: "", province: "" },
      latitude: 0,
      longitude: 0,
    })),
  ];

  const sortPlan = formatPlan.sort((dailyPlanA, dailyPlanB) => {
    return timeComparator(dailyPlanA.startTime, dailyPlanB.startTime);
  });

  let firstPlace = true;
  let currentPosition = { latitude: 0, longitude: 0 };

  const addFirstPlace = sortPlan.map((current) => {
    if (current.type === "place" && firstPlace) {
      firstPlace = false;
      currentPosition = {
        latitude: current.latitude,
        longitude: current.longitude,
      };
      return { ...current, firstPlace: true };
    }
    return { ...current, firstPlace: false };
  });

  // add distant from prevPlace
  const sortPlanAddDistant = addFirstPlace.map((dailyPlan, index) => {
    let distant = -1;
    if (dailyPlan.type === "activity") {
      return { ...dailyPlan, distant: 0 };
    }

    if (index !== 0) {
      distant = distanceTwoPoint(
        currentPosition.latitude,
        currentPosition.longitude,
        dailyPlan.latitude,
        dailyPlan.longitude,
      );
    }

    currentPosition = {
      latitude: dailyPlan.latitude,
      longitude: dailyPlan.longitude,
    };
    return { ...dailyPlan, distant: distant };
  });

  return sortPlanAddDistant;
};
