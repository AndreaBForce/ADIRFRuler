import { Stack } from "expo-router";
import TopicSetup from "./pages/TopicSetup";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "ADIRF Ruler: Rule generator tool for SmartTestudo",
        }}
      />
      <Stack.Screen
          name="pages/TopicSetup"
          options={{ title: 'ADIRF Ruler: Topic Setup' }}
      />
    </Stack>
  );
}