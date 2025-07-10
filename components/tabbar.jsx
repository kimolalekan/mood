import { useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";

import Icon from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const Tabbar = ({ tab }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate("Home")}>
          <View style={styles.tab}>
            <Icon
              name={"home-filled"}
              size={28}
              color={tab === "home" ? "#00A86B" : "#666"}
            />
            <Text
              style={[
                styles.text,
                {
                  color: tab === "home" ? "#00A86B" : "#666",
                },
              ]}
            >
              Home
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("History")}
        >
          <View style={styles.tab}>
            <Icon
              name={"history-toggle-off"}
              size={28}
              color={tab === "history" ? "#00A86B" : "#666"}
            />
            <Text
              style={[
                styles.text,
                {
                  color: tab === "history" ? "#00A86B" : "#666",
                },
              ]}
            >
              History
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 30,
    borderTopWidth: 2,
    borderColor: "#DDDCCD",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  tab: {
    flex: 1,
    paddingTop: 10,
    alignItems: "center",
  },
  icon: { width: 30, height: 30, resizeMode: "contain" },
  text: {
    fontSize: 12,
    color: "#666",
    paddingTop: 5,
    marginBottom: 15,
  },
});

export default Tabbar;
