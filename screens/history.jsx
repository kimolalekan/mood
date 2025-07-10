import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tabbar from "../components/tabbar";
import Icon from "react-native-vector-icons/Ionicons";
import dayjs from "dayjs";

export default function History({ navigation }) {
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoodHistory = async () => {
      try {
        const history = await AsyncStorage.getItem("moodHistory");
        if (history) {
          const parsedHistory = JSON.parse(history);
          // Sort by most recent first
          parsedHistory.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
          );
          setMoodHistory(parsedHistory);
        }
      } catch (error) {
        console.error("Error fetching mood history:", error);
        alert("Failed to load mood history");
      } finally {
        setLoading(false);
      }
    };

    fetchMoodHistory();
  }, []);

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem("moodHistory");
      setMoodHistory([]);
      alert("History cleared successfully");
    } catch (error) {
      console.error("Error clearing history:", error);
      alert("Failed to clear history");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.moodInfo}>
        <Image
          source={{ uri: item.mood.image }}
          style={styles.historyMoodImage}
        />
        <View style={styles.moodDetails}>
          <Text style={styles.moodSentiment}>{item.mood.sentiment}</Text>
          <Text style={styles.moodTime}>
            {dayjs(item.timestamp).format("MMM D, YYYY [at] h:mm A")}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.moodColorIndicator,
          { backgroundColor: item.mood.color },
        ]}
      />
    </View>
  );

  return (
    <View style={styles.main}>
      <StatusBar backgroundColor="#F2E6CA" barStyle="dark-content" />
      <SafeAreaView style={styles.main}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Mood History</Text>
            {moodHistory.length > 0 && (
              <TouchableOpacity
                onPress={clearHistory}
                style={styles.clearButton}
              >
                <Icon name="trash-outline" size={24} color="#F44336" />
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#00A86B"
              style={styles.loader}
            />
          ) : moodHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="calendar-outline" size={60} color="#00A86B" />
              <Text style={styles.emptyText}>No mood history yet</Text>
              <Text style={styles.emptySubtext}>
                Track your first mood to see it here
              </Text>
              <TouchableOpacity
                style={styles.trackButton}
                onPress={() => navigation.navigate("Home")}
              >
                <Text style={styles.trackButtonText}>Track Your Mood</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={moodHistory}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>

        <Tabbar tab="history" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: "#F2E6CA" },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#444",
  },
  clearButton: {
    padding: 8,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#444",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#777",
    marginTop: 8,
    textAlign: "center",
  },
  trackButton: {
    backgroundColor: "#00A86B",
    borderRadius: 10,
    padding: 15,
    marginTop: 30,
    width: "80%",
    alignItems: "center",
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  listContent: {
    paddingBottom: 20,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  moodInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  historyMoodImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  moodDetails: {
    flex: 1,
  },
  moodSentiment: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
  },
  moodTime: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  moodColorIndicator: {
    width: 10,
    height: 40,
    borderRadius: 5,
    marginLeft: 10,
  },
});
