import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import { router } from "expo-router";

const topics = [
  { name: "cmd_vel", color: "#f87171" },
  { name: "odom", color: "#60a5fa" },
  { name: "/camera/camera_info", color: "#34d399" },
  { name: "camera/image_raw/compressed", color: "#fbbf24" },
  { name: "camera/image_raw", color: "#a78bfa" },
  { name: "/imu", color: "#38bdf8" },
  { name: "/joint_state", color: "#fb7185" },
  { name: "/scan", color: "#facc15" },
  { name: "/tf", color: "#4ade80" },
];

const topicProperties: Record<string, string[]> = {
  cmd_vel: ["linear_x", "angular_z"],
  odom: ["position_x", "position_y", "position_z"],
};

export default function AddRuleScreen() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const properties = selectedTopic ? topicProperties[selectedTopic] || [] : [];

  return (
    <ScrollView contentContainerStyle={{ padding: 20, alignItems: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Add New Rule
      </Text>

      <Text style={{ fontWeight: "600", alignSelf: "flex-start", marginBottom: 10 }}>
        Topics
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 30 }}>
        {topics.map((topic, index) => (
          <TouchableOpacity
            key={index}
            style={{
              backgroundColor: topic.color,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 20,
              margin: 5,
              opacity: selectedTopic === topic.name ? 1 : 0.7,
              borderWidth: selectedTopic === topic.name ? 2 : 0,
              borderColor: "#000",
            }}
            onPress={() => setSelectedTopic(topic.name)}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>{topic.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedTopic && (
        <>
          <Text style={{ fontWeight: "600", alignSelf: "flex-start", marginBottom: 10 }}>
            Properties of {selectedTopic}
          </Text>

          {properties.length > 0 ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 30 }}>
              {properties.map((prop, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: "#c084fc",
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 20,
                    margin: 5,
                  }}
                  onPress={() => alert(`Selected property: ${prop}`)}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>{prop}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={{ fontStyle: "italic", color: "#888", marginBottom: 30 }}>
              No properties available.
            </Text>
          )}
        </>
      )}

      <Button title="Go Back" onPress={() => router.back()} />
    </ScrollView>
  );
}
