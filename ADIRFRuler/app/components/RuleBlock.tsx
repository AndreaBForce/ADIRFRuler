import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function RuleBlock({
  topic,
  status,
  topics,
  tierLabels,
  onUpdateTopic,
  onUpdateStatus,
  onRemove, // <-- new prop
}: {
  topic: string;
  status: string;
  topics: { name: string; color: string }[];
  tierLabels: string[];
  onUpdateTopic: (value: string) => void;
  onUpdateStatus: (value: string) => void;
  onRemove: () => void; // <-- new prop type
}) {
  return (
    <View style={styles.ruleBlock}>
      <View style={styles.headerRow}>
        <Text style={styles.ruleLabel}>Set Frequency</Text>
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <Picker
        selectedValue={topic}
        onValueChange={onUpdateTopic}
        style={styles.picker}
      >
        <Picker.Item label="Select Topic" value="" />
        {topics.map((t) => (
          <Picker.Item key={t.name} label={t.name} value={t.name} color={t.color} />
        ))}
      </Picker>

      <Picker
        selectedValue={status}
        onValueChange={onUpdateStatus}
        style={styles.picker}
      >
        <Picker.Item label="Select Tier" value="" />
        {tierLabels.map((label) => (
          <Picker.Item key={label} label={label} value={label} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  ruleBlock: {
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
  ruleLabel: {
    color: "black",
    fontSize: 16,
  },
  removeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#ff5555",
    borderRadius: 4,
  },
  removeButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 16,
  },
  picker: {
    color: "black",
    backgroundColor: "transparent",
    marginBottom: 10,
  },
});
