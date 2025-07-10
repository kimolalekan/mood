import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tabbar from "../components/tabbar";
import Emoji from "react-native-emoji";
import { Column as Col, Row } from "react-native-flexbox-grid";
import Icon from "react-native-vector-icons/Ionicons";
import { StatusBar } from "react-native";

const moods = [
  {
    emoji: "smile",
    sentiment: "Happy",
    color: "#4CAF50",
    image: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/512.gif",
  },
  {
    emoji: "sunglasses",
    sentiment: "Confident",
    color: "#2196F3",
    image: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f60e/512.gif",
  },
  {
    emoji: "neutral_face",
    sentiment: "Indifferent",
    color: "#FFC107",
    image: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/512.gif",
  },
  {
    emoji: "tired_face",
    sentiment: "Tired",
    color: "#795548",
    image: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f62a/512.gif",
  },
  {
    emoji: "angry",
    sentiment: "Angry",
    color: "#F44336",
    image: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f621/512.gif",
  },
  {
    emoji: "pensive",
    sentiment: "Sad",
    color: "#9C27B0",
    image: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.gif",
  },
];

export default function Mood({ navigation }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMoodSelection = (mood) => {
    setSelectedMood(mood);
  };

  const saveMood = async () => {
    if (!selectedMood) {
      alert("Please select a mood first");
      return;
    }

    setLoading(true);
    try {
      const timestamp = new Date().toISOString();
      const moodEntry = {
        mood: {
          sentiment: selectedMood.sentiment,
          emoji: selectedMood.emoji,
          color: selectedMood.color,
          image: selectedMood.image,
        },
        timestamp,
      };

      const existingData = await AsyncStorage.getItem("moodHistory");
      const history = existingData ? JSON.parse(existingData) : [];
      history.push(moodEntry);
      await AsyncStorage.setItem("moodHistory", JSON.stringify(history));

      // alert(`Saved: ${selectedMood.sentiment}`);
      setSelectedMood(null);
      navigation.navigate("History");
    } catch (error) {
      console.error("Error saving mood:", error);
      alert("Failed to save mood. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedMoodData = moods.find(
    (m) => m.sentiment === selectedMood?.sentiment,
  );

  return (
    <View style={styles.main}>
      <StatusBar backgroundColor="#F2E6CA" barStyle="dark-content" />
      <SafeAreaView style={styles.main}>
        <View style={styles.container}>
          <Text style={styles.title}>How are you today?</Text>

          <View style={styles.moodContainer}>
            {selectedMood ? (
              <>
                <TouchableOpacity
                  onPress={() => setSelectedMood(null)}
                  style={styles.backButton}
                  accessibilityLabel="Go back to mood selection"
                >
                  <Icon name="chevron-back" size={30} color="#494161" />
                  <Text style={styles.backButtonText}>Change mood</Text>
                </TouchableOpacity>

                <Image
                  source={{ uri: selectedMoodData?.image }}
                  style={styles.moodImage}
                  accessibilityLabel={selectedMood.sentiment}
                />

                <Text style={styles.selectedMoodText}>
                  You're feeling {selectedMood.sentiment}
                </Text>
              </>
            ) : (
              <Row>
                {moods.map((mood) => (
                  <Col sm={4} key={mood.emoji}>
                    <TouchableWithoutFeedback
                      onPress={() => handleMoodSelection(mood)}
                      accessibilityLabel={`Select ${mood.sentiment} mood`}
                    >
                      <View
                        style={[
                          styles.moodItem,
                          {
                            backgroundColor:
                              selectedMood?.sentiment === mood.sentiment
                                ? "#fcf8ff"
                                : "transparent",
                            borderColor:
                              selectedMood?.sentiment === mood.sentiment
                                ? "#00A86B"
                                : "transparent",
                          },
                        ]}
                      >
                        <Emoji name={mood.emoji} style={styles.emoji} />
                        <Text style={styles.moodLabel}>{mood.sentiment}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </Col>
                ))}
              </Row>
            )}

            {selectedMood && (
              <TouchableOpacity
                style={styles.saveButton}
                disabled={loading}
                onPress={saveMood}
                accessibilityLabel="Save your mood"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Mood</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Tabbar tab="home" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: "#F2E6CA" },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 50,
  },
  moodContainer: {
    width: "100%",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#494161",
    fontSize: 16,
    marginLeft: 5,
  },
  moodImage: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  selectedMoodText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#494161",
    marginBottom: 30,
  },
  emoji: {
    fontSize: 50,
  },
  moodItem: {
    alignItems: "center",
    padding: 10,
    marginBottom: 20,
    // borderWidth: 1,
    // borderRadius: 10,
    backgroundColor: "#fff",
    // elevation: 2,
  },
  moodLabel: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 14,
    color: "#555",
  },
  saveButton: {
    backgroundColor: "#00A86B",
    borderRadius: 10,
    padding: 15,
    width: "80%",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
