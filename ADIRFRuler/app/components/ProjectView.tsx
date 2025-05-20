import { useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import RuleBlock from "../components/RuleBlock";

const topics = [
  { name: "/cmd_vel", color: "#f87171" },
  { name: "/odom", color: "#60a5fa" },
  { name: "/camera/camera_info", color: "#34d399" },
  { name: "/camera/image_raw/compressed", color: "#fbbf24" },
  { name: "/camera/image_raw", color: "#a78bfa" },
  { name: "/imu", color: "#38bdf8" },
  { name: "/joint_state", color: "#fb7185" },
  { name: "/scan", color: "#facc15" },
  { name: "/tf", color: "#4ade80" },
];

const tierLabels = [
  "Unacceptable",
  "Marginal",
  "Acceptable",
  "Desirable",
  "Competitive",
  "Excessive",
];

type Rule = {
  topic: string;
  status: string;
};

export default function ProjectView() {
  const [rules, setRules] = useState<Rule[]>([]);

  const addGlobalRule = () => {
    setRules([...rules, { topic: "", status: "" }]);
  };

  const updateRule = (index: number, field: keyof Rule, value: string) => {
    const updated = [...rules];
    updated[index] = { ...updated[index], [field]: value };
    setRules(updated);
  };

  const getAvailableTopics = (currentIndex: number) => {
    const usedTopics = rules
      .map((r, i) => (i === currentIndex ? null : r.topic))
      .filter((t): t is string => !!t);
    return topics.filter((t) => !usedTopics.includes(t.name));
  };

  const allTopicsUsed = rules.length >= topics.length;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

      <View style={styles.row}>
        <View style={styles.group}>
          <View style={styles.buttonWrapper}>
            <Button title="Add Global Default Rule" onPress={addGlobalRule} disabled={allTopicsUsed} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Add Conditional Block Rule" onPress={addGlobalRule} />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.group}>
          <View style={styles.buttonWrapper}>
            <Button title="Optimize Rules" onPress={addGlobalRule} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Download Project" onPress={addGlobalRule} />
          </View>
        </View>
      </View>

      <View style={styles.projectBox}>
        <Text style={styles.projectText}>Rule File</Text>
        {rules.map((rule, index) => (
          <RuleBlock
            key={index}
            topic={rule.topic}
            status={rule.status}
            topics={getAvailableTopics(index)}
            tierLabels={tierLabels}
            onUpdateTopic={(val) => updateRule(index, "topic", val)}
            onUpdateStatus={(val) => updateRule(index, "status", val)}
            onRemove={() => {
              const newRules = rules.filter((_, i) => i !== index);
              setRules(newRules);
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    width: "100%",
  },
  content: {
    paddingVertical: 20,
    alignItems: "center",
  },
  projectBox: {
    width: "100%",
    minHeight: 400,
    backgroundColor: "black",
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  projectText: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  group: {
    flexDirection: 'row',
  },
  buttonWrapper: {
    marginHorizontal: 5,
    width: 300,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
});
