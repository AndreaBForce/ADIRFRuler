import React, { useState } from "react";
import {
  Text,
  ScrollView,
  TextInput,
  View,
  StyleSheet,
  Button,
} from "react-native";

const topics: Record<string, [number, number[]]> = {
  "/cmd_vel": [0.052, [5, 10, 15, 18, 20, 25]],
  "/odom": [0.72, [10, 15, 20, 25, 30, 35]],
  "/camera/camera_info": [0.38, [10, 15, 20, 25, 30, 35]],
  "/camera/image_raw/compressed": [420.0, [5, 10, 15, 20, 30, 35]],
  "/camera/image_raw": [6220.0, [2, 5, 10, 15, 20, 25]],
  "/imu": [0.32, [50, 75, 100, 150, 200, 250]],
  "/joint_state": [0.12, [2, 4, 6, 8, 10, 15]],
  "/scan": [2.94, [2, 4, 6, 8, 10, 15]],
  "/tf": [0.17, [2, 10, 20, 30, 40, 45]],
};

const tierLabels = [
  "Unacceptable",
  "Marginal",
  "Acceptable",
  "Desirable",
  "Competitive",
  "Excessive",
];

export default function TopicSetup() {
  const [data, setData] = useState(
    Object.keys(topics).reduce((acc, topic) => {
      acc[topic] = {
        messageSize: topics[topic][0].toString(),
        tiers: topics[topic][1].map((hz) => hz.toString()),
      };
      return acc;
    }, {} as Record<string, { messageSize: string; tiers: string[] }>)
  );

  const handleChange = (
    topic: string,
    field: string,
    value: string,
    tierIndex?: number
  ) => {
    setData((prev) => ({
      ...prev,
      [topic]: {
        ...prev[topic],
        messageSize: field === "messageSize" ? value : prev[topic].messageSize,
        tiers:
          field === "tier"
            ? prev[topic].tiers.map((v, i) => (i === tierIndex ? value : v))
            : prev[topic].tiers,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/save-parameters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        alert("Topic Parameters saved correctly!");
      } else {
        const errorText = await response.text();
        console.error("Failed to save:", errorText);
        alert("Failed to save topic parameters. Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("An error occurred. Please check your connection or console.");
    }
  };


  return (
    <ScrollView horizontal>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Topic</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Msg Size (KB)</Text>
          </View>
          {tierLabels.map((tier) => (
            <View style={styles.headerCell} key={tier}>
              <Text style={styles.headerText}>{tier}</Text>
            </View>
          ))}
        </View>

        {Object.keys(data).map((topic) => (
          <View key={topic} style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.cellText}>{topic}</Text>
            </View>
            <View style={styles.cell}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={data[topic].messageSize}
                onChangeText={(value) =>
                  handleChange(topic, "messageSize", value)
                }
              />
            </View>
            {data[topic].tiers.map((value, index) => (
              <View key={index} style={styles.cell}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={value}
                  onChangeText={(v) => handleChange(topic, "tier", v, index)}
                />
              </View>
            ))}
          </View>
        ))}

        <View style={{ marginTop: 30 }}>
          <Button title="Save Topic Parameters" onPress={handleSubmit} />
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const COLUMN_WIDTH = 130;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headerCell: {
    width: COLUMN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  cell: {
    width: COLUMN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  cellText: {
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    textAlign: "center",
    borderRadius: 5,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
  },
});
