import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Get push token (not required for local notifications but good to have)
async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) return;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return;

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    })
  ).data;

  return token;
}

// Schedule recurring notification
async function scheduleMoodReminder() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "How are you feeling?",
      body: "It's time to log your current mood!",
      sound: true,
      data: { screen: "Mood" },
    },
    trigger: {
      hour: 0, // Start at midnight
      minute: 0,
      repeats: true,
      channelId: "mood-reminders",
    },
  });

  // Schedule every 6 hours (4 times per day)
  for (let i = 6; i < 24; i += 6) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "How are you feeling?",
        body: "It's time to log your current mood!",
        sound: true,
        data: { screen: "Mood" },
      },
      trigger: {
        hour: i,
        minute: 0,
        repeats: true,
        channelId: "mood-reminders",
      },
    });
  }
}

// Create notification channel (Android)
async function setupNotificationChannel() {
  await Notifications.setNotificationChannelAsync("mood-reminders", {
    name: "Mood reminders",
    importance: Notifications.AndroidImportance.HIGH,
    sound: true,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#00A86B",
  });
}

export {
  registerForPushNotificationsAsync,
  scheduleMoodReminder,
  setupNotificationChannel,
};
