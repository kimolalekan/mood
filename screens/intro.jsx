import React from "react";
import { View, StatusBar, Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const Intro = () => {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        auth();
      }, 3000);
    }, []),
  );

  const auth = async () => {
    navigation.navigate("Home");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F6EDE3",
      }}
    >
      <StatusBar backgroundColor="#F6EDE3" barStyle="dark-content" />
      <View
        style={{
          flex: 1,
          position: "relative",
          top: -40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../assets/images/splash-icon.png")}
          style={{ resizeMode: "contain", height: 300 }}
        />
      </View>
    </View>
  );
};

export default Intro;
