import { useState } from "react";
import {
  Text,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

export default function TopicSetup() {

  return (
    <ScrollView contentContainerStyle={{ padding: 20, alignItems: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Add New Rule
      </Text>
    </ScrollView>
  );
}
