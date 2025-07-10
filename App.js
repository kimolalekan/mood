import AppRoutes from "./routes";
import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import {
  scheduleMoodReminder,
  setupNotificationChannel,
} from "./components/notifications";

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Setup notification channel
    setupNotificationChannel();

    // Schedule notifications
    scheduleMoodReminder();

    // Handle notifications received while app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    // Handle notification responses
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const screen = response.notification.request.content.data.screen;
        if (screen) {
          // Navigate to the specified screen when notification is tapped
          navigation.navigate(screen);
        }
      });

    return () => {
      // Clean up listeners
      Notifications.removeNotificationSubscription(
        notificationListener.current,
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return <AppRoutes />;
}
