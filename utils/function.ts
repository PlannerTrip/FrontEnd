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
    const dateArray = date.split(" ");

    return dateArray[2] + " " + monthNames[dateArray[1]] + " " + dateArray[3];
};

export const distanceTwoPoint = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
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
