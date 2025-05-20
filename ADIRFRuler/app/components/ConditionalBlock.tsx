import React from "react";
import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";

const operators = [">", ">=", "<", "<=", "="];

type Condition = {
    topic: string;
    property: string;
    operator: string;
    value: string;
    logic?: string;
  };
  
  type FrequencySetting = {
    topic: string;
    tier: string;
  };

export default function ConditionalBlock({
  topics,
  tierLabels,
  topicProperties,
  onRemove,
  conditions,
  frequencies,
  updateCondition,
  updateFrequency,
  addCondition,
  removeCondition,
  addFrequency,
  removeFrequency,
}: {
  topics: { name: string; color: string }[];
  tierLabels: string[];
  topicProperties: string[];
  conditions: Condition[];
  frequencies: FrequencySetting[];
  onRemove: () => void;
  updateCondition: (index: number, field: keyof Condition, value: string) => void;
  updateFrequency: (index: number, field: keyof FrequencySetting, value: string) => void;
  addCondition: () => void;
  removeCondition: (index: number) => void;
  addFrequency: () => void;
  removeFrequency: (index: number) => void;
}) {
  const usedFreqTopics = frequencies.map((f) => f.topic).filter(Boolean);
  const availableFreqTopics = topics.filter((t) => !usedFreqTopics.includes(t.name));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>IF</Text>
        <Button title="Remove Block" onPress={onRemove} color="#ff5555" />
      </View>

      {conditions.map((cond, i) => (
        <View key={i} style={{ width: "100%" }}>
          {i > 0 && (
            <Picker
              selectedValue={cond.logic}
              onValueChange={(val) => updateCondition(i, "logic", val)}
              style={styles.logicPicker}
            >
              <Picker.Item label="AND" value="AND" />
              <Picker.Item label="OR" value="OR" />
            </Picker>
          )}

          <View style={styles.conditionRow}>
            <Picker
              selectedValue={cond.topic}
              onValueChange={(val) => updateCondition(i, "topic", val)}
              style={styles.picker}
            >
              <Picker.Item label="Select Topic" value="" />
              {topics.map((t) => (
                <Picker.Item key={t.name + i} label={t.name} value={t.name} color={t.color} />
              ))}
            </Picker>

            <Picker
              selectedValue={cond.property}
              onValueChange={(val) => updateCondition(i, "property", val)}
              style={styles.picker}
            >
              <Picker.Item label="Property" value="" />
              {topicProperties.map((p) => (
                <Picker.Item key={p + i} label={p} value={p} />
              ))}
            </Picker>

            <Picker
              selectedValue={cond.operator}
              onValueChange={(val) => updateCondition(i, "operator", val)}
              style={styles.picker}
            >
              {operators.map((op) => (
                <Picker.Item key={op + i} label={op} value={op} />
              ))}
            </Picker>

            <TextInput
              placeholder="Value"
              value={cond.value}
              onChangeText={(val) => updateCondition(i, "value", val)}
              style={styles.input}
              keyboardType="numeric"
            />

            <Button
              title="X"
              onPress={() => removeCondition(i)}
              color="#ff5555"
              disabled={conditions.length === 1}
            />
          </View>
        </View>
      ))}

      <Button title="Add Condition" onPress={addCondition} />

      <View style={{ marginVertical: 20 }}>
        <Text style={styles.title}>THEN</Text>
      </View>

      {frequencies.map((freq, i) => (
        <View key={i} style={styles.frequencyRow}>
          <Picker
            selectedValue={freq.topic}
            onValueChange={(val) => updateFrequency(i, "topic", val)}
            style={styles.picker}
          >
            <Picker.Item label="Select Topic" value="" />
            {availableFreqTopics.map((t) => (
              <Picker.Item key={t.name + i} label={t.name} value={t.name} color={t.color} />
            ))}
            {freq.topic && !availableFreqTopics.some((t) => t.name === freq.topic) && (
              <Picker.Item label={freq.topic} value={freq.topic} />
            )}
          </Picker>

          <Picker
            selectedValue={freq.tier}
            onValueChange={(val) => updateFrequency(i, "tier", val)}
            style={styles.picker}
          >
            <Picker.Item label="Select Tier" value="" />
            {tierLabels.map((t) => (
              <Picker.Item key={t + i} label={t} value={t} />
            ))}
          </Picker>

          <Button title="X" onPress={() => removeFrequency(i)} color="#ff5555" />
        </View>
      ))}

      <Button title="Add Frequency" onPress={addFrequency} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: "90%",
    borderWidth: 1,
    borderColor: "black",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  conditionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "nowrap",
  },
  frequencyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  picker: {
    flex: 1,
    color: "black",
    backgroundColor: "transparent",
    marginHorizontal: 4,
  },
  input: {
    width: 70,
    color: "black",
    backgroundColor: "transparent",
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "black",
  },
  logicPicker: {
    marginVertical: 6,
    width: 100,
    alignSelf: "center",
    color: "black",
  },
});
