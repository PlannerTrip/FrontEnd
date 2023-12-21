import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Button } from "react-native";

import { Socket, io } from "socket.io-client";
import { API_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";

const SocketTab = () => {
  const [currentSocket, setCurrentSocket] = useState<any>();
  useFocusEffect(
    useCallback(() => {
      const socket = io("http://192.168.1.104:3000", {
        transports: ["websocket"],
      });
      setCurrentSocket(socket);
      socket.on("connect", () => {
        console.log("connect");
      });
      socket.on("connect_error", (error) => {
        console.log("Socket Error", error.message);
      });
      return () => {
        socket.disconnect();
        console.log("didnt focus");
      };
    }, [])
  );

  return (
    <View>
      <Text>Socket</Text>
      <Button
        title="sendMessage"
        onPress={() => {
          currentSocket.emit("message", "hi");
        }}
      />
    </View>
  );
};

export default SocketTab;
